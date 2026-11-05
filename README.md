# NovaStore — Full-Stack E-Commerce Product Catalog Capstone Project

NovaStore is a modern, modular, and responsive full-stack web application designed as an E-Commerce Product Catalog. It features a high-performance React + Vite frontend, a RESTful Express.js backend API, atomic persistent data storage, client-side routing, advanced search and filtering, shopping cart management, user reviews, and an administrative CRUD dashboard.

---

## 1. Project Overview

NovaStore showcases best practices in full-stack web development:
- **Clean Architecture:** Strict separation of components, pages, context providers, API services, and utilities.
- **RESTful Backend:** Express.js API delivering product listing, search, categorization, pagination, order checkout simulation, review submissions, and analytics stats.
- **Responsive UI:** Built with Tailwind CSS, ensuring smooth adaptation across desktop, tablet, and mobile screens.
- **Local-Only Development:** Engineered and tested to run 100% locally with zero external cloud dependencies.

---

## 2. Technologies Used

### Frontend (`/client`)
- **React 18:** Modern functional components with hooks (`useState`, `useEffect`, `useCallback`, `useContext`, `useDebounce`).
- **Vite:** High-speed development server and optimized production bundler.
- **React Router DOM (v6):** Client-side navigation, parameterized product routes, dynamic URL query synchronization.
- **Tailwind CSS (v3):** Utility-first styling framework with custom animations, responsive grid layouts, and color tokens.
- **Lucide React:** Modern icon library for consistent visual language.
- **LocalStorage:** Client-side cart persistence across sessions.

### Backend (`/server`)
- **Node.js & Express.js:** Scalable REST API with router modularity.
- **CORS:** Cross-Origin Resource Sharing middleware for local client-server communication.
- **Custom Input Validation:** Robust request payload verification for product creations, edits, reviews, and orders.
- **Atomic File Storage Engine:** Zero-setup JSON persistence (`server/data/products.json` and `server/data/orders.json`) with sample seed data.

### Tooling & Automation
- **Concurrently:** Root orchestration to launch both frontend and backend concurrently with a single command.

---

## 3. Folder Structure

```text
final project internship/
├── package.json               # Root scripts (dev, build, test, install)
├── README.md                  # Complete documentation
│
├── server/                    # Backend REST API Service
│   ├── package.json           # Server dependencies (Express, CORS, Dotenv)
│   ├── server.js              # Express app entry point & middleware setup
│   ├── test-in-process.js     # Automated API endpoint test suite
│   ├── controllers/
│   │   ├── productController.js # Handles GET, POST, PUT, DELETE, Reviews, Stats
│   │   └── orderController.js   # Handles Order placement & checkout
│   ├── db/
│   │   ├── database.js        # Persistent database service with atomic writes
│   │   └── seedData.js        # Realistic catalog dataset (20+ items, 5 categories)
│   ├── middleware/
│   │   └── validator.js       # Input validation for products, reviews, orders
│   ├── routes/
│   │   ├── productRoutes.js   # Product endpoints (/api/products)
│   │   └── orderRoutes.js     # Order endpoints (/api/orders)
│   └── data/                  # Auto-generated JSON storage files
│       ├── products.json
│       └── orders.json
│
└── client/                    # Frontend React Single Page Application
    ├── package.json           # Client dependencies
    ├── vite.config.js         # Vite configuration with API proxy (/api -> :5000)
    ├── tailwind.config.js     # Tailwind CSS theme configuration
    ├── postcss.config.js      # PostCSS configuration
    ├── index.html             # HTML5 entry with web fonts and favicons
    └── src/
        ├── main.jsx           # React DOM root entry
        ├── App.jsx            # Route definitions, context providers, layout
        ├── index.css          # Tailwind CSS directives & custom styles
        ├── components/
        │   ├── Navbar.jsx           # Responsive header with cart counter & mobile menu
        │   ├── Footer.jsx           # Service guarantees, category links, newsletter
        │   ├── ProductCard.jsx      # Card with hover zoom, discount badges, cart button
        │   ├── ProductGrid.jsx      # Responsive grid with skeletons and empty states
        │   ├── FilterSidebar.jsx    # Category filter, price range bounds, stock toggle
        │   ├── SortDropdown.jsx     # Sorting by Price, Rating, Newest, Name
        │   ├── Pagination.jsx       # Page controls and range indicators
        │   ├── StarRating.jsx       # Interactive and display star ratings
        │   ├── Toast.jsx            # Animated notification alert toasts
        │   ├── ProductFormModal.jsx # Add & Edit product modal with validation
        │   ├── DeleteConfirmModal.jsx # Delete confirmation dialog
        │   └── CheckoutModal.jsx    # Express checkout modal with shipping form
        ├── pages/
        │   ├── Home.jsx             # Hero section, featured categories, trending gear
        │   ├── Products.jsx         # Full catalog with search, filters, pagination
        │   ├── ProductDetails.jsx   # Image switcher, specs table, reviews, related items
        │   ├── Cart.jsx             # Cart items table, promo code engine, order summary
        │   ├── OrderSuccess.jsx     # Receipt confirmation with Order ID & print option
        │   ├── AdminProducts.jsx    # Full CRUD catalog management with analytics
        │   ├── About.jsx            # Architecture breakdown, tech stack, documentation
        │   └── NotFound.jsx         # 404 page
        ├── context/
        │   ├── CartContext.jsx      # Shopping cart state with LocalStorage sync
        │   └── ToastContext.jsx     # Global notification toast provider
        ├── services/
        │   └── api.js               # Centralized fetch wrapper for REST API
        ├── utils/
        │   └── formatters.js        # Currency, date, and discount helper functions
        └── hooks/
            └── useDebounce.js       # Live search debounce hook
```

