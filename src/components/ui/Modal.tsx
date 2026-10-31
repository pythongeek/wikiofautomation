import React, { forwardRef, useEffect, useRef } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      size = 'md',
      children,
      footer,
      className = '',
      closeOnOverlayClick = true,
    },
    ref
  ) => {
    const dialogRef = useRef<HTMLDivElement>(null);
    const titleId = React.useId();
    const descId = React.useId();

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onClose();
        }
      };

      if (isOpen) {
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);
      } else {
        document.body.style.overflow = '';
      }

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeStyles = {
      sm: 'sm:max-w-[400px]',
      md: 'sm:max-w-[560px]',
      lg: 'sm:max-w-[720px]',
      full: 'sm:max-w-[95vw] sm:h-[90vh]',
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-[#0a0a0f]/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      >
        <div
          ref={ref || dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descId : undefined}
          onClick={(e) => e.stopPropagation()}
          className={`w-full h-full sm:h-auto max-h-full overflow-y-auto bg-[#131317] border border-white/10 rounded-none sm:rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white flex flex-col justify-between ${sizeStyles[size]} ${className}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              {title && (
                <h2 id={titleId} className="text-xl font-bold text-white tracking-tight">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="text-xs font-mono text-[#9ca3af] mt-1">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#c0f500]"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 overflow-y-auto font-sans text-sm text-[#e5e1e7]">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 sm:p-6 border-t border-white/10 bg-[#050508]/60 flex items-center justify-end gap-3 rounded-b-2xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Modal.displayName = 'Modal';
