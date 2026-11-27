import React, { useState } from 'react';
import { PRODUCTS, STAFF, TOWN_TEASERS, UPGRADES } from '../game/config';
import {
  canBuyUpgrade,
  canHireStaff,
  canUnlockProduct,
  formatCoins,
  getProductSellPrice,
  getStaffCost,
  hasUpgrade,
} from '../game/economy';
import { GameState, ProductId, StaffId, UpgradeId } from '../game/types';

type TabId = 'products' | 'upgrades' | 'staff' | 'town';

interface ManagementPanelProps {
  state: GameState;
  onSelectProduct: (id: ProductId) => void;
  onUnlockProduct: (id: ProductId) => void;
  onBuyUpgrade: (id: UpgradeId) => void;
  onHireStaff: (id: StaffId) => void;
}

export const ManagementPanel: React.FC<ManagementPanelProps> = ({
  state,
  onSelectProduct,
  onUnlockProduct,
  onBuyUpgrade,
  onHireStaff,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('products');

  const affordableUpgrades = UPGRADES.filter((u) => canBuyUpgrade(state, u.id)).length;
  const affordableStaff = STAFF.filter((s) => canHireStaff(state, s.id)).length;
  const affordableProducts = PRODUCTS.filter((p) => canUnlockProduct(state, p.id)).length;

  return (
    <aside className="management-panel pixel-box">
      <nav className="tab-bar" aria-label="Shop management tabs">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Menu {affordableProducts > 0 && <span className="dot" />}
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'upgrades' ? 'active' : ''}`}
          onClick={() => setActiveTab('upgrades')}
        >
          Upgrades ({state.upgrades.length}/5) {affordableUpgrades > 0 && <span className="dot" />}
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff {affordableStaff > 0 && <span className="dot" />}
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'town' ? 'active' : ''}`}
          onClick={() => setActiveTab('town')}
        >
          Town 🔒
        </button>
      </nav>

      <div className="panel-body">
        {activeTab === 'products' && (
          <div className="card-list">
            {PRODUCTS.map((prod) => {
              const unlocked = state.unlockedProducts.includes(prod.id);
              const isSelected = state.activeProduct === prod.id;
              const sellPrice = getProductSellPrice(state, prod.id);
              const canUnlock = canUnlockProduct(state, prod.id);

              return (
                <div
                  key={prod.id}
                  className={`item-card ${isSelected ? 'card-selected' : ''}`}
                >
                  <div className="item-info">
                    <div className="item-header">
                      <span
                        className="product-swatch"
                        style={{ backgroundColor: prod.accentColor }}
                      />
                      <strong>{prod.name}</strong>
                      <span className="price-tag">🪙 {sellPrice}</span>
                    </div>
                    <p className="item-desc">{prod.description}</p>
                    <div className="item-meta">
                      Stock: {state.stock[prod.id]} · Steps: {prod.tapsToBake}
                    </div>
                  </div>
                  <div className="item-action">
                    {unlocked ? (
                      <button
                        type="button"
                        className={`pixel-btn ${isSelected ? 'btn-active' : 'btn-secondary'}`}
                        onClick={() => onSelectProduct(prod.id)}
                        disabled={isSelected}
                      >
                        {isSelected ? 'Baking' : 'Select'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="pixel-btn btn-buy"
                        disabled={!canUnlock}
                        onClick={() => onUnlockProduct(prod.id)}
                      >
                        Unlock 🪙 {formatCoins(prod.unlockCost)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'upgrades' && (
          <div className="card-list">
            {UPGRADES.map((upg) => {
              const owned = hasUpgrade(state, upg.id);
              const affordable = canBuyUpgrade(state, upg.id);

              return (
                <div key={upg.id} className={`item-card ${owned ? 'card-owned' : ''}`}>
                  <div className="item-info">
                    <div className="item-header">
                      <span className="tier-badge">T{upg.tier}</span>
                      <strong>{upg.name}</strong>
                    </div>
                    <p className="item-desc">{upg.description}</p>
                  </div>
                  <div className="item-action">
                    {owned ? (
                      <span className="owned-badge">✓ OWNED</span>
                    ) : (
                      <button
                        type="button"
                        className="pixel-btn btn-buy"
                        disabled={!affordable}
                        onClick={() => onBuyUpgrade(upg.id)}
                      >
                        🪙 {formatCoins(upg.cost)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="card-list">
            {STAFF.map((member) => {
              const level = state.staff[member.id];
              const nextCost = getStaffCost(member.id, level);
              const affordable = canHireStaff(state, member.id);

              return (
                <div key={member.id} className="item-card">
                  <div className="item-info">
                    <div className="item-header">
                      <strong>{member.name}</strong>
                      <span className="level-badge">Lv.{level}</span>
                    </div>
                    <p className="item-desc">{member.description}</p>
                  </div>
                  <div className="item-action">
                    <button
                      type="button"
                      className="pixel-btn btn-buy"
                      disabled={!affordable}
                      onClick={() => onHireStaff(member.id)}
                    >
                      {level === 0 ? 'Hire' : 'Level Up'} 🪙 {formatCoins(nextCost)}
                    </button>
                  </div>
                </div>
              );
            })}
            <p className="helper-tip">
              💡 Tip: Hire an <strong>Apprentice Baker</strong> so your bakery keeps baking and
              earning coins while you&apos;re offline (up to 8 hours)!
            </p>
          </div>
        )}

        {activeTab === 'town' && (
          <div className="card-list">
            <div className="town-banner">
              <strong>🏘️ Town Square Expansion</strong>
              <p>
                Grow Sunny Hearth Bakery first! New neighborhood plots unlock in the upcoming Town
                Expansion update.
              </p>
            </div>
            {TOWN_TEASERS.map((shop) => (
              <div key={shop.id} className="item-card card-locked">
                <div className="item-info">
                  <div className="item-header">
                    <span>{shop.icon}</span>
                    <strong>{shop.name}</strong>
                  </div>
                  <p className="item-desc">{shop.tagline}</p>
                </div>
                <div className="item-action">
                  <span className="locked-badge">🔒 {shop.badge}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
