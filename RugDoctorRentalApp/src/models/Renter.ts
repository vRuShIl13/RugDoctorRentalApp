// Type of a person

import type { Person } from "./Person.js";

export interface Renter extends Person {
    driverLicenseNumber: string;
    isVerified: boolean;
    rentalHistory: number[];

}