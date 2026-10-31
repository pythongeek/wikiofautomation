import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c0f500] focus:ring-offset-2 focus:ring-offset-[#050508] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-10 px-4 text-sm gap-2 rounded-xl',
      lg: 'h-12 px-6 text-base gap-2.5 rounded-xl',
    };

    const variantStyles = {
      primary:
        'bg-[#c0f500] text-[#161f00] font-bold hover:bg-[#a8d700] hover:shadow-[0_0_20px_rgba(192,245,0,0.4)] border border-[#c0f500]',
      secondary:
        'bg-transparent text-white border border-white/20 hover:border-[#c0f500] hover:text-[#c0f500] hover:bg-white/5',
      ghost:
        'bg-transparent text-[#c0f500] hover:bg-[#c0f500]/10 border border-transparent',
      danger:
        'bg-[#ef4444] text-white font-bold hover:bg-[#dc2626] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-[#ef4444]',
      pill:
        'bg-[#c0f500] text-[#161f00] font-bold hover:bg-[#a8d700] rounded-full hover:shadow-[0_0_20px_rgba(192,245,0,0.4)] border border-[#c0f500]',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
