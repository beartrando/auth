export class Email {
    private readonly normalized: string;

    constructor(
        value: string,
    ) {
        const normalized = value.trim().toLowerCase();

        if (!Email.isValid(normalized)) {
            throw new Error("Invalid email");
        }

        this.normalized = normalized;
    }

    get value(): string {
        return this.normalized;
    }

    private static isValid(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}

export default Email;
