// src/services/RentalService.ts
import type { Rental } from "../models/Rental.js";
import { RentalStatus } from "../enums/RentalStatus.js";
import type { Reservation } from "../models/Reservation.js";
import { Repository } from "../utils/Repository.js";
import type { RugDoctor } from "../models/RugDoctor.js";
import { MachineStatus } from "../enums/MachineStatus.js";


export class RentalService {
    private rentalRepository: Repository<Rental>;
    private rugDoctorRepository: Repository<RugDoctor>; 

    constructor() {
        this.rentalRepository = new Repository<Rental>();
        this.rugDoctorRepository = new Repository<RugDoctor>();
    }

    createRental(reservation: Reservation, lenderId: string): Rental {
        if (reservation.status !== "Confirmed") {
            throw new Error("Only confirmed reservations can be converted to rentals.");
        }

        const machine = this.rugDoctorRepository.get(reservation.machineId);
        if (!machine) {
        throw new Error("Machine not found");
        };

        const rental: Rental = {
            id: `rental_${reservation.id}_${Date.now()}`,
            renterId: reservation.renterId,
            reservationId: reservation.id,
            lenderId,
            machineId: reservation.machineId,
            status: RentalStatus.Active,
            totalCost: reservation.rentalPeriod.totalDays * machine.dailyRate
        }

        this.rentalRepository.add(rental.id, rental);
        machine.status = MachineStatus.Rented;
        this.rugDoctorRepository.update(machine.id, machine);
        return rental;

    }


    returnRental(rentalId: string): void {
        const rental = this.rentalRepository.get(rentalId);
        if (!rental) {
            throw new Error("Rental not found");
        }
        if (rental.status !== RentalStatus.Active) {
            throw new Error("Only active rentals can be returned.");
        }
        rental.status = RentalStatus.Completed;
        this.rentalRepository.update(rental.id, rental);
        const machine = this.rugDoctorRepository.get(rental.machineId);
        if (machine) {
            machine.status = MachineStatus.Available;
            this.rugDoctorRepository.update(machine.id, machine);
        }
    }

}