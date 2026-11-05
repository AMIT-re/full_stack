import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'healthy' }));

const server = app.listen(5099, '127.0.0.1', async () => {
  console.log('Test server running on port 5099');
  const BASE_URL = 'http://127.0.0.1:5099/api';
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  try {
    // 1. Health
    await test('GET /api/health returns 200', async () => {
      const res = await fetch(`${BASE_URL}/health`);
      const json = await res.json();
      if (res.status !== 200 || json.status !== 'healthy') throw new Error('Not healthy');
    });

    // 2. Products List
    await test('GET /api/products returns products and pagination', async () => {
      const res = await fetch(`${BASE_URL}/products?limit=4`);
      const json = await res.json();
      if (!json.success || !Array.isArray(json.data) || json.data.length !== 4) {
        throw new Error('Products array length mismatch');
      }
      if (!json.pagination || json.pagination.limit !== 4) {
        throw new Error('Pagination error');
      }
    });

    // 3. Search
    await test('GET /api/products?search=Keyboard matches products', async () => {
      const res = await fetch(`${BASE_URL}/products?search=Keyboard`);
      const json = await res.json();
      if (!json.success || json.data.length === 0) throw new Error('No search match');
    });

    // 4. Categories
    await test('GET /api/products/categories returns categories', async () => {
      const res = await fetch(`${BASE_URL}/products/categories`);
      const json = await res.json();
      if (!json.success || json.data.length === 0) throw new Error('No categories');
    });

    // 5. Validation failure
    await test('POST /api/products fails validation with empty body', async () => {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.status !== 400) throw new Error(`Expected status 400, got ${res.status}`);
    });

    // 6. Create product
    let newId = null;
    await test('POST /api/products creates new product', async () => {
      const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Nova Studio Monitor Stand',
          tagline: 'Heavy-duty acoustic isolation stand',
          category: 'Accessories',
          price: 49.99,
          stock: 15,
          description: 'Acoustically treated studio monitor desktop stands.'
        })
      });
      const json = await res.json();
      if (res.status !== 201 || !json.data?.id) throw new Error('Create product failed');
      newId = json.data.id;
    });

    // 7. Update product
    await test('PUT /api/products/:id updates product', async () => {
      const res = await fetch(`${BASE_URL}/products/${newId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Nova Studio Monitor Stand Pro',
          price: 54.99,
          stock: 20,
          category: 'Accessories'
        })
      });
      const json = await res.json();
      if (!json.success || json.data.price !== 54.99) throw new Error('Update product failed');
    });

    // 8. Add Review
    await test('POST /api/products/:id/reviews adds review', async () => {
      const res = await fetch(`${BASE_URL}/products/${newId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: 'Acoustic Guy',
          rating: 5,
          comment: 'Noticeable reduction in desk resonance!'
        })
      });
      const json = await res.json();
      if (!json.success || json.data.review.rating !== 5) throw new Error('Add review failed');
    });

    // 9. Order Placement
    await test('POST /api/orders successfully places order and reduces inventory', async () => {
      const res = await fetch(`${BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: 'Sarah Connor',
            email: 'sarah@example.com',
            address: '42 Cyber Way',
            city: 'LA',
            zip: '90001'
          },
          items: [{ id: newId, title: 'Nova Studio Monitor Stand Pro', price: 54.99, quantity: 2 }],
          subtotal: 109.98,
          tax: 8.80,
          shipping: 0,
          total: 118.78,
          paymentMethod: 'Credit Card'
        })
      });
      const json = await res.json();
      if (res.status !== 201 || !json.data?.id) throw new Error('Create order failed');

      // Verify stock
      const getRes = await fetch(`${BASE_URL}/products/${newId}`);
      const getJson = await getRes.json();
      if (getJson.data.stock !== 18) throw new Error(`Expected stock 18, got ${getJson.data.stock}`);
    });

    // 10. Delete product
    await test('DELETE /api/products/:id deletes product', async () => {
      const res = await fetch(`${BASE_URL}/products/${newId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (!json.success) throw new Error('Delete failed');
    });

    // 11. Stats
    await test('GET /api/products/stats returns catalog metrics', async () => {
      const res = await fetch(`${BASE_URL}/products/stats`);
      const json = await res.json();
      if (!json.success || typeof json.data.totalProducts !== 'number') throw new Error('Stats failed');
    });

  } finally {
    console.log(`\n========================================`);
    console.log(`Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================`);
    server.close(() => {
      process.exit(failed > 0 ? 1 : 0);
    });
  }
});
