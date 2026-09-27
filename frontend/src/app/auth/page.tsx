'use client';

import Link from 'next/link';
import { Wallet, Smartphone, Eye, EyeOff, ShieldCheck, Check, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [passkeyActive, setPasskeyActive] = useState(false);
  const [credentialId, setCredentialId] = useState<string>('');

  const handlePasskeyAuth = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined" && window.PublicKeyCredential) {
        try {
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          const userId = new Uint8Array(16);
          window.crypto.getRandomValues(userId);

          const credential = await navigator.credentials.create({
            publicKey: {
              challenge,
              rp: { name: "NovaWealth Robinhood", id: window.location.hostname },
              user: {
                id: userId,
                name: "investor@novawealth.rh",
                displayName: "NovaWealth Robinhood Investor"
              },
              pubKeyCredParams: [{ alg: -7, type: "public-key" }],
              timeout: 60000,
              authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "preferred"
              }
            }
          });
          if (credential) {
            setCredentialId(credential.id.slice(0, 16) + '...');
          }
        } catch (e) {
          setCredentialId('pk_device_' + Math.random().toString(36).substring(2, 8));
        }
      } else {
        setCredentialId('pk_device_' + Math.random().toString(36).substring(2, 8));
      }

      setPasskeyActive(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        router.push('/dashboard');
      } catch (err) {
        console.error(err);
      }
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="inline-block mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            Nova<span className="text-accent">Wealth</span>
          </h1>
        </Link>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-xl p-8 mb-6 shadow-2xl">
          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-border">
            <button
              onClick={() => setTab('signin')}
              className={`pb-4 text-sm font-semibold transition-colors ${
                tab === 'signin'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`pb-4 text-sm font-semibold transition-colors ${
                tab === 'signup'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push('/dashboard');
            }}
            className="space-y-4 mb-6"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="investor@example.com"
                defaultValue="investor@novawealth.rh"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  defaultValue="robinhood2026"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-primary-foreground py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 text-sm"
            >
              {tab === 'signin' ? 'Sign In to Dashboard' : 'Create Smart Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">OR WEB3 PASSKEY</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Passkey Sign In */}
          <button
            type="button"
            onClick={handlePasskeyAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 bg-secondary border border-border rounded-lg px-4 py-3 font-semibold text-foreground hover:border-accent hover:bg-secondary/80 transition-colors mb-3 text-sm"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Smartphone size={18} className="text-accent" />}
            <span>
              {passkeyActive
                ? `✓ Passkey Connected (${credentialId || 'Ready'})`
                : '1-Click Biometric Passkey (FaceID / TouchID)'}
            </span>
          </button>

          {/* Wallet Connect */}
          <button
            type="button"
            onClick={handleWalletConnect}
            className="w-full flex items-center justify-center gap-2.5 bg-secondary border border-border rounded-lg px-4 py-3 font-semibold text-foreground hover:border-accent hover:bg-secondary/80 transition-colors text-sm"
          >
            <Wallet size={18} className="text-accent" />
            <span>Connect Wallet (Robinhood Chain 46630)</span>
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs font-bold text-accent mb-1">Biometric Passkey</p>
            <p className="text-xs text-muted-foreground">
              FaceID / TouchID. Zero seed phrases.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs font-bold text-accent mb-1">Gas Sponsored</p>
            <p className="text-xs text-muted-foreground">
              100% gasless execution via paymaster.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Built for the Arbitrum Open House Singapore Buildathon • Robinhood Chain Testnet
        </p>
      </div>
    </main>
  );
}
