import { Observable, of } from 'rxjs';

import { AuthorizationManager } from "./TokenManager";

export class StubAuthManager implements AuthorizationManager {
  authHeader(): Observable<string> {
    return of('Bearer NOT_AN_OAUTH_TOKEN');
  }
}
