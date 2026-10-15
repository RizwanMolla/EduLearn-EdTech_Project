import { coupons } from '../data/site';

const round = (n) => Math.round(n * 100) / 100;

export const findCoupon = (code) => {
  const key = String(code || '').trim().toUpperCase();
  return coupons[key] ? { code: key, ...coupons[key] } : null;
};

export const computeTotals = (items, couponCode) => {
  const subtotal = round(items.reduce((sum, c) => sum + c.price, 0));
  const coupon = findCoupon(couponCode);
  let discount = 0;
  if (coupon && subtotal > 0) {
    discount = coupon.type === 'percent' ? subtotal * (coupon.value / 100) : Math.min(coupon.value, subtotal);
  }
  discount = round(discount);
  const savings = round(items.reduce((sum, c) => sum + Math.max(0, (c.originalPrice || c.price) - c.price), 0));
  return { subtotal, discount, total: round(subtotal - discount), coupon, savings };
};

// Luhn checksum for card numbers
export const luhn = (number) => {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
};

export const cardBrand = (number) => {
  const n = number.replace(/\D/g, '');
  if (/^4/.test(n)) return 'Visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  if (/^(60|65|81|82)/.test(n)) return 'RuPay';
  return 'Card';
};

export const formatCardNumber = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

export const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export const expiryValid = (value) => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
};
