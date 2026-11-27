export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'StockWise Inventory API',
    version: '1.0.0',
    description: 'API for product, supplier, stock movement, sales, and reporting modules.'
  },
  servers: [{ url: 'http://localhost:5000/api', description: 'Local development server' }],
  tags: [
    { name: 'Health' }, { name: 'Products' }, { name: 'Suppliers' },
    { name: 'Inventory' }, { name: 'Sales' }, { name: 'Analytics' }
  ],
  paths: {
    '/health': { get: { tags: ['Health'], summary: 'Check API availability', responses: { '200': { description: 'API is operational' } } } },
    '/products': {
      get: { tags: ['Products'], summary: 'List and filter products', parameters: [
        { in: 'query', name: 'search', schema: { type: 'string' } },
        { in: 'query', name: 'category', schema: { type: 'string' } },
        { in: 'query', name: 'lowStock', schema: { type: 'boolean' } }
      ], responses: { '200': { description: 'Product list' } } },
      post: { tags: ['Products'], summary: 'Create a product', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } }, responses: { '201': { description: 'Product created' }, '409': { description: 'SKU already exists' } } }
    },
    '/products/{id}': {
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      get: { tags: ['Products'], summary: 'Get one product', responses: { '200': { description: 'Product found' }, '404': { description: 'Product not found' } } },
      put: { tags: ['Products'], summary: 'Update product details', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } }, responses: { '200': { description: 'Product updated' } } },
      delete: { tags: ['Products'], summary: 'Delete a product', responses: { '204': { description: 'Product deleted' } } }
    },
    '/suppliers': {
      get: { tags: ['Suppliers'], summary: 'List suppliers', responses: { '200': { description: 'Supplier list' } } },
      post: { tags: ['Suppliers'], summary: 'Create a supplier', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SupplierInput' } } } }, responses: { '201': { description: 'Supplier created' } } }
    },
    '/suppliers/{id}': {
      parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }],
      put: { tags: ['Suppliers'], summary: 'Update a supplier', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SupplierInput' } } } }, responses: { '200': { description: 'Supplier updated' } } },
      delete: { tags: ['Suppliers'], summary: 'Delete a supplier', responses: { '204': { description: 'Supplier deleted' } } }
    },
    '/inventory/movements': {
      get: { tags: ['Inventory'], summary: 'List stock movement history', responses: { '200': { description: 'Movement list' } } },
      post: { tags: ['Inventory'], summary: 'Record stock in, stock out, or an adjustment', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['productId', 'type', 'quantity'], properties: { productId: { type: 'integer' }, type: { type: 'string', enum: ['IN', 'OUT', 'ADJUSTMENT'] }, quantity: { type: 'integer', minimum: 0 }, note: { type: 'string' } } } } } }, responses: { '201': { description: 'Movement recorded' }, '400': { description: 'Invalid movement or insufficient stock' } } }
    },
    '/sales': {
      get: { tags: ['Sales'], summary: 'List recent sales', responses: { '200': { description: 'Sales list' } } },
      post: { tags: ['Sales'], summary: 'Create a sale and deduct inventory', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['items'], properties: { items: { type: 'array', items: { type: 'object', required: ['productId', 'quantity'], properties: { productId: { type: 'integer' }, quantity: { type: 'integer', minimum: 1 } } } } } } } } }, responses: { '201': { description: 'Sale created' }, '400': { description: 'Insufficient stock or invalid sale' } } }
    },
    '/sales/{id}': { parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'integer' } }], get: { tags: ['Sales'], summary: 'Get a sale and its line items', responses: { '200': { description: 'Sale details' }, '404': { description: 'Sale not found' } } } },
    '/analytics/dashboard': { get: { tags: ['Analytics'], summary: 'Get dashboard metrics and alerts', responses: { '200': { description: 'Dashboard summary' } } } },
    '/analytics/reports': { get: { tags: ['Analytics'], summary: 'Get sales and inventory reports', responses: { '200': { description: 'Report data' } } } }
  },
  components: {
    schemas: {
      ProductInput: {
        type: 'object', required: ['sku', 'name'], properties: {
          sku: { type: 'string', example: 'ST-1007' }, name: { type: 'string', example: 'USB Flash Drive' },
          category: { type: 'string', example: 'Electronics' }, description: { type: 'string' },
          cost_price: { type: 'number', minimum: 0 }, selling_price: { type: 'number', minimum: 0 },
          quantity: { type: 'integer', minimum: 0 }, reorder_level: { type: 'integer', minimum: 0 },
          supplier_id: { type: 'integer', nullable: true }
        }
      },
      SupplierInput: {
        type: 'object', required: ['name'], properties: {
          name: { type: 'string' }, contact_person: { type: 'string' }, email: { type: 'string' },
          phone: { type: 'string' }, address: { type: 'string' }
        }
      }
    }
  }
};
