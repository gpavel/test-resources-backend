import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { Request, Response } from 'express';
import { switchMap } from 'rxjs/operators';

import { HttpStatusCode, ProxyResponse } from '../models';
import { AuthorizationManager } from '../utils/TokenManager';

export class ExpressProxyController {
  constructor(private readonly authManager: AuthorizationManager) {}

  proxy(url: string): (request: Request, response: Response) => void {
    return (request, response) => {
      this.authManager.authHeader()
        .pipe(
          switchMap(authHeader => this.httpRequest(url, {
            params: request.query,
            data: request.body,
            method: request.method as Method,
            headers: { Authorization: authHeader },
          })),
        )
        .subscribe(
          proxyResponse => {
            response.statusCode = HttpStatusCode.OK;
            response.json(proxyResponse);
          },
          error => {
            response.statusCode = 500;
            response.end();
          }
        )
    };
  }

  httpRequest<T>(url: string, config: AxiosRequestConfig): Promise<ProxyResponse<T>> {
    return axios(url, config)
      .catch(error => {
        if (error?.isAxiosError === true && error.response) {
          return error.response as AxiosResponse<T>;
        }

        throw error;
      })
      .then(response => ({
        status: response.status,
        statusText: response.statusText,
        payload: response.data as T,
        headers: response.headers,
      }))
  }
}
