import { Router } from 'express';

export function salesRoutes(salesRepository, salesService) {
  const router = Router();
  router.get('/', (req, res) => {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    res.json(salesRepository.list(limit));
  });
  router.get('/:id', (req, res) => {
    const sale = salesRepository.getById(Number(req.params.id));
    if (!sale) return res.status(404).json({ error: 'Sale not found.' });
    return res.json(sale);
  });
  router.post('/', (req, res) => res.status(201).json(salesService.createSale(req.body.items)));
  return router;
}
