export declare class Repository<T> {
    private storage;
    constructor();
    add(id: string, item: T): void;
    get(id: string): T | undefined;
    getAll(): T[];
    update(id: string, item: T): void;
    delete(id: string): void;
}
//# sourceMappingURL=Repository.d.ts.map