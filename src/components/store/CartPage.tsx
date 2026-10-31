import React, { useState } from 'react';

export interface CartItem {
  id: string;
  title: string;
  type: string;
  creator: string;
  price: number;
  icon: string;
  slug: string;
}

const INITIAL_CART: CartItem[] = [
  {
    id: '1',
    title: 'Inbox Triage Agent',
    type: 'agent',
    creator: '@ada_labs',
    price: 0,
    icon: '📬',
    slug: 'inbox-triage-agent'
  },
  {
    id: '2',
    title: 'Customer Support Bot',
    type: 'workflow',
    creator: '@automatepro',
    price: 9,
    icon: '🤖',
    slug: 'customer-support-bot'
  },
  {
    id: '3',
    title: 'Neural Web Scraper',
    type: 'agent',
    creator: '@cyberdata',
    price: 29,
    icon: '🕸️',
    slug: 'neural-web-scraper'
  }
];

const RELATED_PRODUCTS = [
  {
    id: '4',
    title: 'Autonomous Dev OS',
    type: 'ai-os',
    creator: '@openos',
    price: 49,
    icon: '🖥️',
    rating: 4.95,
    summary: 'Containerized Linux desktop inside Docker with AutoGen multi-agent swarms.'
  },
  {
    id: '5',
    title: 'Claude Prompt Engineer',
    type: 'prompt',
    creator: '@metaprompt',
    price: 0,
    icon: '✍️',
    rating: 4.9,
    summary: 'Master system prompt meta-generator for Claude 3.7 Sonnet extended thinking.'
  },
  {
    id: '6',
    title: 'Stripe Churn Prevention Drip',
    type: 'workflow',
    creator: '@saasflow',
    price: 19,
    icon: '💳',
    rating: 4.85,
    summary: 'Automated n8n workflow for failed Stripe payments recovery with AI emails.'
  }
];

