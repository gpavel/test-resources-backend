import axios from 'axios';
import { defer, Observable, of } from 'rxjs';
import { finalize, map, share } from 'rxjs/operators';

import { BearerAccessToken } from './AccessToken';
import { FoleonTokenResponse } from './FoleonTokenResponse';
import { AuthorizationManager } from "./TokenManager";

function tokenTypeIsNotSupportedError(tokenType: string): never {
  throw new Error(`The token type ${tokenType} is not supported.`);
}

export class FoleonAuthManager implements AuthorizationManager {
  private activeRequest?: Observable<BearerAccessToken>;

  private activeAccessToken?: BearerAccessToken;

  constructor(
    private readonly oauthUrl: string,
    private readonly clientId: string,
    private readonly clientSecret: string,
  ) {}

  authHeader(): Observable<string> {
    if (this.activeAccessToken?.hasExpired) {
      this.activeAccessToken = undefined;
    }

    const token$ = this.activeAccessToken
      ? of(this.activeAccessToken)
      : this.requestAccessToken();

    return token$.pipe(
      map(token => token.authorizationHeader()),
    );
  }

  private requestAccessToken(): Observable<BearerAccessToken> {
    if (this.activeRequest) {
      return this.activeRequest;
    }

    const tokenRequest = defer(() => axios(this.oauthUrl, this.getRequestConfig()));

    this.activeRequest = tokenRequest.pipe(
      map(response => {
        const tokenResponse = response.data as FoleonTokenResponse;
        if (tokenResponse.token_type !== 'Bearer') {
          tokenTypeIsNotSupportedError(tokenResponse.token_type);
        }

        this.activeAccessToken = new BearerAccessToken(tokenResponse.access_token, tokenResponse.expires_in * 1000);
        return this.activeAccessToken;
      }),
      share(),
      finalize(() => this.activeRequest = undefined),
    );

    return this.activeRequest;
  }

  private getRequestConfig(): object {
    return {
      method: 'post',
      data: {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }
    };
  }
}
