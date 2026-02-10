import type { Rental } from "../models/Rental.js";
import type { Reservation } from "../models/Reservation.js";
export declare class RentalService {
    private rentalRepository;
    private rugDoctorRepository;
    constructor();
    createRental(reservation: Reservation, lenderId: string): Rental;
    returnRental(rentalId: string): void;
}
//# sourceMappingURL=RentalService.d.ts.map