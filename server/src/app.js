import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './openapi.js';
import { ProductRepository } from './repositories/product-repository.js';
import { SupplierRepository } from './repositories/supplier-repository.js';
import { InventoryRepository } from './repositories/inventory-repository.js';
import { SalesRepository } from './repositories/sales-repository.js';
import { StockEventBus } from './patterns/stock-event-bus.js';
import { NotificationAdapter, ConsoleNotificationProvider } from './patterns/notification-adapter.js';
import { LowStockNotifier } from './patterns/low-stock-notifier.js';
import { InventoryService } from './services/inventory-service.js';
import { SalesService } from './services/sales-service.js';
import { productRoutes } from './routes/products.js';
import { supplierRoutes } from './routes/suppliers.js';
import { inventoryRoutes } from './routes/inventory.js';
import { salesRoutes } from './routes/sales.js';
import { analyticsRoutes } from './routes/analytics.js';
import { notFoundHandler, errorHandler } from './middleware/error-handler.js';

export function createApp({ db, notificationProvider = new ConsoleNotificationProvider() }) {
  if (!db) throw new Error('A database connection is required.');
  const app = express();
  app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') ?? 'http://localhost:5173' }));
  app.use(express.json({ limit: '1mb' }));

  const productRepository = new ProductRepository(db);
  const supplierRepository = new SupplierRepository(db);
  const inventoryRepository = new InventoryRepository(db);
  const salesRepository = new SalesRepository(db);
  const eventBus = new StockEventBus();
  const notificationPort = new NotificationAdapter(notificationProvider);
  const lowStockNotifier = new LowStockNotifier(eventBus, notificationPort);
  const inventoryService = new InventoryService({ db, inventoryRepository, eventBus });
  const salesService = new SalesService({ db, salesRepository, productRepository, inventoryService });

  app.get('/api/openapi.json', (_req, res) => res.json(openApiSpec));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.get('/api/health', (_req, res) => res.json({ status: 'ok', application: 'StockWise API' }));
  app.use('/api/products', productRoutes(productRepository));
  app.use('/api/suppliers', supplierRoutes(supplierRepository));
  app.use('/api/inventory', inventoryRoutes({ inventoryRepository, inventoryService }));
  app.use('/api/sales', salesRoutes(salesRepository, salesService));
  app.use('/api/analytics', analyticsRoutes(db));
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.locals.dispose = () => lowStockNotifier.close();
  return app;
}
