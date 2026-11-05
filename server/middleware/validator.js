export function validateProduct(req, res, next) {
  const { title, price, category, stock } = req.body;
  const errors = [];

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    errors.push('Product title is required and must be at least 3 characters long.');
  }

  if (price === undefined || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
    errors.push('Product price is required and must be a positive number.');
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.push('Product category is required.');
  }

  if (stock !== undefined && (isNaN(parseInt(stock, 10)) || parseInt(stock, 10) < 0)) {
    errors.push('Product stock must be a non-negative integer.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validateReview(req, res, next) {
  const { user, rating, comment } = req.body;
  const errors = [];

  if (!user || user.trim().length === 0) {
    errors.push('Reviewer name is required.');
  }

  const numRating = parseInt(rating, 10);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    errors.push('Rating must be an integer between 1 and 5.');
  }

  if (!comment || comment.trim().length < 3) {
    errors.push('Review comment must be at least 3 characters long.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

export function validateOrder(req, res, next) {
  const { customer, items, total } = req.body;
  const errors = [];

  if (!customer || !customer.name || !customer.email) {
    errors.push('Customer name and email are required.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    errors.push('Order must contain at least one item.');
  }

  if (total === undefined || isNaN(parseFloat(total)) || parseFloat(total) <= 0) {
    errors.push('Valid order total is required.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}
