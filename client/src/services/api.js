const API_BASE = '/api';

async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMsg = data?.message || (data?.errors && data.errors.join(', ')) || response.statusText || 'An API error occurred';
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Products
  async getProducts(params = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val);
      }
    });
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await fetch(`${API_BASE}/products${queryString}`);
    return handleResponse(res);
  },

  async getFeaturedProducts(limit = 4) {
    const res = await fetch(`${API_BASE}/products/featured?limit=${limit}`);
    return handleResponse(res);
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/products/categories`);
    return handleResponse(res);
  },

  async getProductById(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  async addReview(productId, reviewData) {
    const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    return handleResponse(res);
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/products/stats`);
    return handleResponse(res);
  },

  async resetDatabase() {
    const res = await fetch(`${API_BASE}/products/reset`, {
      method: 'POST',
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    return handleResponse(res);
  },

  // Health
  async checkHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse(res);
  }
};
