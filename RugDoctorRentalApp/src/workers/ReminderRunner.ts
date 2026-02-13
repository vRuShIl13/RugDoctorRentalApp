import { Repository } from "../utils/Repository.js";
import { ReservationService } from "../services/ReservationService.js";
import { RentalService } from "../services/RentalService.js";
import type { Renter } from "../models/Renter.js";
import type { RugDoctor } from "../models/RugDoctor.js";
import {
    ConsoleEmailService,
    SendGridEmailService
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

    return new SendGridEmailService({
        apiKey,
        fromEmail,
        fromName: process.env.SENDGRID_FROM_NAME,
        sandboxMode: process.env.SENDGRID_SANDBOX === "true"
    });
}

function toNumberOrDefault(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}
