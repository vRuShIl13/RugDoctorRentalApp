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
//# sourceMappingURL=RugDoctor.d.ts.map