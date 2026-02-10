// type of a person 
// type of a person

import type { Person } from "./Person.js";

export interface Lender extends Person {
    storeName: string;
    location: string;
    contactNumber: string;
    rentalHistory: number[];
}
