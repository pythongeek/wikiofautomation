import React, { forwardRef } from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hoverable = true,
      header,
      footer,
      title,
      subtitle,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const variantStyles = {
      default: 'bg-[#131317] border border-white/10 text-white',
      outlined: 'bg-transparent border border-white/20 text-white',
      elevated: 'bg-[#131317] border border-white/10 text-white shadow-[0_10px_30px_rgba(0,0,0,0.5)]',
    };

    const hoverStyle = hoverable
      ? 'transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c0f500]/40 hover:shadow-[0_0_25px_rgba(192,245,0,0.15)]'
      : '';

    return (
      <div
        ref={ref}
        className={`rounded-2xl overflow-hidden flex flex-col ${variantStyles[variant]} ${hoverStyle} ${className}`}
        {...props}
      >
        {(header || title) && (
          <div className={`border-b border-white/10 ${paddingStyles[padding]} pb-4`}>
            {header ? (
              header
            ) : (
              <div>
                {title && <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>}
                {subtitle && <p className="text-xs font-mono text-[#9ca3af] mt-1">{subtitle}</p>}
              </div>
            )}
          </div>
        )}

        <div className={`flex-1 ${paddingStyles[padding]}`}>{children}</div>

        {footer && (
          <div className={`border-t border-white/10 ${paddingStyles[padding]} pt-4 bg-[#050508]/40`}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';
