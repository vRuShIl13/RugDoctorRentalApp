import type { Rental } from "../models/Rental.js";
import type { Reservation } from "../models/Reservation.js";
import { Repository } from "../utils/Repository.js";
import type { RugDoctor } from "../models/RugDoctor.js";
import type { Renter } from "../models/Renter.js";
import type { ReservationService } from "./ReservationService.js";
import type { EmailService } from "./EmailService.js";
export interface ReminderRunOptions {
    reservationService: ReservationService;
    renterRepository: Repository<Renter>;
    emailService: EmailService;
    dayBeforeHours?: number;
    hoursBeforeHours?: number;
    now?: Date;
}
export interface ReminderRunResult {
    checked: number;
    dayBeforeSent: number;
    hoursBeforeSent: number;
    skippedNoRenter: number;
    skippedNoEmail: number;
    skippedNotDue: number;
    failed: number;
}
export declare class RentalService {
    private rentalRepository;
    private rugDoctorRepository;
    constructor(machineRepository: Repository<RugDoctor>);
    sendDailyReservationReminders(options: ReminderRunOptions): Promise<ReminderRunResult>;
    private buildReminderEmail;
    createRental(reservation: Reservation, lenderId: string): Rental;
    returnRental(rentalId: string): void;
}
//# sourceMappingURL=RentalService.d.ts.map