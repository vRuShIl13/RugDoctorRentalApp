// Type of a person

import { Person } from "./Person";

export interface Renter extends Person {
    driverLicenseNumber: string;
    isVerified: boolean;
    rentalHistory: number[];

}