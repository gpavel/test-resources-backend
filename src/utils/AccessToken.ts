function bearerTokenHasExpiredError(): never {
  throw new Error(`The token has already expired and can no longer be used.`);
}

export class BearerAccessToken {
  static readonly expirationDeltaMs = 60 * 1000;

  private readonly expiresAt: number;

  constructor(readonly accessToken: string, expiresInMs: number) {
    this.expiresAt = Date.now() + expiresInMs - BearerAccessToken.expirationDeltaMs;
  }

  public hasExpired(): boolean {
    return Date.now() - this.expiresAt > 0;
  }

  public authorizationHeader(): string {
    if (this.hasExpired()) {
      bearerTokenHasExpiredError();
    }
    return `Bearer ${this.accessToken}`;
  }
}
