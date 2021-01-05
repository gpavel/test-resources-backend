import express from 'express';
import { config } from 'dotenv';
import { FoleonAuthManager } from './utils/FoleonTokenManager';
import { ExpressProxyController } from './controllers/AuthProxyController';
// import { StubAuthManager } from './utils/StubAuthManager';

const DEFAULT_PORT = 3000;

export function main(): void {
  const { parsed } = config();

  const app = express();
  const port = parsed?.PORT ?? DEFAULT_PORT;

  const tokenManager = new FoleonAuthManager(
    parsed?.FOLEON_OAUTH_URL as string,
    parsed?.FOLEON_CLIENT_ID as string,
    parsed?.FOLEON_CLIENT_SECRET as string,
  );

  const controller = new ExpressProxyController(
    // new StubAuthManager(),
    tokenManager,
  );

  app.use('/publications', controller.proxy('https://api.foleon.com/v2/magazine/edition'));
  app.use('/projects', controller.proxy('https://api.foleon.com/v2/magazine/title'));

  app.listen(port);
  console.log(`Server has been launched on ${port} port.`);
}

main();
