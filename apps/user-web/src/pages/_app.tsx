import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Outfit } from 'next/font/google';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/query-client';
import { Layout } from '@/components/layout';
import { ToastProvider } from '@/components/ui';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SmoothScrollProvider } from '@/components/layout/SmoothScrollProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <SmoothScrollProvider>
          <div className={`${outfit.variable} font-sans`}>
            <ToastProvider>
              <Layout>
                <AuthGuard>
                  <Component {...pageProps} />
                </AuthGuard>
              </Layout>
            </ToastProvider>
          </div>
        </SmoothScrollProvider>
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
