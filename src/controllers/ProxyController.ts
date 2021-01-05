export interface ProxyController {
  proxy(proxyUrl: string): (request: Express.Request, response: Express.Response) => void;
}
