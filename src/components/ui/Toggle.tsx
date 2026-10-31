import React, { forwardRef } from 'react';

export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'md';
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      checked = false,
      onChange,
      label,
      description,
      labelPosition = 'right',
      size = 'md',
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    const trackSize = size === 'sm' ? 'w-8 h-4.5 p-0.5' : 'w-11 h-6 p-0.5';
    const thumbSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-5 h-5';
    const thumbTranslate = size === 'sm' ? (checked ? 'translate-x-3.5' : 'translate-x-0') : (checked ? 'translate-x-5' : 'translate-x-0');

    const handleClick = () => {
      if (!disabled && onChange) {
        onChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleClick();
      }
    };

    const switchElement = (
      <button
        ref={ref}
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#c0f500] focus:ring-offset-2 focus:ring-offset-[#050508] disabled:opacity-50 disabled:cursor-not-allowed select-none ${trackSize} ${
          checked ? 'bg-[#c0f500] border border-[#c0f500]' : 'bg-[#1f1f23] border border-white/20'
        } ${className}`}
        {...props}
      >
        <span
          className={`transform rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out ${thumbSize} ${thumbTranslate}`}
        />
      </button>
    );

    if (!label && !description) {
      return switchElement;
    }

    return (
      <div className="inline-flex items-center gap-3 font-sans">
        {labelPosition === 'left' && (
          <div className="flex flex-col cursor-pointer" onClick={handleClick}>
            {label && <span className="text-sm font-medium text-white select-none">{label}</span>}
            {description && <span className="text-xs font-mono text-[#9ca3af]">{description}</span>}
          </div>
        )}

        {switchElement}

        {labelPosition === 'right' && (
          <div className="flex flex-col cursor-pointer" onClick={handleClick}>
            {label && <span className="text-sm font-medium text-white select-none">{label}</span>}
            {description && <span className="text-xs font-mono text-[#9ca3af]">{description}</span>}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
