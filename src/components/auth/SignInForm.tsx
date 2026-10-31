import React, { useState } from 'react';
import { Button, Input } from '~/components/ui';

export interface SignInFormProps {
  onSuccess?: (data: { email: string }) => void;
  signUpUrl?: string;
  forgotPasswordUrl?: string;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  signUpUrl = '/signup',
  forgotPasswordUrl = '/forgot-password',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      triggerShake();
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate auth submit
    setTimeout(() => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess({ email });
      } else {
        window.location.href = '/wiki/';
      }
    }, 1000);
  };

  return (
    <div
      className={`w-full max-w-[480px] bg-[#131317] border border-white/10 rounded-2xl p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white font-sans ${
        isShaking ? 'animate-shake' : ''
      }`}
    >
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#c0f500]/10 border border-[#c0f500]/30 mb-4 shadow-[0_0_20px_rgba(192,245,0,0.2)]">
          <span className="w-3.5 h-3.5 rounded-full bg-[#c0f500] animate-pulse"></span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Sign in to WikiOfAutomation</h1>
        <p className="text-xs font-mono text-[#9ca3af] mt-1.5">
          Access reference-grade docs & autonomous agent swarms
        </p>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-3 mb-6">
        <button
          type="button"
          onClick={() => (window.location.href = '/api/auth/google')}
          className="w-full h-11 bg-[#1f1f23] hover:bg-white/10 text-white font-medium text-sm rounded-xl border border-white/15 transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#c0f500]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <button
          type="button"
          onClick={() => (window.location.href = '/api/auth/github')}
          className="w-full h-11 bg-[#1f1f23] hover:bg-white/10 text-white font-medium text-sm rounded-xl border border-white/15 transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#c0f500]"
        >
          <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span>Continue with GitHub</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-white/10 w-full"></div>
        <span className="bg-[#131317] px-4 text-xs font-mono text-[#9ca3af] uppercase">or</span>
        <div className="border-t border-white/10 w-full"></div>
      </div>

      {/* Sign In Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="name@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-[#9ca3af] font-medium">Password</span>
            <a
              href={forgotPasswordUrl}
              className="text-xs font-mono text-[#c0f500] hover:underline no-underline"
            >
              Forgot password?
            </a>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </div>

        {errors.general && (
          <p className="text-xs text-[#ef4444] font-mono text-center">{errors.general}</p>
        )}

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading} className="mt-2">
          Sign in →
        </Button>
      </form>

      {/* Sign Up Link */}
      <div className="text-center mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-[#9ca3af]">
          Don't have an account?{' '}
          <a href={signUpUrl} className="text-[#c0f500] font-bold hover:underline no-underline">
            Sign up free
          </a>
        </p>
      </div>
    </div>
  );
};
