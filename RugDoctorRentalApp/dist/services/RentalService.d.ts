import type { Rental } from "../models/Rental.js";
import type { Reservation } from "../models/Reservation.js";
import { Repository } from "../utils/Repository.js";
import type { RugDoctor } from "../models/RugDoctor.js";
export declare class RentalService {
    private rentalRepository;
    private rugDoctorRepository;
    constructor(machineRepository: Repository<RugDoctor>);
    createRental(reservation: Reservation, lenderId: string): Rental;
    returnRental(rentalId: string): void;
}
//# sourceMappingURL=RentalService.d.ts.map