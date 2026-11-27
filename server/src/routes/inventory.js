import { Router } from 'express';

export function inventoryRoutes({ inventoryRepository, inventoryService }) {
  const router = Router();
  router.get('/movements', (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    res.json(inventoryRepository.listMovements(limit));
  });
  router.post('/movements', (req, res) => {
    const productId = Number(req.body.productId);
    if (!Number.isInteger(productId) || productId <= 0) throw new Error('Select a valid product.');
    const result = inventoryService.recordMovement({
      productId, type: req.body.type, quantity: req.body.quantity, note: req.body.note
    });
    res.status(201).json(result);
  });
  return router;
}
