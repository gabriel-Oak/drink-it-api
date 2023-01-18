import { env } from 'process';
import app from './app';

export default async function startServerFastify() {
  const port = env.PORT ?? 8080;
  await app.listen({ port: +port });

  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado na porta ${port}`);
}
