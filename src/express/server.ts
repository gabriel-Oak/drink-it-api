import { env } from 'process';
import app from './app';

export default function startServer() {
  app.use('/api-docs');
  const port = env.PORT ?? 3333;
  app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Servidor iniciado na porta ${port}`);
}
