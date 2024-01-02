export interface EmailService {
    send: () => Promise<void>;
}
