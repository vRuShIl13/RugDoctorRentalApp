import { RentalStatus } from "../enums/RentalStatus.js";
import { Repository } from "../utils/Repository.js";
import { MachineStatus } from "../enums/MachineStatus.js";
export class RentalService {
    rentalRepository;
    rugDoctorRepository;
    constructor(machineRepository) {
        this.rentalRepository = new Repository();
        this.rugDoctorRepository = machineRepository;
    }
    createRental(reservation, lenderId) {
        if (reservation.status !== "Confirmed") {
            throw new Error("Only confirmed reservations can be converted to rentals.");
        }
        const machine = this.rugDoctorRepository.get(reservation.machineId);
        if (!machine) {
            throw new Error("Machine not found");
        }
        ;
        const rental = {
            id: `rental_${reservation.id}_${Date.now()}`,
            renterId: reservation.renterId,
            reservationId: reservation.id,
            lenderId,
            machineId: reservation.machineId,
            status: RentalStatus.Active,
            totalCost: reservation.rentalPeriod.totalDays * machine.dailyRate
        };
        this.rentalRepository.add(rental.id, rental);
        machine.status = MachineStatus.Rented;
        this.rugDoctorRepository.update(machine.id, machine);
        return rental;
    }
    returnRental(rentalId) {
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
//# sourceMappingURL=RentalService.js.map