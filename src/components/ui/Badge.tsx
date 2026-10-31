import React, { forwardRef } from 'react';

export type CategoryType = 'agents' | 'workflows' | 'skills' | 'seo';
export type PriceType = 'FREE' | 'PRO' | 'PAID';
export type PlatformType = 'claude' | 'n8n' | 'hermes' | 'openclaw';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'category' | 'price' | 'platform' | 'custom';
  category?: CategoryType;
  price?: PriceType;
  platform?: PlatformType;
  colorScheme?: 'violet' | 'teal' | 'amber' | 'green' | 'orange' | 'blue';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'custom',
      category,
      price,
      platform,
      colorScheme = 'green',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center gap-1 font-mono text-[11px] font-semibold py-[3px] px-[8px] rounded-full tracking-wide uppercase select-none transition-colors';

    const categoryStyles: Record<CategoryType, string> = {
      agents: 'bg-[#7b61ff]/15 text-[#7b61ff] border border-[#7b61ff]/30',
      workflows: 'bg-[#00e3fd]/15 text-[#00e3fd] border border-[#00e3fd]/30',
      skills: 'bg-[#ffb703]/15 text-[#ffb703] border border-[#ffb703]/30',
      seo: 'bg-[#c0f500]/15 text-[#c0f500] border border-[#c0f500]/30',
    };

    const priceStyles: Record<PriceType, string> = {
      FREE: 'bg-[#00e3fd]/15 text-[#00e3fd] border border-[#00e3fd]/30',
      PRO: 'bg-[#7b61ff]/15 text-[#7b61ff] border border-[#7b61ff]/30',
      PAID: 'bg-transparent text-white border border-white/30',
    };

    const platformStyles: Record<PlatformType, string> = {
      claude: 'bg-[#7b61ff]/15 text-[#7b61ff] border border-[#7b61ff]/30',
      n8n: 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30',
      hermes: 'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30',
      openclaw: 'bg-[#00e3fd]/15 text-[#00e3fd] border border-[#00e3fd]/30',
    };

    const schemeStyles = {
      violet: 'bg-[#7b61ff]/15 text-[#7b61ff] border border-[#7b61ff]/30',
      teal: 'bg-[#00e3fd]/15 text-[#00e3fd] border border-[#00e3fd]/30',
      amber: 'bg-[#ffb703]/15 text-[#ffb703] border border-[#ffb703]/30',
      green: 'bg-[#c0f500]/15 text-[#c0f500] border border-[#c0f500]/30',
      orange: 'bg-[#ff5722]/15 text-[#ff5722] border border-[#ff5722]/30',
      blue: 'bg-[#3b82f6]/15 text-[#3b82f6] border border-[#3b82f6]/30',
    };

    let style = schemeStyles[colorScheme];
    let label = children;

    if (variant === 'category' && category) {
      style = categoryStyles[category];
      label = label || category;
    } else if (variant === 'price' && price) {
      style = priceStyles[price];
      label = label || price;
    } else if (variant === 'platform' && platform) {
      style = platformStyles[platform];
      label = label || platform;
    }

    return (
      <span ref={ref} className={`${baseStyle} ${style} ${className}`} {...props}>
        {label}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
