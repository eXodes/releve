export interface EmailData {
    name: string;
    action_url: string;
}

export interface EmailService {
    send: () => Promise<void>;
}
