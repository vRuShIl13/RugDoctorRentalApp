import { Repository } from "../utils/Repository.js";
import { ReservationService } from "../services/ReservationService.js";
import { RentalService } from "../services/RentalService.js";
import type { Renter } from "../models/Renter.js";
import type { RugDoctor } from "../models/RugDoctor.js";
import { MachineStatus } from "../enums/MachineStatus.js";
import { ReservationStatus } from "../enums/ReservationStatus.js";
import type { Reservation } from "../models/Reservation.js";
import {
    ConsoleEmailService,
    SendGridEmailService,
    type SendGridEmailConfig
} from "../services/EmailService.js";
import { startDailyReminderWorker } from "./ReminderWorker.js";

// Production runner entrypoint.
// Replace in-memory repositories with database-backed implementations.
const machineRepository = new Repository<RugDoctor>();
const renterRepository = new Repository<Renter>();
const reservationService = new ReservationService({
    returnBufferHours: toNumberOrDefault(process.env.RETURN_BUFFER_HOURS, 2)
});
const rentalService = new RentalService(machineRepository);

if (process.env.SEED_REMINDER_DEMO === "true") {
    seedDemoData();
}

const emailService = buildEmailServiceFromEnv();

const worker = startDailyReminderWorker({
    rentalService,
    reservationService,
    renterRepository,
    emailService,
    dailyHour: toNumberOrDefault(process.env.REMINDER_DAILY_HOUR, 7),
    dailyMinute: toNumberOrDefault(process.env.REMINDER_DAILY_MINUTE, 0),
    runOnStart: process.env.REMINDER_RUN_ON_START === "true",
    logger: message => console.log(`[ReminderWorker] ${message}`)
});

const shutdown = () => {
    worker.stop();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function buildEmailServiceFromEnv() {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;

    if (!apiKey || !fromEmail) {
        console.warn(
            "SendGrid credentials not found. Falling back to ConsoleEmailService."
        );
        return new ConsoleEmailService();
    }

    const config: SendGridEmailConfig = {
        apiKey,
        fromEmail,
        sandboxMode: process.env.SENDGRID_SANDBOX === "true"
    };

    const fromName = process.env.SENDGRID_FROM_NAME;
    if (fromName !== undefined) {
        config.fromName = fromName;
    }

    return new SendGridEmailService(config);
}

function toNumberOrDefault(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function seedDemoData(): void {
    const machine: RugDoctor = {
        id: "machine_demo_1",
        model: "RugDoctor X200",
        serialNumber: "RD-DEMO-001",
        status: MachineStatus.Available,
        lastMaintenanceDate: new Date(),
        dailyRate: 49.99,
        totalRentals: 0
    };

    machineRepository.add(machine.id, machine);

    // Use an explicit seed email if provided; fallback to SendGrid from email.
    // This prevents accidentally sending to an unknown address.
    const seedEmail =
        process.env.SEED_RENTER_EMAIL ??
        process.env.SENDGRID_TO_EMAIL ??
        process.env.SENDGRID_FROM_EMAIL ??
        "test@example.com";

    const renter: Renter = {
        id: "renter_demo_1",
        firstName: "Demo",
        lastName: "Renter",
        email: seedEmail,
        phoneNumber: "555-000-0000",
        driverLicenseNumber: "DEMO-0001",
        isVerified: true,
        rentalHistory: []
    };

    renterRepository.add(renter.id, renter);

    const startDate = new Date(Date.now() + 90 * 60 * 1000); // 90 minutes from now
    const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    const reservation: Reservation = {
        id: "reservation_demo_1",
        renterId: renter.id,
        machineId: machine.id,
        rentalPeriod: {
            startDate,
            endDate,
            totalDays: 1
        },
        creationDate: new Date(),
        status: ReservationStatus.Pending
    };

    reservationService.createReservation(reservation);
}
