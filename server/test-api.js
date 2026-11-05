// Automated API testing script
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting Backend REST API Tests ---');
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

  // 1. Healthcheck
  await test('GET /api/health returns 200 and healthy status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const json = await res.json();
    if (res.status !== 200 || json.status !== 'healthy') {
      throw new Error(`Expected 200 healthy, got ${res.status}: ${JSON.stringify(json)}`);
    }
  });

  // 2. Products List
  await test('GET /api/products returns product array & pagination', async () => {
    const res = await fetch(`${BASE_URL}/products?limit=5`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      throw new Error(`Invalid products response`);
    }
    if (!json.pagination || json.pagination.limit !== 5) {
      throw new Error(`Invalid pagination`);
    }
  });

  // 3. Search & Filter
  await test('GET /api/products?search=Keyboard returns filtered matches', async () => {
    const res = await fetch(`${BASE_URL}/products?search=Keyboard`);
    const json = await res.json();
    if (!json.success || json.data.length === 0) {
      throw new Error(`Expected matches for search=Keyboard`);
    }
    const hasKeyboard = json.data.some(p => p.title.toLowerCase().includes('keyboard'));
    if (!hasKeyboard) throw new Error('Search result does not contain keyboard');
  });

  // 4. Categories
  await test('GET /api/products/categories returns categories with counts', async () => {
    const res = await fetch(`${BASE_URL}/products/categories`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      throw new Error(`Expected category list`);
    }
    if (!json.data[0].name || typeof json.data[0].count !== 'number') {
      throw new Error(`Category format invalid`);
    }
  });

  // 5. Create Product (Validation test)
  await test('POST /api/products fails on missing required title', async () => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 99.99, category: 'Electronics' })
    });
    if (res.status !== 400) {
      throw new Error(`Expected 400 validation error, got ${res.status}`);
    }
  });

  // 6. Create Product (Valid)
  let createdId = null;
  await test('POST /api/products creates product successfully', async () => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Quantum Wireless Mechanical Pad',
        tagline: 'Macro keypad with hot-swappable switches',
        category: 'Accessories',
        price: 89.99,
        stock: 20,
        description: 'Ultra-portable programmable mechanical keypad'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.data?.id) {
      throw new Error(`Failed to create product: ${JSON.stringify(json)}`);
    }
    createdId = json.data.id;
  });

  // 7. Update Product
  await test('PUT /api/products/:id updates price and stock', async () => {
    const res = await fetch(`${BASE_URL}/products/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Quantum Wireless Mechanical Pad V2',
        price: 94.99,
        stock: 25,
        category: 'Accessories'
      })
    });
    const json = await res.json();
    if (!json.success || json.data.price !== 94.99 || json.data.stock !== 25) {
      throw new Error(`Update verification failed: ${JSON.stringify(json)}`);
    }
  });

  // 8. Add Review
  await test('POST /api/products/:id/reviews adds customer review', async () => {
    const res = await fetch(`${BASE_URL}/products/${createdId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: 'Jane Doe',
        rating: 5,
        comment: 'Great build quality and very responsive keys!'
      })
    });
    const json = await res.json();
    if (!json.success || json.data.review.user !== 'Jane Doe') {
      throw new Error(`Review addition failed: ${JSON.stringify(json)}`);
    }
  });

  // 9. Order & Checkout
  await test('POST /api/orders places order and reduces inventory', async () => {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          address: '123 Tech Way',
          city: 'Austin',
          zip: '78701'
        },
        items: [
          { id: createdId, title: 'Quantum Wireless Mechanical Pad V2', price: 94.99, quantity: 2 }
        ],
        subtotal: 189.98,
        tax: 15.20,
        shipping: 0,
        total: 205.18,
        paymentMethod: 'Credit Card'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.data?.id) {
      throw new Error(`Order placement failed: ${JSON.stringify(json)}`);
    }

    // Check stock was deducted from 25 to 23
    const checkRes = await fetch(`${BASE_URL}/products/${createdId}`);
    const checkJson = await checkRes.json();
    if (checkJson.data.stock !== 23) {
      throw new Error(`Expected stock 23 after ordering 2, got ${checkJson.data.stock}`);
    }
  });

  // 10. Delete Product
  await test('DELETE /api/products/:id removes product', async () => {
    const res = await fetch(`${BASE_URL}/products/${createdId}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(`Delete failed: ${JSON.stringify(json)}`);
    }

    const checkRes = await fetch(`${BASE_URL}/products/${createdId}`);
    if (checkRes.status !== 404) {
      throw new Error(`Product still exists after deletion`);
    }
  });

  // 11. Stats
  await test('GET /api/products/stats returns analytics', async () => {
    const res = await fetch(`${BASE_URL}/products/stats`);
    const json = await res.json();
    if (!json.success || typeof json.data.totalProducts !== 'number') {
      throw new Error(`Failed to retrieve stats`);
    }
  });

  console.log(`\n--- Test Results: ${passed} passed, ${failed} failed ---`);
  if (failed > 0) process.exit(1);
}

runTests();
