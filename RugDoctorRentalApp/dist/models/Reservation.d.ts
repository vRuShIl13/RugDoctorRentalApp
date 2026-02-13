import type { RentalPeriod } from "./RentalPeriod.js";
import { ReservationStatus } from "../enums/ReservationStatus.js";
export type ReservationReminderType = "DayBefore" | "HoursBefore";
export interface ReservationReminderLog {
    dayBeforeSentAt?: Date;
    hoursBeforeSentAt?: Date;
}
export interface Reservation {
    id: string;
    renterId: string;
    machineId: string;
    rentalPeriod: RentalPeriod;
    creationDate: Date;
    status: ReservationStatus;
    reminderLog?: ReservationReminderLog;
}
//# sourceMappingURL=Reservation.d.ts.map