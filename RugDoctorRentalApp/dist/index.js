import { Repository } from "./utils/Repository.js";
import { ReservationService } from "./services/ReservationService.js";
import { MachineStatus } from "./enums/MachineStatus.js";
import { ReservationStatus } from "./enums/ReservationStatus.js";
import { RentalService } from "./services/RentalService.js";
let appName = "Rug Doctor Rental App";
let maxRentalDays = 2;
let isOperational = true;
console.log(`Welcome to the ${appName}!`);
console.log(`You can rent a rug doctor for up to ${maxRentalDays} days.`);
console.log(`Is the rental service operational? ${isOperational ? "Yes" : "No"}`);
const rentalCalendar = new Map();
const reservationService = new ReservationService();
const machineRepository = new Repository();
const rentalService = new RentalService(machineRepository);
// Example usage
const machine = {
    id: "machine1",
    model: "RugDoctor X200",
    serialNumber: "RD-001",
    dailyRate: 49.99,
    status: MachineStatus.Available,
    lastMaintenanceDate: new Date("2024-01-15"),
    totalRentals: 0
};
machineRepository.add(machine.id, machine);
console.log("Created machine:", machine);
// --------------------
// TEST DATA
// --------------------
const period1 = {
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-03"),
    totalDays: 2
};
// overlaps with period1
const period2 = {
    startDate: new Date("2024-07-02"),
    endDate: new Date("2024-07-04"),
    totalDays: 2
};
// no overlap with period1
const period3 = {
    startDate: new Date("2024-07-05"),
    endDate: new Date("2024-07-07"),
    totalDays: 2
};
// --------------------
// TEST 1: CONFIRMED RESERVATION
// --------------------
const reservation1 = {
    id: "res1",
    renterId: "renter1",
    machineId: machine.id,
    rentalPeriod: period1,
    creationDate: new Date(),
    status: ReservationStatus.Pending
};
const result1 = reservationService.createReservation(reservation1);
console.log("Test 1 - Confirmed Reservation:", result1);
console.assert(result1.status === ReservationStatus.Confirmed, " Reservation 1 should be CONFIRMED");
// --------------------------------------------------
// TEST 2: QUEUED RESERVATION (OVERLAP)
// --------------------------------------------------
const reservation2 = {
    id: "res2",
    renterId: "renter2",
    machineId: machine.id,
    rentalPeriod: period2,
    creationDate: new Date(),
    status: ReservationStatus.Pending,
};
const result2 = reservationService.createReservation(reservation2);
console.log("🧪 TEST 2 RESULT:", result2.status);
console.assert(result2.status === ReservationStatus.Pending, "❌ Reservation 2 should be Pending");
// --------------------------------------------------
// TEST 3: CONFIRMED RESERVATION (NO OVERLAP)
// --------------------------------------------------
const reservation3 = {
    id: "res3",
    renterId: "renter3",
    machineId: machine.id,
    rentalPeriod: period3,
    creationDate: new Date(),
    status: ReservationStatus.Pending,
};
const result3 = reservationService.createReservation(reservation3);
console.log("🧪 TEST 3 RESULT:", result3.status);
console.assert(result3.status === ReservationStatus.Confirmed, "❌ Reservation 3 should be CONFIRMED");
console.log("\n📦 All reservations:");
console.log(reservationService["reservationRepository"]?.getAll?.() ?? "Repo access not exposed");
console.log("\n🎉 ALL TESTS COMPLETED\n");
console.log("Next queued reservation for machine1:", reservationService.getNextQueuedReservation(machine.id));
if (machine.status === MachineStatus.Available) {
    const rental = rentalService.createRental(result1, "lender1");
    console.log("Created rental from reservation 1:", rental);
    console.log("Updated machine status:", machine.status);
    rentalService.returnRental(rental.id);
    console.log("Returned rental:", rental.id);
    console.log("Updated machine status:", machine.status);
}
//# sourceMappingURL=index.js.map