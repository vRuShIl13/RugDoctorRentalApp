// machine.

import { MachineStatus } from "../enums/MachineStatus";

export interface RugDoctor {
    id: number;
    model: string;
    serialNumber: string;
    status: MachineStatus;
    lastMaintenanceDate: Date;
    totalRentals: number;
}