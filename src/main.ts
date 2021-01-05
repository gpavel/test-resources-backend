import express from 'express';
import { config } from 'dotenv';
import { FoleonAuthManager } from './utils/FoleonTokenManager';
import { ExpressProxyController } from './controllers/AuthProxyController';
import { StubAuthManager } from './utils/StubAuthManager';

export function main(): void {
  const { parsed } = config();

  const app = express();
  const port = parsed?.PORT ?? 3000;

  const tokenManager = new FoleonAuthManager(
    parsed?.FOLEON_OAUTH_URL as string,
    parsed?.FOLEON_CLIENT_ID as string,
    parsed?.FOLEON_CLIENT_SECRET as string,
  );
  console.log(`Server has been launched on ${port} port.`);

  const controller = new ExpressProxyController(
    new StubAuthManager(),
  );

  app.use('/resources', controller.proxy('http://localhost:3000/hello-world'));
  app.use('/hello-world', (request, response) => {
    response.statusCode = 401;
    response.json({
      body: request.body,
      query: request.query,
      params: request.params,
      headers: request.headers,
      method: request.method,
    });
  });

  app.listen(port);
}

main();
