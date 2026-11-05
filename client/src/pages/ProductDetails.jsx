import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
  Share2,
  Heart,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, calculateDiscount, formatDate } from '../utils/formatters';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery
  const [activeImage, setActiveImage] = useState('');

  // Quantity selection
  const [quantity, setQuantity] = useState(1);

  // Tabs
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'specs' | 'reviews'

  // Review Form
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Fetch product details
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getProductById(id);
        if (res.success && res.data) {
          setProduct(res.data);
          setActiveImage(res.data.thumbnail || res.data.images?.[0] || '');
          setQuantity(1);

          // Fetch related products in category
          if (res.data.category) {
            const relRes = await api.getProducts({
              category: res.data.category,
              limit: 4,
            });
            if (relRes.success) {
              setRelatedProducts(relRes.data.filter((p) => p.id !== res.data.id));
            }
          }
        }
      } catch (err) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded w-full" />
            <div className="h-12 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'The requested product could not be located.'}</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Catalog
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.originalPrice, product.price);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const added = addToCart(product, quantity);
    if (added) {
      addToast(`Added ${quantity} × "${product.title}" to cart!`, 'success');
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    navigate('/cart');
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      setReviewError('Please provide both your name and review comments.');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      const res = await api.addReview(product.id, {
        user: reviewAuthor,
        rating: reviewRating,
        comment: reviewComment,
      });

      if (res.success && res.data) {
        setProduct(res.data.product);
        setReviewAuthor('');
        setReviewComment('');
        setReviewRating(5);
        addToast('Review posted successfully! Thank you.', 'success');
      }
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-900 transition-colors">Catalog</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-gray-900 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full bg-gray-100 rounded-3xl overflow-hidden border border-gray-200/80 shadow-sm">
            <img
              src={activeImage || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Save {discount}%
              </span>
            )}
          </div>

          {/* Alternate Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    activeImage === img
                      ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Category & Stock */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            {isOutOfStock ? (
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">
                Currently Out of Stock
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                In Stock ({product.stock} units available)
              </span>
            )}
          </div>

          {/* Title & Tagline */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {product.title}
            </h1>
            {product.tagline && (
              <p className="text-sm sm:text-base text-gray-500 mt-2 font-medium">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Ratings & SKU */}
          <div className="flex items-center gap-4 py-2 border-y border-gray-100">
            <StarRating rating={product.rating || 5} totalReviews={product.reviewsCount} size="w-4 h-4" />
            <span className="text-gray-300">|</span>
            <span className="text-xs text-gray-500 font-mono">
              SKU: {product.id.toUpperCase()}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Description Excerpt */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-1.5 rounded-lg hover:bg-white text-gray-600 disabled:opacity-30 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-1.5 rounded-lg hover:bg-white text-gray-600 disabled:opacity-30 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Buy Now with 1-Click</span>
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-200/80">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-[11px] text-gray-600">Free shipping &gt;$100</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-[11px] text-gray-600">2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-[11px] text-gray-600">30-Day Returns</span>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Section: Overview, Specs, Customer Reviews */}
      <div className="pt-8 border-t border-gray-200">
        
        {/* Tab Headers */}
        <div className="flex items-center gap-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'overview'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'specs'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Technical Specs
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-bold transition-all relative ${
              activeTab === 'reviews'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 0})
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-8">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="prose max-w-none text-gray-700 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Engineered for Precision & Longevity</h3>
              <p className="leading-relaxed text-sm">
                {product.description}
              </p>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 max-w-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  What's Included in the Box
                </h4>
                <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                  <li>1x {product.title}</li>
                  <li>Braided USB-C Fast-Charging Cable</li>
                  <li>Quick Start Manual & Warranty Certificate</li>
                </ul>
              </div>
            </div>
          )}

          {/* Technical Specs Tab */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              {product.specs && Object.keys(product.specs).length > 0 ? (
                <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-2 p-4 text-xs ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold text-gray-700">{key}</span>
                      <span className="text-gray-600">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Standard manufacturer specifications apply.</p>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* Existing Reviews List */}
              <div className="lg:col-span-7 space-y-6">
                <h3 className="text-base font-bold text-gray-900">
                  Customer Ratings ({product.reviews?.length || 0})
                </h3>

                {(!product.reviews || product.reviews.length === 0) ? (
                  <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to share your experience!</p>
                ) : (
                  <div className="space-y-4">
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">{rev.user}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                              Verified
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400">{formatDate(rev.date)}</span>
                        </div>
                        <StarRating rating={rev.rating} size="w-3.5 h-3.5" showScore={false} />
                        <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-fit">
                <h4 className="text-sm font-bold text-gray-900 mb-1">Write a Customer Review</h4>
                <p className="text-xs text-gray-500 mb-4">Share feedback on ergonomics, sound quality, or performance.</p>

                {reviewError && (
                  <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                    {reviewError}
                  </div>
                )}

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Rating</label>
                    <StarRating
                      rating={reviewRating}
                      interactive={true}
                      onChange={setReviewRating}
                      size="w-5 h-5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="e.g. Jordan Miller"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Review Details *</label>
                    <textarea
                      rows="3"
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="What did you like most about this product?"
                      className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                  </button>
                </form>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Related Products Recommendation Carousel/Grid */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-gray-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Similar Products in {product.category}</h3>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-xs font-bold text-emerald-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(0, 4).map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
