import { Repository } from "./utils/Repository.js";
import { ReservationService } from "./services/ReservationService.js";
import type { Reservation } from "./models/Reservation.js";
import type { RugDoctor } from "./models/RugDoctor.js";
import { MachineStatus } from "./enums/MachineStatus.js";
import type { RentalPeriod } from "./models/RentalPeriod.js";
import { ReservationStatus } from "./enums/ReservationStatus.js";
import { RentalService } from "./services/RentalService.js";
import type { Renter } from "./models/Renter.js";
import {
  ConsoleEmailService,
  SendGridEmailService,
  type SendGridEmailConfig
} from "./services/EmailService.js";




let appName: string = "Rug Doctor Rental App";
let maxRentalDays: number = 2;
let isOperational: boolean = true;


console.log(`Welcome to the ${appName}!`);
console.log(`You can rent a rug doctor for up to ${maxRentalDays} days.`);
console.log(`Is the rental service operational? ${isOperational ? "Yes" : "No"}`);

const rentalCalendar = new Map<string, RentalPeriod[]>();

const reservationService = new ReservationService();
const machineRepository = new Repository<RugDoctor>();
const renterRepository = new Repository<Renter>();

const rentalService = new RentalService(machineRepository);
// Use SendGrid in production when credentials are available; otherwise fall back to console.
const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sendGridFromEmail = process.env.SENDGRID_FROM_EMAIL;
const sendGridFromName = process.env.SENDGRID_FROM_NAME;
const sendGridSandbox = process.env.SENDGRID_SANDBOX === "true";

let emailService;
if (sendGridApiKey && sendGridFromEmail) {
  const config: SendGridEmailConfig = {
    apiKey: sendGridApiKey,
    fromEmail: sendGridFromEmail,
    sandboxMode: sendGridSandbox
  };

  if (sendGridFromName !== undefined) {
    config.fromName = sendGridFromName;
  }

  emailService = new SendGridEmailService(config);
} else {
  emailService = new ConsoleEmailService();
}


// Example usage
const machine: RugDoctor = {
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
// RENTERS
// --------------------

const renter1: Renter = {
    id: "renter1",
    firstName: "Vrushil",
    lastName: "Patel",
    email: "vrushil13@gmail.com",
    phoneNumber: "431-374-1787",
    driverLicenseNumber: "D1234567",
    isVerified: true,
    rentalHistory: []
};

const renter2: Renter = {
    id: "renter2",
    firstName: "Luis",
    lastName: "Garcia",
    email: "vrushil13@gmail.com",
    phoneNumber: "555-333-4444",
    driverLicenseNumber: "G2345678",
    isVerified: true,
    rentalHistory: []
};

const renter3: Renter = {
    id: "renter3",
    firstName: "Mina",
    lastName: "Choi",
    email: "vrushil13@gmail.com",
    phoneNumber: "555-555-6666",
    driverLicenseNumber: "C3456789",
    isVerified: true,
    rentalHistory: []
};

renterRepository.add(renter1.id, renter1);
renterRepository.add(renter2.id, renter2);
renterRepository.add(renter3.id, renter3);

// --------------------
// TEST DATA
// --------------------

const period1: RentalPeriod = {
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-03"),
    totalDays: 2
};

// overlaps with period1
const period2: RentalPeriod = {
    startDate: new Date("2024-07-02"),
    endDate: new Date("2024-07-04"),
    totalDays: 2
};

// no overlap with period1
const period3: RentalPeriod = {
    startDate: new Date("2024-07-05"),
    endDate: new Date("2024-07-07"),
    totalDays: 2
}

// --------------------
// TEST 1: CONFIRMED RESERVATION
// --------------------
const reservation1: Reservation = {
    id: "res1",
    renterId: "renter1",
    machineId: machine.id,
    rentalPeriod: period1,
    creationDate: new Date(),
    status: ReservationStatus.Pending
};

const result1 = reservationService.createReservation(reservation1);
console.log("Test 1 - Confirmed Reservation:", result1);
console.assert(
  result1.status === ReservationStatus.Confirmed,
  " Reservation 1 should be CONFIRMED"
);


// --------------------------------------------------
// TEST 2: QUEUED RESERVATION (OVERLAP)
// --------------------------------------------------

const reservation2: Reservation = {
  id: "res2",
  renterId: "renter2",
  machineId: machine.id,
  rentalPeriod: period2,
  creationDate: new Date(),
  status: ReservationStatus.Pending,
};

const result2 = reservationService.createReservation(reservation2);

console.log("🧪 TEST 2 RESULT:", result2.status);
console.assert(
  result2.status === ReservationStatus.Pending,
  "❌ Reservation 2 should be Pending"
);

// --------------------------------------------------
// TEST 3: CONFIRMED RESERVATION (NO OVERLAP)
// --------------------------------------------------

const reservation3: Reservation = {
  id: "res3",
  renterId: "renter3",
  machineId: machine.id,
  rentalPeriod: period3,
  creationDate: new Date(),
  status: ReservationStatus.Pending,
};

const result3 = reservationService.createReservation(reservation3);

console.log("🧪 TEST 3 RESULT:", result3.status);
console.assert(
  result3.status === ReservationStatus.Confirmed,
  "❌ Reservation 3 should be CONFIRMED"
);

console.log("\n📦 All reservations:");
console.log(reservationService["reservationRepository"]?.getAll?.() ?? "Repo access not exposed");

console.log("\n🎉 ALL TESTS COMPLETED\n");

console.log("Next queued reservation for machine1:", reservationService.getNextQueuedReservation(machine.id));

// --------------------------------------------------
// DAILY REMINDER RUN (SIMULATED)
// --------------------------------------------------
// We pass a fixed "now" so the sample reminders are deterministic in the demo.
rentalService
  .sendDailyReservationReminders({
    reservationService,
    renterRepository,
    emailService,
    now: new Date("2024-06-30T08:00:00")
  })
  .then(reminderRun => {
    console.log("Reminder run summary:", reminderRun);
  })
  .catch(error => {
    console.error("Reminder run failed:", error);
  });

if (machine.status === MachineStatus.Available) {
    const rental = rentalService.createRental(result1, "lender1");
    
    console.log("Created rental from reservation 1:", rental);
    console.log("Updated machine status:", machine.status);
    rentalService.returnRental(rental.id);
    console.log("Returned rental:", rental.id);
    console.log("Updated machine status:", machine.status);
}
