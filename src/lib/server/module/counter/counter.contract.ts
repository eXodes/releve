export interface HasCounter {
    getCount: () => Promise<number>;
    increaseCounter: () => Promise<void>;
    decreaseCounter: () => Promise<void>;
}
