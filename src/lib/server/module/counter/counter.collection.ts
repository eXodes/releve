import { Collection } from "$module/common/services/collection.service";
import { counterConverter } from "$module/counter/counter.converter";
import type { CounterEntity } from "$module/counter/counter.entity";
import { Counter } from "$module/counter/counter.model";

export const COUNTER_COLLECTION_NAME = "counter";

export class CounterCollection extends Collection<CounterEntity, Counter> {
    constructor(protected uid: string) {
        super(COUNTER_COLLECTION_NAME, counterConverter);
    }

    async getCounter(): Promise<Counter> {
        const snapshot = await this.withConverter.doc(this.uid).get();

        if (!snapshot.exists) return new Counter(this.uid, { count: 0 });

        return snapshot.data() as Counter;
    }

    async updateCounter(counter: CounterEntity) {
        await this.set({ uid: this.uid, ...counter });
    }
}
