import type { RentalPeriod } from "./RentalPeriod.js";
import { ReservationStatus } from "../enums/ReservationStatus.js";
export interface Reservation {
    id: string;
    renterId: string;
    machineId: string;
    rentalPeriod: RentalPeriod;
    creationDate: Date;
    status: ReservationStatus;
}
//# sourceMappingURL=Reservation.d.ts.map