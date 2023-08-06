import type { HasData } from "$module/common/contract/data";
import type { CounterEntity } from "$module/counter/counter.entity";

import type { CounterData } from "$client/types/counter";

export class Counter implements HasData<CounterData> {
    protected counterData: CounterData;

    constructor(uid: string, data: CounterEntity) {
        this.counterData = data;
    }

    get data() {
        return this.counterData;
    }
}
