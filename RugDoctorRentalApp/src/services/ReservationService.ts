
import type { Reservation } from "../models/Reservation.js";
import { Repository } from "../utils/Repository.js";
import { isOverlapping } from "../utils/dateUtils.js";
import { FifoQueue } from "../utils/FifoQueue.js";
import type { RentalPeriod } from "../models/RentalPeriod.js";
import { ReservationStatus } from "../enums/ReservationStatus.js";

export class ReservationService {
    private queues = new Map<string, FifoQueue<Reservation>>();

    private reservationRepository: Repository<Reservation>;

    private rentalCalendar: Map<string, RentalPeriod[]>;
    
    constructor() {
        this.reservationRepository = new Repository<Reservation>();
        this.rentalCalendar = new Map<string, RentalPeriod[]>();
    }

    createReservation(reservation: Reservation): Reservation {
        const periods = this.rentalCalendar.get(reservation.machineId) ?? [];

        const hasConflict = periods.some(period => isOverlapping(period, reservation.rentalPeriod));


        if (!hasConflict) {
            reservation.status = ReservationStatus.Confirmed;
            this.reservationRepository.add(reservation.id, reservation);


            this.rentalCalendar.set(reservation.machineId,[...periods, reservation.rentalPeriod]);

            return reservation;
        } 

        reservation.status = ReservationStatus.Pending;
        if (!this.queues.has(reservation.machineId)) {
            this.queues.set(reservation.machineId, new FifoQueue());
        }

        this.queues.get(reservation.machineId)!.enqueue(reservation);
        return reservation;

    }

    getNextQueuedReservation(machineId: string): Reservation | undefined {
        return this.queues.get(machineId)?.dequeue();
    }

}
