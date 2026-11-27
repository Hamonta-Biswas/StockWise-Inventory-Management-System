import { Router } from 'express';

function supplierInput(body) {
  const input = {
    name: String(body.name ?? '').trim(),
    contact_person: String(body.contact_person ?? '').trim(),
    email: String(body.email ?? '').trim(),
    phone: String(body.phone ?? '').trim(),
    address: String(body.address ?? '').trim()
  };

  if (!input.name) {
    throw new Error('Supplier name is required.');
  }

  if (
    input.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
  ) {
    throw new Error('Supplier email must be valid.');
  }

  return input;
}

export function supplierRoutes(repository) {
  const router = Router();
  router.get('/', (_req, res) => res.json(repository.list()));
  router.post('/', (req, res) => res.status(201).json(repository.create(supplierInput(req.body))));
  router.put('/:id', (req, res) => {
    const supplier = repository.update(Number(req.params.id), supplierInput(req.body));
    if (!supplier) return res.status(404).json({ error: 'Supplier not found.' });
    return res.json(supplier);
  });
  router.delete('/:id', (req, res) => {
    if (!repository.delete(Number(req.params.id))) return res.status(404).json({ error: 'Supplier not found.' });
    return res.status(204).end();
  });
  return router;
}
