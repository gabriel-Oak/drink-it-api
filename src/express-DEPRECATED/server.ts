import { env } from 'process';
import app from './app';

export default function startServer() {
  const port = env.PORT ?? 3333;
  app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado na porta ${port}`);
}
