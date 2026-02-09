// type of a person 
import { Person } from "./Person";

export interface Lender extends Person {
    storeName: string;
    location: string;
    contactNumber: string;
    rentalHistory: number[];
}
