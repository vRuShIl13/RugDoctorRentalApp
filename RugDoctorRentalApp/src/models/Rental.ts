import { RentalStatus } from "../enums/RentalStatus";

export interface Rental {
    id: number;
    renterId: number;
    reservationId: number;
    lenderId: number;
    machineId: number;
    status: RentalStatus;
    totalCost: number;
}