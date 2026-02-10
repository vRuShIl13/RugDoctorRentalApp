"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FifoQueue = void 0;
const Queue_1 = require("./Queue");
class FifoQueue {
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
exports.FifoQueue = FifoQueue;
// Per machine -  machineId → reservation queue
// const reservationQueues = new Map<string, FifoQueue<Reservation>>();
//# sourceMappingURL=FifoQueue.js.map