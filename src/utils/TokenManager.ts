import { Observable } from "rxjs";

export interface AuthorizationManager {
  authHeader(): Observable<string>;
}
