import 'dotenv/config';
import { createDatabase } from './db/database.js';
import { createApp } from './app.js';

const db = createDatabase({ filename: process.env.DATABASE_FILE });
const app = createApp({ db });
const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log(`StockWise API is running at http://localhost:${port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Closing StockWise API...`);
  server.close(() => {
    app.locals.dispose();
    db.close();
    process.exit(0);
  });
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
