
import type { Reservation, ReservationReminderType } from "../models/Reservation.js";
import { Repository } from "../utils/Repository.js";
import { addHours, isOverlapping } from "../utils/dateUtils.js";
import { FifoQueue } from "../utils/FifoQueue.js";
import type { RentalPeriod } from "../models/RentalPeriod.js";
import { ReservationStatus } from "../enums/ReservationStatus.js";

export interface ReservationServiceOptions {
    returnBufferHours?: number;
}

const DEFAULT_RETURN_BUFFER_HOURS = 2;

export class ReservationService {
    private queues = new Map<string, FifoQueue<Reservation>>();

    private reservationRepository: Repository<Reservation>;

    private rentalCalendar: Map<string, RentalPeriod[]>;

    private returnBufferHours: number;
    
    constructor(options: ReservationServiceOptions = {}) {
        this.reservationRepository = new Repository<Reservation>();
        this.rentalCalendar = new Map<string, RentalPeriod[]>();
        this.returnBufferHours = options.returnBufferHours ?? DEFAULT_RETURN_BUFFER_HOURS;
    }

    createReservation(reservation: Reservation): Reservation {
        const periods = this.rentalCalendar.get(reservation.machineId) ?? [];

        // We add a small return buffer so a late return does not collide with the next pickup.
        // This prevents back-to-back reservations from starting at the exact return time.
        const hasConflict = periods.some(period => {
            const bufferedPeriod = this.applyReturnBuffer(period);
            return isOverlapping(bufferedPeriod, reservation.rentalPeriod);
        });
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

    getAllReservations(): Reservation[] {
        return this.reservationRepository.getAll();
    }

    getConfirmedReservationsByMachine(machineId: string): Reservation[] {
        return this.reservationRepository
            .getAll()
            .filter(reservation => reservation.machineId === machineId)
            .filter(reservation => reservation.status === ReservationStatus.Confirmed);
    }

    recordReminderSent(
        reservationId: string,
        reminderType: ReservationReminderType,
        sentAt: Date = new Date()
    ): void {
        const reservation = this.reservationRepository.get(reservationId);
        if (!reservation) {
            throw new Error("Reservation not found for reminder update.");
        }

        const reminderLog = reservation.reminderLog ?? {};
        if (reminderType === "DayBefore") {
            reminderLog.dayBeforeSentAt = sentAt;
        } else {
            reminderLog.hoursBeforeSentAt = sentAt;
        }

        reservation.reminderLog = reminderLog;
        this.reservationRepository.update(reservation.id, reservation);
    }

    getReturnBufferHours(): number {
        return this.returnBufferHours;
    }

    private applyReturnBuffer(period: RentalPeriod): RentalPeriod {
        if (this.returnBufferHours <= 0) {
            return period;
        }
        return {
            ...period,
            endDate: addHours(period.endDate, this.returnBufferHours)
        };
    }

}