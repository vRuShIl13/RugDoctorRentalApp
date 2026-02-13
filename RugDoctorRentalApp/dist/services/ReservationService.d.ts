import type { Reservation, ReservationReminderType } from "../models/Reservation.js";
export interface ReservationServiceOptions {
    returnBufferHours?: number;
}
export declare class ReservationService {
    private queues;
    private reservationRepository;
    private rentalCalendar;
    private returnBufferHours;
    constructor(options?: ReservationServiceOptions);
    createReservation(reservation: Reservation): Reservation;
    getNextQueuedReservation(machineId: string): Reservation | undefined;
    getAllReservations(): Reservation[];
    getConfirmedReservationsByMachine(machineId: string): Reservation[];
    recordReminderSent(reservationId: string, reminderType: ReservationReminderType, sentAt?: Date): void;
    getReturnBufferHours(): number;
    private applyReturnBuffer;
}
//# sourceMappingURL=ReservationService.d.ts.map