import axios, { Method } from 'axios';
import { Request, Response } from 'express';
import { switchMap } from 'rxjs/operators';

import { AuthorizationManager } from '../utils/TokenManager';

export class ExpressProxyController {
  constructor(private readonly authManager: AuthorizationManager) {}

  proxy(url: string): (request: Request, response: Response) => void {
    return (request, response) => {
      this.authManager.authHeader()
        .pipe(
          switchMap(authHeader => axios(url, {
            params: request.query,
            data: request.body,
            method: request.method as Method,
            headers: { authorization: authHeader },
          })),
        )
        .subscribe(
          proxyResponse => {
            response.statusCode = proxyResponse.status;
            response.send(proxyResponse.data);
          },
          error => {
            response.statusCode = 500;
            response.json({
              message: error?.message ?? 'Something went wrong',
            });
          }
        )
    };
  }
}
