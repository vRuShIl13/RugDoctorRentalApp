// Reserving the machine

import { RentalPeriod } from "./RentalPeriod";

export interface Reservation {
    id: number;
    renterId: number;
    machineId: number;
    rentalPeriod: RentalPeriod;
    creationDate: Date;
    status: string; // e.g., "Reserved", "Canceled", "Completed"
}