import express from 'express';
import { config } from 'dotenv';
import { FoleonAuthManager } from './utils/FoleonTokenManager';

export function main(): void {
  const { parsed } = config();

  const app = express();
  const port = parsed?.PORT ?? 3000;
  app.listen(port);

  const tokenManager = new FoleonAuthManager(
    parsed?.FOLEON_OAUTH_URL as string,
    parsed?.FOLEON_CLIENT_ID as string,
    parsed?.FOLEON_CLIENT_SECRET as string,
  );
  console.log(`Server has been launched on ${port} port.`);

  tokenManager.authHeader().subscribe(console.log);
}

main();