export const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART);
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const discount = (subtotal * discountPercent) / 100;
  const total = Math.max(0, subtotal - discount);

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    const clean = coupon.trim().toUpperCase();
    if (!clean) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (clean === 'WOA20' || clean === 'LAUNCH20') {
      setDiscountPercent(20);
      setCouponSuccess('Coupon applied! 20% discount applied to cart.');
    } else if (clean === 'FREEWOA') {
      setDiscountPercent(100);
      setCouponSuccess('Coupon applied! 100% discount applied to cart.');
    } else {
      setCouponError('Invalid coupon code. Try "WOA20".');
    }
  };

  const handleAddToCart = (product: typeof RELATED_PRODUCTS[0]) => {
    if (items.some((i) => i.id === product.id)) return;
    setItems((prev) => [
      ...prev,
      {
        id: product.id,
        title: product.title,
        type: product.type,
        creator: product.creator,
        price: product.price,
        icon: product.icon,
        slug: product.title.toLowerCase().replace(/\s+/g, '-')
      }
    ]);
  };

  return (
    <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-8 sm:py-12 font-sans text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your Cart <span className="text-[#c0f500] font-mono text-xl sm:text-2xl">({items.length} items)</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#9ca3af] mt-1">
            Review your selected automation tools, agents, and workflows before checkout.
          </p>
        </div>
        <a
          href="/marketplace"
          className="text-xs font-mono text-[#00e3fd] hover:underline hidden sm:inline-flex items-center gap-1"
        >
          ← Continue Shopping
        </a>
      </div>

      {items.length === 0 ? (
        <div className="bg-[#131317] border border-white/10 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#1f1f23] text-3xl flex items-center justify-center">
            🛒
          </div>
          <h2 className="text-xl font-bold text-white">Your cart is currently empty</h2>
          <p className="text-sm text-[#9ca3af] max-w-md mx-auto">
            Browse our marketplace of AI agents, n8n workflows, and developer OS tools to add items to your cart.
          </p>
          <a
            href="/marketplace"
            className="inline-flex items-center justify-center px-6 h-11 bg-[#c0f500] text-[#161f00] font-bold rounded-xl text-sm shadow-[0_0_20px_rgba(192,245,0,0.3)] hover:scale-105 transition-transform no-underline"
          >
            Explore Marketplace →
          </a>
        </div>
      ) : (
        /* 2-Column Layout */
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* LEFT: Cart Items List */}
          <main className="flex-1 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#131317] border border-white/10 hover:border-white/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#1f1f23] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] text-[#c0f500] uppercase tracking-wider font-bold">
                      {item.type}
                    </span>
                    <h3 className="text-base font-bold text-white truncate">{item.title}</h3>
                    <div className="text-xs font-mono text-[#9ca3af]">
                      By <span className="text-white">{item.creator}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-bold font-mono text-white">
                      {item.price === 0 ? <span className="text-[#c0f500]">FREE</span> : `$${item.price.toFixed(2)}`}
                    </div>
                    {item.price > 0 && <div className="text-[10px] font-mono text-[#9ca3af]">Instant Access</div>}
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label={`Remove ${item.title}`}
                    className="w-10 h-10 rounded-xl bg-[#1f1f23] hover:bg-red-500/20 text-[#9ca3af] hover:text-red-400 border border-white/10 hover:border-red-500/30 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-2 text-right">
              <button
                onClick={() => setItems([])}
                className="text-xs font-mono text-[#9ca3af] hover:text-red-400 underline cursor-pointer bg-transparent border-none"
              >
                Clear entire cart
              </button>
            </div>
          </main>

          {/* RIGHT: Sticky Order Summary */}
          <aside className="w-full lg:w-96 shrink-0 space-y-6 sticky top-24 h-fit">
            <div className="bg-[#131317] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
              <h2 className="text-lg font-bold text-white tracking-tight border-b border-white/10 pb-4">
                Order Summary
              </h2>

              {/* Pricing Breakdown */}
              <div className="space-y-3 font-mono text-sm">
                <div className="flex items-center justify-between text-[#9ca3af]">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex items-center justify-between text-[#c0f500]">
                    <span>Discount ({discountPercent}%)</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-base">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#c0f500]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon Field */}
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-white/10">
                <label className="block text-xs font-mono text-[#9ca3af] uppercase tracking-wider">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Try WOA20"
                    className="flex-1 h-11 bg-[#1f1f23] border border-white/10 focus:border-[#c0f500] rounded-xl px-3 text-xs sm:text-sm font-mono text-white placeholder-[#9ca3af]/50 focus:outline-none min-h-[44px]"
                  />
                  <button
                    type="submit"
                    className="px-4 h-11 bg-[#1f1f23] hover:bg-white/10 text-white font-mono text-xs font-bold rounded-xl border border-white/10 transition-colors cursor-pointer min-h-[44px]"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-400 font-mono mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-[#c0f500] font-mono mt-1">{couponSuccess}</p>}
              </form>

              {/* CTA Button */}
              <a href="/store/checkout" className="no-underline block">
                <button className="w-full h-12 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-base shadow-[0_0_25px_rgba(192,245,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer min-h-[48px] flex items-center justify-center gap-2">
                  Proceed to checkout →
                </button>
              </a>

              {/* Trust Badges */}
              <div className="border-t border-white/10 pt-4 space-y-2 text-xs font-mono text-[#9ca3af]">
                <div className="flex items-center gap-2">
                  <span className="text-[#c0f500] font-bold">✓</span> 🔐 256-Bit SSL Encrypted Checkout
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c0f500] font-bold">✓</span> 🔄 30-Day Money-Back Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#c0f500] font-bold">✓</span> ⚡ Instant License & Asset Download
                </div>
              </div>

              {/* Payment Methods */}
              <div className="border-t border-white/10 pt-4 text-center">
                <span className="text-[11px] font-mono text-[#9ca3af] block mb-2">Supported Payment Gateways</span>
                <div className="flex items-center justify-center gap-3 text-xs font-mono text-white/70">
                  <span className="bg-[#1f1f23] px-2.5 py-1 rounded border border-white/10">💳 Stripe</span>
                  <span className="bg-[#1f1f23] px-2.5 py-1 rounded border border-white/10">💎 USDC / ETH</span>
                  <span className="bg-[#1f1f23] px-2.5 py-1 rounded border border-white/10">⚡ Lightning</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* You Might Also Want */}
      <div className="border-t border-white/10 pt-12 mt-16 space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight">You Might Also Want</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {RELATED_PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#131317] border border-white/10 hover:border-[#c0f500] p-6 rounded-2xl flex flex-col justify-between transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{prod.icon}</span>
                  <span className="font-mono text-xs text-[#c0f500] font-bold bg-[#1f1f23] px-2.5 py-1 rounded-full border border-white/10">
                    {prod.price === 0 ? 'FREE' : `$${prod.price}`}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#c0f500] transition-colors">
                  {prod.title}
                </h3>
                <p className="text-xs text-[#9ca3af] line-clamp-2 leading-relaxed">{prod.summary}</p>
              </div>

              <button
                onClick={() => handleAddToCart(prod)}
                disabled={items.some((i) => i.id === prod.id)}
                className={`w-full mt-6 h-10 rounded-xl font-mono text-xs font-bold border transition-colors cursor-pointer min-h-[44px] ${
                  items.some((i) => i.id === prod.id)
                    ? 'bg-[#1f1f23] text-[#9ca3af] border-white/10 cursor-not-allowed'
                    : 'bg-[#1f1f23] hover:bg-[#c0f500] hover:text-[#161f00] text-white border-white/10 hover:border-[#c0f500]'
                }`}
              >
                {items.some((i) => i.id === prod.id) ? 'Added to Cart ✓' : '+ Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
