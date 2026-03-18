import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import {
  Wallet as WalletIcon,
  Coins,
  TrendingUp,
  TrendingDown,
  Clock,
  Gift,
  CreditCard,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card, Loading, Button, Alert } from '@/components/ui';
import { useWallet, useWalletTransactions } from '@/hooks';
import { useAuthStore } from '@/stores/auth';

const txIcons: Record<string, { icon: React.ReactNode; color: string; prefix: string }> = {
  EARNED: { icon: <Coins className="w-5 h-5" />, color: 'text-emerald-600', prefix: '+' },
  SPENT: { icon: <CreditCard className="w-5 h-5" />, color: 'text-rose-600', prefix: '-' },
  EXPIRED: { icon: <Clock className="w-5 h-5" />, color: 'text-gray-400', prefix: '-' },
  REFERRAL: { icon: <Gift className="w-5 h-5" />, color: 'text-emerald-600', prefix: '+' },
};

const getTxIcon = (type: string) =>
  txIcons[type] || { icon: <RotateCcw className="w-5 h-5" />, color: 'text-gray-500', prefix: '' };

export default function WalletPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { data: wallet, isLoading: walletLoading, refetch } = useWallet();
  const { data: txData } = useWalletTransactions();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/wallet');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || walletLoading) {
    return <Loading text="Loading wallet..." />;
  }

  const txs = txData?.transactions || wallet?.transactions || [];

  return (
    <>
      <Head>
        <title>Wallet - Overline</title>
      </Head>
      <div className="container-app py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wallet</h1>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none shadow-xl overflow-hidden relative mb-6">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />
          <div className="relative z-10 px-6 py-8 text-center">
            <p className="text-sm font-medium text-white/70 uppercase tracking-wide mb-2">Free Cash Balance</p>
            <p className="text-5xl font-extrabold mb-6">₹{wallet?.balance ?? 0}</p>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold">₹{wallet?.totalEarned ?? 0}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">Earned</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-bold">₹{wallet?.totalSpent ?? 0}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">Used</p>
              </div>
            </div>
          </div>
        </Card>

        {/* How It Works */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How Free Cash Works</h3>
          <div className="space-y-4">
            {[
              { icon: <TrendingUp className="w-5 h-5 text-primary-500" />, text: 'Earn 2% free cash on every booking' },
              { icon: <Gift className="w-5 h-5 text-primary-500" />, text: 'Get ₹50 for every friend you refer' },
              { icon: <CreditCard className="w-5 h-5 text-primary-500" />, text: 'Use free cash on your next booking' },
              { icon: <Clock className="w-5 h-5 text-primary-500" />, text: 'Free cash expires after 90 days' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  {item.icon}
                </div>
                <span className="text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Transaction History */}
        <Card padding="none">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {txs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <WalletIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No transactions yet</p>
              <p className="text-gray-400 text-sm mt-1">Your wallet transactions will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {txs.map((tx) => {
                const { icon, color, prefix } = getTxIcon(tx.type);
                return (
                  <div key={tx.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div
                      className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${color}`}
                    >
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{tx.description}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(tx.createdAt), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                    <div className={`font-bold ${color}`}>
                      {prefix}₹{tx.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
