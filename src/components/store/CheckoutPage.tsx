import React, { useState, useEffect } from 'react';

export const CheckoutPage: React.FC = () => {
  const [itemSlug, setItemSlug] = useState<string>('autonomous-seo-aeo-directrelay-empire-156-nodes');
  const [itemTitle, setItemTitle] = useState<string>('157-Node Autonomous SEO/AEO Empire Blueprint');
  const [itemPrice, setItemPrice] = useState<number>(79);
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get('item');
      const title = params.get('title');
      const price = Number(params.get('price'));
      if (slug) setItemSlug(slug);
      if (title) setItemTitle(title);
      if (!Number.isNaN(price) && price > 0) setItemPrice(price);
    }
  }, []);

  const handleLemonCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address for license key delivery.');
      return;
    }
    setError('');
    setIsRedirecting(true);

    const storeBase = 'https://wikiofautomation.lemonsqueezy.com/checkout';
    const customUrl = `${storeBase}?checkout[email]=${encodeURIComponent(
      email.trim(),
    )}&checkout[custom][item_slug]=${encodeURIComponent(itemSlug)}`;

    setTimeout(() => {
      window.location.href = customUrl;
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col font-sans">
      {/* Minimal Navbar */}
      <header className="w-full h-20 px-6 sm:px-12 flex items-center justify-between border-b border-white/10 z-20">
        <a href="/marketplace" className="flex items-center gap-3 group no-underline">
          <div className="w-9 h-9 rounded-xl bg-[#c0f500] text-[#161f00] flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(192,245,0,0.4)]">
            ⚡
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            Wiki <span className="text-[#c0f500]">of Automation</span>
          </span>
        </a>
        <div className="text-xs font-mono text-[#c0f500] flex items-center gap-1.5">
          🍋 <span>Secured by Lemon Squeezy (Merchant of Record)</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1040px] w-full mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Lemon Squeezy Checkout Initialization */}
          <div className="lg:col-span-7 bg-[#131317] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c0f500]/10 border border-[#c0f500]/30 font-mono text-xs text-[#c0f500]">
              INSTANT VAULT LICENSE DELIVERY
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Complete Your Purchase via Lemon Squeezy
            </h1>
            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
              Lemon Squeezy handles global tax compliance, VAT, Apple Pay, Google Pay, and card processing. Immediately after payment, our webhook (`POST /api/webhooks/lemonsqueezy`) activates your `LSQ-XXXX` license key for instant vault downloads.
            </p>

            <form onSubmit={handleLemonCheckout} className="space-y-5 pt-2">
              <div>
                <label className="block text-xs font-mono text-[#9ca3af] uppercase tracking-wider mb-2">
                  Delivery Email Address (for License Key & Vault Access) *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="founder@company.com"
                  className="w-full h-12 bg-[#050508] border border-white/15 focus:border-[#c0f500] rounded-xl px-4 text-sm text-white focus:outline-none"
                />
                {error && <p className="text-xs text-red-400 font-mono mt-1.5">{error}</p>}
              </div>

              <button
                type="submit"
                disabled={isRedirecting}
                className="w-full h-13 bg-[#c0f500] hover:bg-[#b0e000] text-[#161f00] font-bold rounded-xl text-base shadow-[0_0_25px_rgba(192,245,0,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isRedirecting
                  ? '🍋 Launching Lemon Squeezy Checkout...'
                  : `🍋 Proceed to Lemon Squeezy Checkout ($${itemPrice.toFixed(2)}) →`}
              </button>
            </form>

            <div className="border-t border-white/10 pt-5 grid grid-cols-3 gap-3 text-center font-mono text-[11px] text-[#9ca3af]">
              <div className="bg-[#050508] p-3 rounded-xl border border-white/5">
                ✓ Instant License Key
              </div>
              <div className="bg-[#050508] p-3 rounded-xl border border-white/5">
                ✓ Lifetime Updates
              </div>
              <div className="bg-[#050508] p-3 rounded-xl border border-white/5">
                ✓ Global Tax Invoices
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-[#131317] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
              <h2 className="text-sm font-mono font-bold text-[#00e3fd] uppercase tracking-wider border-b border-white/10 pb-3">
                Vault Order Summary
              </h2>

              <div className="space-y-2">
                <div className="text-lg font-bold text-white">{itemTitle}</div>
                <div className="text-xs font-mono text-[#9ca3af]">Slug: {itemSlug}</div>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-[#9ca3af]">
                  <span>License Tier</span>
                  <span className="text-white">Commercial + Source Code</span>
                </div>
                <div className="flex justify-between text-[#9ca3af]">
                  <span>Delivery Method</span>
                  <span className="text-[#c0f500]">Private Vault API + ZIP/JSON</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                  <span>Total Due</span>
                  <span className="text-[#c0f500]">${itemPrice.toFixed(2)} USD</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};
