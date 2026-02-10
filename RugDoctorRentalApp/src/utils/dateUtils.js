"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRentalPeriodValid = isRentalPeriodValid;
exports.isOverlapping = isOverlapping;
const RentalPeriod_1 = require("../models/RentalPeriod");
function isRentalPeriodValid(rentalPeriod) {
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
function isOverlapping(period1, period2) {
    return period1.startDate < period2.endDate && period1.endDate > period2.startDate;
}
//# sourceMappingURL=dateUtils.js.map