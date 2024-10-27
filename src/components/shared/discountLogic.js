import seedrandom from "seedrandom";

const DISCOUNT_PERCENTAGES = [10, 15, 25];

export function calculateWeeklyDiscounts(products, subscriptionActive = false) {
  if (
    !products ||
    !Array.isArray(products) ||
    products.length === 0 ||
    !subscriptionActive
  ) {
    return {};
  }

  const currentWeek = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const rng = seedrandom(currentWeek.toString());

  const discounts = {};
  products.forEach((product) => {
    const productRng = seedrandom(currentWeek.toString() + product.id);
    const randomIndex = Math.floor(productRng() * DISCOUNT_PERCENTAGES.length);
    discounts[product.id] = DISCOUNT_PERCENTAGES[randomIndex];
  });

  return discounts;
}

export function getDiscountForProduct(productId, discounts) {
  return discounts[productId] || 0;
}

export function calculateDiscountedPrice(price, discountPercentage) {
  return Number((price * (1 - discountPercentage / 100)).toFixed(2));
}
