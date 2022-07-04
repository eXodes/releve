import type { Readable } from "svelte/store";

import { derived, writable } from "svelte/store";

import { createUuid } from "$utils/generator";

const TIMEOUT = 5000;

interface Notification {
    id: string;
    type?: "success" | "error";
    title?: string;
    message: string;
    timeout: number;
    clear?: (id: string) => void;
}

interface NotificationProps {
    type?: "success" | "error";
    title?: string;
    message: string;
    timeout?: number;
}

interface NotificationCallbacks {
    clear?: (id: string) => void;
}

const createNotificationStore = (duration: number) => {
    const _notification = writable<Notification[]>([]);

    const send = (
        { type, title, message, timeout = duration }: NotificationProps,
        fn?: NotificationCallbacks
    ) => {
        _notification.update((state) => {
            return [
                ...state,
                {
                    id: createUuid(),
                    type,
                    title,
                    message,
                    timeout,
                    clear: fn?.clear,
                },
            ];
        });
    };

    const remove = (id: string) => {
        _notification.update((state) => {
            return state.filter((item) => {
                if (item.clear && item.id === id) item.clear(item.id);

                return item.id !== id;
            });
        });
    };

    const notification: Readable<Notification[]> = derived(
        _notification,
        ($_notifications, set) => {
            set($_notifications);

            if ($_notifications.length) {
                const timer = setTimeout(() => {
                    _notification.update(([head, ...rest]) => {
                        if (head.clear) head.clear(head.id);

                        return rest;
                    });
                }, $_notifications[0].timeout);

                return () => {
                    clearTimeout(timer);
                };
            }
        }
    );

    const { subscribe } = notification;

    return {
        subscribe,
        send,
        remove,
    };
};

export const notification = createNotificationStore(TIMEOUT);
