export interface Observer {
    update: (subject: Subject) => void | Promise<void>;
}

export interface Subject {
    attach: (observer: Observer) => void;
    detach: (observer: Observer) => void;
    notify: () => void;
}
