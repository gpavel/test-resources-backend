import { Observable, of } from 'rxjs';

import { AuthorizationManager } from "./TokenManager";

export class StubAuthManager implements AuthorizationManager {
  authHeader(): Observable<string> {
    return of('Bearer token');
  }
}
