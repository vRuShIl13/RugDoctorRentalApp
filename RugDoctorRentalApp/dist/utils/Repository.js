// middle man - repository for data access, can be extended to include caching, logging, etc.
export class Repository {
    storage;
    constructor() {
        this.storage = new Map();
    }
    add(id, item) {
        this.storage.set(id, item);
    }
    get(id) {
        return this.storage.get(id);
    }
    getAll() {
        return Array.from(this.storage.values());
    }
    update(id, item) {
        if (this.storage.has(id)) {
            this.storage.set(id, item);
        }
        else {
            throw new Error(`Item with id ${id} does not exist.`);
        }
    }
    delete(id) {
        if (this.storage.has(id)) {
            this.storage.delete(id);
        }
        else {
            throw new Error(`Item with id ${id} does not exist.`);
        }
    }
}
//# sourceMappingURL=Repository.js.map