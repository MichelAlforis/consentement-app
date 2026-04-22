'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ErrorBoundary${this.props.label ? `:${this.props.label}` : ''}]`, error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <DefaultFallback onRetry={() => this.setState({ hasError: false, error: null })} />;
    }
    return this.props.children;
  }
}

function DefaultFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-8 bg-[#0a0a0f]">
      <p className="text-white/70 text-sm text-center">
        Une erreur inattendue s&apos;est produite.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );
}
