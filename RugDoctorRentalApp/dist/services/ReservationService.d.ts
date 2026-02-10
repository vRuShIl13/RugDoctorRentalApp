import type { Reservation } from "../models/Reservation.js";
export declare class ReservationService {
    private queues;
    private reservationRepository;
    private rentalCalendar;
    constructor();
    createReservation(reservation: Reservation): Reservation;
    getNextQueuedReservation(machineId: string): Reservation | undefined;
}
//# sourceMappingURL=ReservationService.d.ts.map