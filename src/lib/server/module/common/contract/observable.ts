export interface Observer {
    updateSubject(publisher: Publisher): void | Promise<void>;
}

export interface Publisher {
    attachObserver(observer: Observer): void;
    detachObserver(observer: Observer): void;
    notifyObserver(): void;
}

export interface HasObserver {
    createObserver(): Observer;
}
