export function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function calculateDiscount(original, current) {
  const orig = parseFloat(original);
  const curr = parseFloat(current);
  if (!orig || !curr || orig <= curr) return 0;
  return Math.round(((orig - curr) / orig) * 100);
}
