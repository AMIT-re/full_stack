import { db } from '../db/database.js';

export const getProducts = (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, inStock, sortBy, page, limit } = req.query;
    const result = db.getAllProducts({
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      page,
      limit
    });
    res.json({
      success: true,
      data: result.products,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = (req, res, next) => {
  try {
    const limit = req.query.limit || 4;
    const products = db.getFeaturedProducts(limit);
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = (req, res, next) => {
  try {
    const categories = db.getCategories();
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = (req, res, next) => {
  try {
    const { id } = req.params;
    const product = db.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

export const createProduct = (req, res, next) => {
  try {
    const newProduct = db.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = db.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully',
      id
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = (req, res, next) => {
  try {
    const { id } = req.params;
    const result = db.addReview(id, req.body);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getStats = (req, res, next) => {
  try {
    const stats = db.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const resetProducts = (req, res, next) => {
  try {
    db.resetDatabase();
    res.json({
      success: true,
      message: 'Database reset to default seed products.'
    });
  } catch (error) {
    next(error);
  }
};
