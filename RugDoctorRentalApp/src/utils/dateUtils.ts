import type { RentalPeriod } from "../models/RentalPeriod.js";

export function isRentalPeriodValid(rentalPeriod: RentalPeriod): boolean {
    const { startDate, endDate } = rentalPeriod;
    if (startDate >= endDate) {
        return false; 
    }
    const today = new Date();
    if (startDate < today) {
        return false; 
    }
    return true;
}

export function isOverlapping(period1: RentalPeriod, period2: RentalPeriod): boolean {
    return period1.startDate < period2.endDate && period1.endDate > period2.startDate;
}