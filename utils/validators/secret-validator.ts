class SecretValidator {
  private static secretRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{50,}$/;

  static validate(secret: string): boolean {
    if (!secret) {
      throw new Error("The secret cannot be empty.");
    }

    if (!this.secretRegex.test(secret)) {
      throw new Error(
        "Secret must be at least 50 characters long, containing at least one lowercase letter, one uppercase letter, and one number."
      );
    }

    return true;
  }
}
