export class FifoQueue {
    items = [];
    enqueue(item) {
        this.items.push(item);
    }
    dequeue() {
        return this.items.shift();
    }
    peek() {
        return this.items[0];
    }
    size() {
        return this.items.length;
    }
    isEmpty() {
        return this.items.length === 0;
    }
}
// Per machine -  machineId → reservation queue
// const reservationQueues = new Map<string, FifoQueue<Reservation>>();
//# sourceMappingURL=FifoQueue.js.map