export interface EmailMessage {
    to: string;
    subject: string;
    body: string;
}

// Lightweight abstraction so we can swap in a real provider later.
export interface EmailService {
    sendEmail(message: EmailMessage): void;
}

// Default implementation for local development and demos.
export class ConsoleEmailService implements EmailService {
    sendEmail(message: EmailMessage): void {
        console.log(`[Email] To: ${message.to} | Subject: ${message.subject}`);
        console.log(message.body);
    }
}