---

## 4. Features Implemented

### Frontend Features
1. **Responsive Design:** Fluid layout optimized for mobile smartphones, tablets, laptops, and ultra-wide desktops.
2. **Client-Side Routing:** Fast, transition-free navigation using React Router v6 across Home, Products, Product Details, Cart, Admin, About, and Order Confirmation pages.
3. **Live Search with Debounce:** Search catalog items in real-time with automatic URL query string synchronization.
4. **Multi-Faceted Filtering:** Filter by categories (with live product counts), price ranges (min/max), and in-stock only availability.
5. **Dynamic Sorting:** Sort by Newest Arrivals, Price (Low to High), Price (High to Low), Highest Rated, or Alphabetical (A to Z).
6. **Pagination:** Dynamic page calculation with previous/next controls and results count indicators.
7. **Comprehensive Product Details:** Multi-angle image selector, technical specifications table, verified customer reviews, and recommended products in the same category.
8. **Interactive Review Submission:** Add customer reviews with real-time star rating updates.
9. **Persistent Shopping Cart:** Stored in `localStorage`. Includes quantity modifiers, item removal, and auto-calculated tax and shipping rates.
10. **Coupon / Promo Code Engine:** Test with codes like `SAVE10` (10% off) or `SUPER20` (20% off).
11. **Simulated Checkout Flow:** Modal checkout form with shipping address validation, payment method selection, and automatic inventory stock deduction.
12. **Receipt & Order Success Screen:** Printable order summary with unique generated Order ID (e.g., `ORD-849201`).
13. **Catalog Management Dashboard (Admin):** Full CRUD capability—add new products, edit existing listings, toggle stock, delete items, and reset demo data with a single click.
14. **Toast Notifications:** Instant visual feedback on adding to cart, checkout completion, reviews, and admin actions.

### Backend REST API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck and server uptime |
| `GET` | `/api/products` | Query products with `search`, `category`, `minPrice`, `maxPrice`, `inStock`, `sortBy`, `page`, `limit` |
| `GET` | `/api/products/featured` | Fetch featured products for the home page showcase |
| `GET` | `/api/products/categories` | Retrieve unique categories with active product counts |
| `GET` | `/api/products/stats` | Analytics dashboard metrics (total products, inventory valuation, out of stock) |
| `GET` | `/api/products/:id` | Fetch single product details with specifications and reviews |
| `POST` | `/api/products` | Create a new product (validates title, price, category, stock) |
| `PUT` | `/api/products/:id` | Update an existing product by ID |
| `DELETE` | `/api/products/:id` | Delete a product from the catalog |
| `POST` | `/api/products/:id/reviews` | Submit a customer review and recalculate average rating |
| `POST` | `/api/products/reset` | Restore initial default seed products |
| `GET` | `/api/orders` | Retrieve list of placed orders |
| `POST` | `/api/orders` | Place order, validate customer info, and deduct purchased item stock |

---

## 5. Installation Instructions

### Prerequisites
- **Node.js:** v18.0.0 or higher (v22.x recommended)
- **npm:** v9.0.0 or higher

### Step 1: Install Dependencies
Run the command below in the project root to install dependencies across the root, client, and server:
```bash
npm run install:all
```
*(Alternatively, you can run `npm install` inside the `server/` and `client/` directories individually).*

---

## 6. Commands to Run the Application

### Option A: Run Both Frontend and Backend Concurrently (Recommended)
From the root directory, run:
```bash
npm run dev
```
- **Backend API:** Available at `http://localhost:5000`
- **Frontend App:** Available at `http://localhost:5173`
- The frontend dev server proxies `/api` calls directly to the backend on port 5000.

### Option B: Run Services in Separate Terminals

#### Terminal 1 — Backend:
```bash
cd server
npm run dev
```
*(Runs Express with automatic reload on port 5000)*

#### Terminal 2 — Frontend:
```bash
cd client
npm run dev
```
*(Runs Vite React application on port 5173)*

---

## 7. Automated Testing & Quality Checks

Run the automated backend test suite:
```bash
npm test
```
This tests:
- Server healthcheck
- Product pagination & search
- Category aggregation
- Input validation (rejects invalid payloads with HTTP 400)
- Product creation (HTTP 201)
- Product updates (HTTP 200)
- Review submissions and rating recalculation
- Order placement and automatic stock deduction
- Product deletion (HTTP 200)
- Catalog analytics stats

To test client build artifacts:
```bash
npm run build:client
```

---

## 8. Netlify Deployment

The root `netlify.toml` configures Netlify to install dependencies in `client`, run its Vite build, and publish `client/dist`. A fallback rewrite serves `index.html` for client-side routes, so opening or refreshing paths such as `/products` and `/cart` loads the React application.

This configuration deploys the frontend. The Express server and its local JSON storage are not deployed by this configuration; `/api` functionality requires a separately configured backend. The Vite API proxy applies only during local development.
