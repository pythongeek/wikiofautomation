import React, { forwardRef } from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'avatar' | 'card' | 'image' | 'button' | 'custom';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      lines = 1,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const baseShimmer =
      'relative overflow-hidden bg-[#1f1f23] rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent';

    if (variant === 'avatar') {
      return (
        <div
          ref={ref}
          className={`${baseShimmer} rounded-full shrink-0 ${className}`}
          style={{
            width: width || 40,
            height: height || 40,
            ...style,
          }}
          {...props}
        />
      );
    }

    if (variant === 'image') {
      return (
        <div
          ref={ref}
          className={`${baseShimmer} w-full rounded-2xl ${className}`}
          style={{
            height: height || 200,
            ...style,
          }}
          {...props}
        />
      );
    }

    if (variant === 'button') {
      return (
        <div
          ref={ref}
          className={`${baseShimmer} rounded-xl ${className}`}
          style={{
            width: width || 120,
            height: height || 40,
            ...style,
          }}
          {...props}
        />
      );
    }

    if (variant === 'card') {
      return (
        <div
          ref={ref}
          className={`bg-[#131317] border border-white/10 p-6 rounded-2xl space-y-4 ${className}`}
          {...props}
        >
          <div className="flex items-center gap-3">
            <div className={`${baseShimmer} w-10 h-10 rounded-full`} />
            <div className="space-y-2 flex-1">
              <div className={`${baseShimmer} h-4 w-1/3 rounded-md`} />
              <div className={`${baseShimmer} h-3 w-1/4 rounded-md`} />
            </div>
          </div>
          <div className={`${baseShimmer} h-24 w-full rounded-xl`} />
          <div className="space-y-2">
            <div className={`${baseShimmer} h-3.5 w-full rounded-md`} />
            <div className={`${baseShimmer} h-3.5 w-4/5 rounded-md`} />
          </div>
        </div>
      );
    }

    if (lines > 1) {
      return (
        <div ref={ref} className={`space-y-2.5 w-full ${className}`} {...props}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`${baseShimmer} h-4 rounded-md`}
              style={{
                width: i === lines - 1 ? '70%' : '100%',
                height: height || 16,
              }}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`${baseShimmer} rounded-md ${className}`}
        style={{
          width: width || '100%',
          height: height || 16,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
