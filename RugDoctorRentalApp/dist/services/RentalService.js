import { RentalStatus } from "../enums/RentalStatus.js";
import { Repository } from "../utils/Repository.js";
import { MachineStatus } from "../enums/MachineStatus.js";
import { differenceInHours, formatDateTime } from "../utils/dateUtils.js";
const DEFAULT_DAY_BEFORE_HOURS = 24;
const DEFAULT_HOURS_BEFORE_HOURS = 2;
export class RentalService {
    rentalRepository;
    rugDoctorRepository;
    constructor(machineRepository) {
        this.rentalRepository = new Repository();
        this.rugDoctorRepository = machineRepository;
    }
    // Daily batch job: checks all machines and confirmed reservations, then sends reminders.
    // This keeps reminder logic centralized and prevents duplicate notifications via reminder logs.
    async sendDailyReservationReminders(options) {
        const { reservationService, renterRepository, emailService, dayBeforeHours = DEFAULT_DAY_BEFORE_HOURS, hoursBeforeHours = DEFAULT_HOURS_BEFORE_HOURS, now = new Date() } = options;
        const result = {
            checked: 0,
            dayBeforeSent: 0,
            hoursBeforeSent: 0,
            skippedNoRenter: 0,
            skippedNoEmail: 0,
            skippedNotDue: 0,
            failed: 0
        };
        const machines = this.rugDoctorRepository.getAll();
        for (const machine of machines) {
            const confirmedReservations = reservationService.getConfirmedReservationsByMachine(machine.id);
            for (const reservation of confirmedReservations) {
                result.checked += 1;
                const renter = renterRepository.get(reservation.renterId);
                if (!renter) {
                    result.skippedNoRenter += 1;
                    continue;
                }
                if (!renter.email) {
                    result.skippedNoEmail += 1;
                    continue;
                }
                const hoursUntilStart = differenceInHours(reservation.rentalPeriod.startDate, now);
                // If the reservation already started, no reminder is needed.
                if (hoursUntilStart < 0) {
                    result.skippedNotDue += 1;
                    continue;
                }
                const reminderLog = reservation.reminderLog ?? {};
                // We send "hours-before" reminders only when within the window.
                const shouldSendHoursBefore = hoursUntilStart <= hoursBeforeHours &&
                    !reminderLog.hoursBeforeSentAt;
                // We send "day-before" reminders when the reservation is soon,
                // but still outside the last-hours window (prevents duplicate messaging).
                const shouldSendDayBefore = hoursUntilStart <= dayBeforeHours &&
                    hoursUntilStart > hoursBeforeHours &&
                    !reminderLog.dayBeforeSentAt;
                if (shouldSendHoursBefore) {
                    const reminderLabel = hoursBeforeHours === 1 ? "1 hour" : `${hoursBeforeHours} hours`;
                    try {
                        await emailService.sendEmail(this.buildReminderEmail({
                            renter,
                            reservation,
                            machineModel: machine.model,
                            machineId: machine.id,
                            reminderLabel,
                            pickupTime: reservation.rentalPeriod.startDate
                        }));
                        reservationService.recordReminderSent(reservation.id, "HoursBefore", now);
                        result.hoursBeforeSent += 1;
                    }
                    catch {
                        result.failed += 1;
                    }
                    continue;
                }
                if (shouldSendDayBefore) {
                    const dayCount = dayBeforeHours / 24;
                    const reminderLabel = dayBeforeHours % 24 === 0
                        ? `${dayCount} day${dayCount === 1 ? "" : "s"}`
                        : `${dayBeforeHours} hours`;
                    try {
                        await emailService.sendEmail(this.buildReminderEmail({
                            renter,
                            reservation,
                            machineModel: machine.model,
                            machineId: machine.id,
                            reminderLabel,
                            pickupTime: reservation.rentalPeriod.startDate
                        }));
                        reservationService.recordReminderSent(reservation.id, "DayBefore", now);
                        result.dayBeforeSent += 1;
                    }
                    catch {
                        result.failed += 1;
                    }
                    continue;
                }
                result.skippedNotDue += 1;
            }
        }
        return result;
    }
    buildReminderEmail(params) {
        const fullName = `${params.renter.firstName} ${params.renter.lastName}`.trim();
        const subject = `Reminder: Your Rug Doctor reservation is ${params.reminderLabel} away`;
        const bodyLines = [
            `Hello ${fullName || "Customer"},`,
            "",
            "This is a reminder that your Rug Doctor reservation is confirmed and ready for pickup.",
            `Reservation ID: ${params.reservation.id}`,
            `Pickup time: ${formatDateTime(params.pickupTime)}`,
            `Machine: ${params.machineModel} (${params.machineId})`,
            "",
            "If you need to reschedule or cancel, please contact us as soon as possible.",
            "Thank you for choosing Rug Doctor!"
        ];
        return {
            to: params.renter.email,
            subject,
            body: bodyLines.join("\n")
        };
    }
    createRental(reservation, lenderId) {
        if (reservation.status !== "Confirmed") {
            throw new Error("Only confirmed reservations can be converted to rentals.");
        }
        const machine = this.rugDoctorRepository.get(reservation.machineId);
        if (!machine) {
            throw new Error("Machine not found");
        }
        ;
        const rental = {
            id: `rental_${reservation.id}_${Date.now()}`,
            renterId: reservation.renterId,
            reservationId: reservation.id,
            lenderId,
            machineId: reservation.machineId,
            status: RentalStatus.Active,
            totalCost: reservation.rentalPeriod.totalDays * machine.dailyRate
        };
        this.rentalRepository.add(rental.id, rental);
        machine.status = MachineStatus.Rented;
        this.rugDoctorRepository.update(machine.id, machine);
        return rental;
    }
    returnRental(rentalId) {
        const rental = this.rentalRepository.get(rentalId);
        if (!rental) {
            throw new Error("Rental not found");
        }
        if (rental.status !== RentalStatus.Active) {
            throw new Error("Only active rentals can be returned.");
        }
        rental.status = RentalStatus.Completed;
        this.rentalRepository.update(rental.id, rental);
        const machine = this.rugDoctorRepository.get(rental.machineId);
        if (machine) {
            machine.status = MachineStatus.Available;
            this.rugDoctorRepository.update(machine.id, machine);
        }
    }
}
//# sourceMappingURL=RentalService.js.map