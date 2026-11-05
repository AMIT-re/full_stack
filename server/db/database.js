import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProducts } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data folder and storage files exist
function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(initialProducts, null, 2), 'utf-8');
  }

  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

initStorage();

function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading products file:', err);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing products file:', err);
    return false;
  }
}

function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading orders file:', err);
    return [];
  }
}

function writeOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing orders file:', err);
    return false;
  }
}

export const db = {
  // Query products with search, filter, sort, pagination
  getAllProducts(params = {}) {
    let list = readProducts();

    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'newest',
      page = 1,
      limit = 12
    } = params;

    // Search query
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.tagline && p.tagline.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'All' && category !== '') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Price range filters
    if (minPrice !== undefined && minPrice !== '') {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        list = list.filter(p => p.price >= min);
      }
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        list = list.filter(p => p.price <= max);
      }
    }

    // Stock availability filter
    if (inStock === 'true' || inStock === true) {
      list = list.filter(p => p.stock > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'name_asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    // Pagination
    const total = list.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 12);
    const totalPages = Math.ceil(total / limitNum) || 1;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = list.slice(startIndex, startIndex + limitNum);

    return {
      products: paginatedItems,
      pagination: {
        total,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    };
  },

  getProductById(id) {
    const list = readProducts();
    return list.find(p => p.id === id) || null;
  },

  getFeaturedProducts(limit = 4) {
    const list = readProducts();
    const featured = list.filter(p => p.isFeatured);
    return featured.slice(0, parseInt(limit, 10) || 4);
  },

  getCategories() {
    const list = readProducts();
    const map = {};
    list.forEach(p => {
      const cat = p.category || 'Uncategorized';
      map[cat] = (map[cat] || 0) + 1;
    });

    return Object.entries(map).map(([name, count]) => ({
      name,
      count
    }));
  },

  createProduct(data) {
    const list = readProducts();
    const newId = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct = {
      id: newId,
      title: data.title.trim(),
      tagline: data.tagline ? data.tagline.trim() : '',
      category: data.category.trim(),
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : parseFloat(data.price),
      rating: data.rating ? parseFloat(data.rating) : 5.0,
      reviewsCount: 1,
      stock: parseInt(data.stock, 10) || 0,
      isFeatured: !!data.isFeatured,
      thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : [
        data.thumbnail || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80'
      ],
      description: data.description ? data.description.trim() : '',
      specs: data.specs || {},
      reviews: [
        {
          id: `rev-${Date.now()}`,
          user: 'Verified Buyer',
          rating: 5,
          date: new Date().toISOString().split('T')[0],
          comment: 'New release product in excellent condition.'
        }
      ],
      createdAt: new Date().toISOString()
    };

    list.unshift(newProduct);
    writeProducts(list);
    return newProduct;
  },

  updateProduct(id, updates) {
    const list = readProducts();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = list[index];
    const updated = {
      ...current,
      ...updates,
      id: current.id, // prevent overwriting ID
      price: updates.price !== undefined ? parseFloat(updates.price) : current.price,
      originalPrice: updates.originalPrice !== undefined ? parseFloat(updates.originalPrice) : current.originalPrice,
      stock: updates.stock !== undefined ? parseInt(updates.stock, 10) : current.stock,
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    writeProducts(list);
    return updated;
  },

  deleteProduct(id) {
    const list = readProducts();
    const index = list.findIndex(p => p.id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    writeProducts(list);
    return true;
  },

  addReview(productId, reviewData) {
    const list = readProducts();
    const product = list.find(p => p.id === productId);
    if (!product) return null;

    if (!Array.isArray(product.reviews)) {
      product.reviews = [];
    }

    const newRev = {
      id: `rev-${Date.now().toString().slice(-5)}`,
      user: reviewData.user ? reviewData.user.trim() : 'Anonymous',
      rating: Math.min(5, Math.max(1, parseInt(reviewData.rating, 10) || 5)),
      date: new Date().toISOString().split('T')[0],
      comment: reviewData.comment ? reviewData.comment.trim() : ''
    };

    product.reviews.unshift(newRev);
    product.reviewsCount = product.reviews.length;
    // Calculate new average rating
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = parseFloat((sum / product.reviews.length).toFixed(1));

    writeProducts(list);
    return { product, review: newRev };
  },

  createOrder(orderData) {
    const orders = readOrders();
    const products = readProducts();

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = {
      id: orderId,
      customer: {
        name: orderData.customer?.name || 'Valued Customer',
        email: orderData.customer?.email || 'customer@example.com',
        phone: orderData.customer?.phone || '',
        address: orderData.customer?.address || '123 Market St',
        city: orderData.customer?.city || 'City',
        zip: orderData.customer?.zip || '10001'
      },
      items: orderData.items || [],
      subtotal: parseFloat(orderData.subtotal || 0),
      tax: parseFloat(orderData.tax || 0),
      shipping: parseFloat(orderData.shipping || 0),
      total: parseFloat(orderData.total || 0),
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    // Deduct stock for ordered items
    if (Array.isArray(orderData.items)) {
      orderData.items.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
        }
      });
      writeProducts(products);
    }

    orders.unshift(newOrder);
    writeOrders(orders);
    return newOrder;
  },

  getOrders() {
    return readOrders();
  },

  getStats() {
    const list = readProducts();
    const orders = readOrders();

    const totalProducts = list.length;
    const categoriesCount = new Set(list.map(p => p.category)).size;
    const outOfStockCount = list.filter(p => p.stock <= 0).length;
    const totalInventoryValue = list.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

    return {
      totalProducts,
      categoriesCount,
      outOfStockCount,
      totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
      totalOrders: orders.length,
      totalRevenue: parseFloat(totalRevenue.toFixed(2))
    };
  },

  resetDatabase() {
    writeProducts(initialProducts);
    writeOrders([]);
    return true;
  }
};
