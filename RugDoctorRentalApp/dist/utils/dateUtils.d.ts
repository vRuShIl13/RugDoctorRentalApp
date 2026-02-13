import type { RentalPeriod } from "../models/RentalPeriod.js";
export declare function isRentalPeriodValid(rentalPeriod: RentalPeriod): boolean;
export declare function isOverlapping(period1: RentalPeriod, period2: RentalPeriod): boolean;
export declare function addHours(date: Date, hours: number): Date;
export declare function addDays(date: Date, days: number): Date;
export declare function differenceInHours(later: Date, earlier: Date): number;
export declare function formatDateTime(date: Date): string;
//# sourceMappingURL=dateUtils.d.ts.map