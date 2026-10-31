import React from 'react';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  variant?: 'marketplace' | 'wiki' | 'dashboard' | 'cart' | 'orders' | 'forum' | 'generic';
}

/* ─── Pre-configured Context Helpers ────────────────── */
export interface EmptyStatePreset {
  icon: string;
  title: string;
  message: string;
  ctaText?: string;
  ctaLink?: string;
}

export const EMPTY_STATE_PRESETS: Record<string, EmptyStatePreset> = {
  marketplace: {
    icon: 'search_off',
    title: 'No marketplace results',
    message: 'Nothing found for those filters. Try removing a filter or Ask Ada.',
    ctaText: 'Reset Filters',
  },
  wiki: {
    icon: 'menu_book',
    title: 'No wiki entries yet',
    message: 'This category is being built. Want to contribute?',
    ctaText: 'Contribute Entry',
    ctaLink: '/dashboard',
  },
  dashboard: {
    icon: 'storefront',
    title: 'No listings published',
    message: "You haven't published anything yet. Your first listing takes under 5 minutes.",
    ctaText: '+ Publish New Listing',
    ctaLink: '/dashboard',
  },
  cart: {
    icon: 'shopping_cart',
    title: 'Your cart is empty',
    message: 'Your cart is empty. Browse the marketplace or ask Ada for recommendations.',
    ctaText: 'Browse Marketplace',
    ctaLink: '/marketplace',
  },
  orders: {
    icon: 'receipt_long',
    title: 'No purchases yet',
    message: 'No purchases yet. Everything on the marketplace has a free tier.',
    ctaText: 'Explore Free Tools',
    ctaLink: '/marketplace',
  },
  forum: {
    icon: 'forum',
    title: 'No discussions yet',
    message: 'Be the first to post in this category.',
    ctaText: '+ Start Discussion',
    ctaLink: '/community/forum',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  ctaText,
  ctaLink,
  onCtaClick,
  variant = 'generic',
}) => {
  const preset = variant !== 'generic' ? EMPTY_STATE_PRESETS[variant] : null;
  const displayIcon = icon || preset?.icon || 'inbox';
  const displayTitle = title || preset?.title || 'Nothing here yet';
  const displayMessage = message || preset?.message || 'No items available.';
  const displayCtaText = ctaText || preset?.ctaText;
  const displayCtaLink = ctaLink || preset?.ctaLink;

  return (
    <div className="bg-[#131317] border border-[#232329] rounded-2xl p-10 text-center max-w-lg mx-auto my-8 space-y-4 shadow-xl">
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-[#1B1B1F] border border-[#232329] flex items-center justify-center mx-auto text-[#C0F500]">
        <span className="material-symbols-outlined" style={{ fontSize: 32 }}>
          {displayIcon}
        </span>
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-[#E5E1E7] tracking-tight">{displayTitle}</h3>
        <p className="text-[13px] text-[#8B8FA3] leading-relaxed max-w-md mx-auto">{displayMessage}</p>
      </div>

      {/* Action Button */}
      {displayCtaText && (
        <div className="pt-2">
          {displayCtaLink ? (
            <a
              href={displayCtaLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C0F500] text-[#050508] text-[13px] font-semibold hover:bg-[#D4FF33] transition-all transform hover:-translate-y-0.5 shadow-md"
            >
              {displayCtaText}
            </a>
          ) : (
            <button
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C0F500] text-[#050508] text-[13px] font-semibold hover:bg-[#D4FF33] transition-all transform hover:-translate-y-0.5 shadow-md"
            >
              {displayCtaText}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
