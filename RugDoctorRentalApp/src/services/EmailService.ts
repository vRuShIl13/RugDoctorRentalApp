export interface EmailMessage {
    to: string;
    subject: string;
    body: string;
}

// Lightweight abstraction so we can swap in a real provider later.
export interface EmailService {
    sendEmail(message: EmailMessage): Promise<void>;
}

// Default implementation for local development and demos.
export class ConsoleEmailService implements EmailService {
    async sendEmail(message: EmailMessage): Promise<void> {
        console.log(`[Email] To: ${message.to} | Subject: ${message.subject}`);
        console.log(message.body);
    }
}

export interface SendGridEmailConfig {
    apiKey: string;
    fromEmail: string;
    fromName?: string;
    sandboxMode?: boolean;
}

// Production-ready SendGrid implementation using the Web API.
// Requires Node.js v18+ (global fetch) or a fetch polyfill.
export class SendGridEmailService implements EmailService {
    private apiKey: string;
    private fromEmail: string;
    private fromName?: string;
    private sandboxMode: boolean;

    constructor(config: SendGridEmailConfig) {
        if (!config.apiKey) {
            throw new Error("SendGrid apiKey is required.");
        }
        if (!config.fromEmail) {
            throw new Error("SendGrid fromEmail is required.");
        }

        this.apiKey = config.apiKey;
        this.fromEmail = config.fromEmail;
        this.fromName = config.fromName;
        this.sandboxMode = config.sandboxMode ?? false;
    }

    async sendEmail(message: EmailMessage): Promise<void> {
        if (!message.to) {
            throw new Error("EmailMessage.to is required.");
        }
        if (!message.subject) {
            throw new Error("EmailMessage.subject is required.");
        }

        const payload: Record<string, unknown> = {
            personalizations: [
                {
                    to: [{ email: message.to }],
                    subject: message.subject
                }
            ],
            from: this.fromName
                ? { email: this.fromEmail, name: this.fromName }
                : { email: this.fromEmail },
            content: [{ type: "text/plain", value: message.body }]
        };

        if (this.sandboxMode) {
            payload["mail_settings"] = { sandbox_mode: { enable: true } };
        }

        const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            const details = errorText ? ` - ${errorText}` : "";
            throw new Error(
                `SendGrid request failed: ${response.status} ${response.statusText}${details}`
            );
        }
    }
}
