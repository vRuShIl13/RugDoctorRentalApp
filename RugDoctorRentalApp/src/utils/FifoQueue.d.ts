import { Queue } from "./Queue";
export declare class FifoQueue<T> implements Queue<T> {
    private items;
    enqueue(item: T): void;
    dequeue(): T | undefined;
    peek(): T | undefined;
    size(): number;
    isEmpty(): boolean;
}
//# sourceMappingURL=FifoQueue.d.ts.map