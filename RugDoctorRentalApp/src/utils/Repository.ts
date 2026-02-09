// middle man - repository for data access, can be extended to include caching, logging, etc.

export class Repository<T> {
    private storage: Map<number, T>;

    constructor() {
        this.storage = new Map<number, T>();
    }

    add(id: number, item: T): void {
        this.storage.set(id, item);
    }

    get(id: number): T | undefined {
        return this.storage.get(id);
    }

    getAll(): T[] {
        return Array.from(this.storage.values());
    }

    update(id: number, item: T): void {
        if (this.storage.has(id)) {
            this.storage.set(id, item);
        } else {
            throw new Error(`Item with id ${id} does not exist.`);
        }

    }
    
    delete(id: number): void {
        if (this.storage.has(id)) {
            this.storage.delete(id);
        } else {
            throw new Error(`Item with id ${id} does not exist.`);
        }
    }  

}