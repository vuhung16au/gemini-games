import { PRODUCTS, STAFF, UPGRADES } from './config';
import { getDisplayCapacity, getStaffCost, getTotalStock } from './economy';
import type { GameState } from './types';

/** Recommend the highest-value next action for the player's current bakery state. */
export function getNextActionHint(state: GameState): string {
  const stock = getTotalStock(state);
  const cap = getDisplayCapacity(state);

  if (stock === 0) {
    return 'Your counter is empty! Tap the oven to bake fresh pastries for customers.';
  }

  const nextUpgrade = UPGRADES.find((u) => !state.upgrades.includes(u.id));
  if (nextUpgrade && state.coins >= nextUpgrade.cost) {
    return `Buy Upgrade Tier ${nextUpgrade.tier}: ${nextUpgrade.name} (${nextUpgrade.cost} coins)!`;
  }

  const nextProduct = PRODUCTS.find(
    (p) => !state.unlockedProducts.includes(p.id),
  );
  if (nextProduct && state.coins >= nextProduct.unlockCost) {
    return `Unlock ${nextProduct.name} (${nextProduct.unlockCost} coins) for higher-margin sales!`;
  }

  const bakerCost = getStaffCost('baker', state.staff.baker);
  if (state.coins >= bakerCost) {
    return `Hire Apprentice Baker (${bakerCost} coins) to automate baking & unlock offline earnings!`;
  }

  const cashierCost = getStaffCost('cashier', state.staff.cashier);
  if (state.coins >= cashierCost) {
    return `Hire ${STAFF[1].name} (${cashierCost} coins) for +15% sell prices!`;
  }

  if (stock < cap) {
    const goal = nextUpgrade
      ? `${nextUpgrade.cost - state.coins} more coins for ${nextUpgrade.name}`
      : 'more coins';
    return `Keep baking and serving customers — earn ${goal}!`;
  }

  return 'Counter is full! Wait for customers to purchase stocked pastries.';
}
