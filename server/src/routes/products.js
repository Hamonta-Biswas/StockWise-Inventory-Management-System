import { Router } from 'express';

function productInput(body) {
  const input = {
    sku: String(body.sku ?? '').trim().toUpperCase(),
    name: String(body.name ?? '').trim(),
    category: String(body.category ?? 'General').trim() || 'General',
    description: String(body.description ?? '').trim(),
    cost_price: Number(body.cost_price ?? 0),
    selling_price: Number(body.selling_price ?? 0),
    quantity: Number(body.quantity ?? 0),
    reorder_level: Number(body.reorder_level ?? 5),
    supplier_id: body.supplier_id === '' || body.supplier_id == null ? null : Number(body.supplier_id)
  };
  if (!input.sku || !input.name) throw new Error('SKU and product name are required.');
  if (![input.cost_price, input.selling_price].every((n) => Number.isFinite(n) && n >= 0)) throw new Error('Prices must be valid non-negative numbers.');
  if (![input.quantity, input.reorder_level].every((n) => Number.isInteger(n) && n >= 0)) throw new Error('Quantity and reorder level must be non-negative whole numbers.');
  if (input.supplier_id !== null && (!Number.isInteger(input.supplier_id) || input.supplier_id <= 0)) throw new Error('Select a valid supplier.');
  return input;
}

export function productRoutes(repository) {
  const router = Router();
  router.get('/', (req, res) => res.json(repository.list({
    search: String(req.query.search ?? '').trim(),
    category: String(req.query.category ?? '').trim(),
    lowStock: req.query.lowStock === 'true'
  })));
  router.get('/:id', (req, res) => {
    const product = repository.getById(Number(req.params.id));
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    return res.json(product);
  });
  router.post('/', (req, res) => res.status(201).json(repository.create(productInput(req.body))));
  router.put('/:id', (req, res) => {
    const product = repository.update(Number(req.params.id), productInput(req.body));
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    return res.json(product);
  });
  router.delete('/:id', (req, res) => {
    if (!repository.delete(Number(req.params.id))) return res.status(404).json({ error: 'Product not found.' });
    return res.status(204).end();
  });
  return router;
}
