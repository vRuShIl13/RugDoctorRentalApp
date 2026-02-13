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

// Non-mutating helper for date math (keeps original Date instances intact).
export function addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

// Non-mutating helper for date math (keeps original Date instances intact).
export function addDays(date: Date, days: number): Date {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}


// Returns a positive number if "later" is after "earlier".
export function differenceInHours(later: Date, earlier: Date): number {
    return (later.getTime() - earlier.getTime()) / (60 * 60 * 1000);
}


// Simple, readable date/time formatting for customer-facing messages.
export function formatDateTime(date: Date): string {
    return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
}

