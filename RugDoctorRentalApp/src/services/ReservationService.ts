
import { Reservation } from "../models/Reservation";
import { Repository } from "../utils/Repository";

export class ReservationService {
    private reservationRepository: Repository<Reservation>;

    constructor() {
        this.reservationRepository = new Repository<Reservation>();
    }

    createReservation(reservation: Reservation): void {
        this.reservationRepository.add(reservation.id, reservation);
    }

}
