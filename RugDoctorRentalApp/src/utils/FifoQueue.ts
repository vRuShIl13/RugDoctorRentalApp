import type { Queue } from "./Queue.js";

export class FifoQueue<T> implements Queue<T> {
    private items: T[] = [];

    enqueue(item: T): void {
        this.items.push(item);  
    }

    dequeue(): T | undefined {
        return this.items.shift();
    }

    peek(): T | undefined {
        return this.items[0];   
    }

    size(): number {
        return this.items.length;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}


// Per machine -  machineId → reservation queue
// const reservationQueues = new Map<string, FifoQueue<Reservation>>();
