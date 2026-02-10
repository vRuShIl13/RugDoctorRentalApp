import { Repository } from "../utils/Repository.js";
import { isOverlapping } from "../utils/dateUtils.js";
import { FifoQueue } from "../utils/FifoQueue.js";
import { ReservationStatus } from "../enums/ReservationStatus.js";
export class ReservationService {
    queues = new Map();
    reservationRepository;
    rentalCalendar;
    constructor() {
        this.reservationRepository = new Repository();
        this.rentalCalendar = new Map();
    }
    createReservation(reservation) {
        const periods = this.rentalCalendar.get(reservation.machineId) ?? [];
        const hasConflict = periods.some(period => isOverlapping(period, reservation.rentalPeriod));
        if (!hasConflict) {
            reservation.status = ReservationStatus.Confirmed;
            this.reservationRepository.add(reservation.id, reservation);
            this.rentalCalendar.set(reservation.machineId, [...periods, reservation.rentalPeriod]);
            return reservation;
        }
        reservation.status = ReservationStatus.Pending;
        if (!this.queues.has(reservation.machineId)) {
            this.queues.set(reservation.machineId, new FifoQueue());
        }
        this.queues.get(reservation.machineId).enqueue(reservation);
        return reservation;
    }
    getNextQueuedReservation(machineId) {
        return this.queues.get(machineId)?.dequeue();
    }
}
//# sourceMappingURL=ReservationService.js.map