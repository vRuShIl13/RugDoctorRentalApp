
import type { RentalStatus } from "../enums/RentalStatus.js";

export interface Rental {
    id: string;
    renterId: string;
    reservationId: string;
    lenderId: string;
    machineId: string;
    status: RentalStatus;
    totalCost: number;
}