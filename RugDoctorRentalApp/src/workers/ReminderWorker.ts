import type { Repository } from "../utils/Repository.js";
import type { Renter } from "../models/Renter.js";
import type { EmailService } from "../services/EmailService.js";
import type { ReservationService } from "../services/ReservationService.js";
import type { RentalService } from "../services/RentalService.js";
import { formatDateTime } from "../utils/dateUtils.js";

export interface ReminderWorkerOptions {
    rentalService: RentalService;
    reservationService: ReservationService;
    renterRepository: Repository<Renter>;
    emailService: EmailService;
    // Local time the job should run each day.
    dailyHour?: number; // 0-23
    dailyMinute?: number; // 0-59
    // If true, run once immediately on startup.
    runOnStart?: boolean;
    // Injected time provider to simplify testing.
    now?: () => Date;
    // Optional logger for production visibility.
    logger?: (message: string) => void;
}

export interface ReminderWorkerHandle {
    stop: () => void;
}

// Schedules a daily reminder run. Uses setTimeout per run so daylight-savings changes
// do not permanently shift the execution time.
export function startDailyReminderWorker(options: ReminderWorkerOptions): ReminderWorkerHandle {
    const {
        rentalService,
        reservationService,
        renterRepository,
        emailService,
        dailyHour = 7,
        dailyMinute = 0,
        runOnStart = false,
        now = () => new Date(),
        logger
    } = options;

    let timerId: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;
    let running = false;

    const log = (message: string) => {
        if (logger) {
            logger(message);
        }
    };

    const runJob = async () => {
        if (running) {
            log("Reminder worker skipped a run because the previous run is still active.");
            return;
        }
        running = true;
        try {
            const result = await rentalService.sendDailyReservationReminders({
                reservationService,
                renterRepository,
                emailService,
                now: now()
            });
            log(
                `Reminder worker completed: checked=${result.checked}, dayBefore=${result.dayBeforeSent}, hoursBefore=${result.hoursBeforeSent}, failed=${result.failed}`
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            log(`Reminder worker failed: ${message}`);
        } finally {
            running = false;
        }
    };

    const scheduleNext = () => {
        if (stopped) {
            return;
        }

        const currentTime = now();
        const nextRun = new Date(currentTime.getTime());
        nextRun.setHours(dailyHour, dailyMinute, 0, 0);

        if (nextRun <= currentTime) {
            nextRun.setDate(nextRun.getDate() + 1);
        }

        const delayMs = nextRun.getTime() - currentTime.getTime();
        log(`Next reminder run scheduled for ${formatDateTime(nextRun)}.`);

        timerId = setTimeout(async () => {
            await runJob();
            scheduleNext();
        }, delayMs);
    };

    if (runOnStart) {
        void runJob();
    }

    scheduleNext();

    return {
        stop: () => {
            stopped = true;
            if (timerId) {
                clearTimeout(timerId);
            }
        }
    };
}
