// machine.

import { MachineStatus } from "../enums/MachineStatus.js";

export interface RugDoctor {
    id: string;
    model: string;
    serialNumber: string;
    status: MachineStatus;
    lastMaintenanceDate: Date;
    dailyRate: number;
    totalRentals: number;
}


// const machines: RugDoctor[] = [];
// const machineMap = new Map<string, RugDoctor>();
// const activeRentals = new Set<string>(); // rental IDs
