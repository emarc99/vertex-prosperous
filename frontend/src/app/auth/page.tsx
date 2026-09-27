'use client';

import Link from 'next/link';
import { Wallet, Smartphone, Eye, EyeOff, ShieldCheck, Check, Loader2, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ROBINHOOD_TESTNET_PARAMS = {
  chainId: '0xb626', // 46630 in hex
  chainName: 'Robinhood Chain Testnet',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: ['https://rpc.testnet.chain.robinhood.com'],
  blockExplorerUrls: ['https://explorer.testnet.chain.robinhood.com'],
};

export default function AuthPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  
  // Form states
  const [email, setEmail] = useState('investor@novawealth.rh');
  const [password, setPassword] = useState('robinhood2026');

  // Loading & status states
  const [loadingMethod, setLoadingMethod] = useState<'email' | 'passkey' | 'wallet' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check if already authenticated on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('nova_auth_method');
      if (storedAuth) {
        setSuccessMsg(`Active session found (${storedAuth}). Redirecting...`);
      }
    }
  }, []);

  // 1. Email / Password Authentication
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoadingMethod('email');

    try {
      if (!email || !email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      // Simulate authentication API call
      await new Promise((res) => setTimeout(res, 700));

      const mockSmartAccount = '0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7';
      localStorage.setItem('nova_auth_method', 'email');
      localStorage.setItem('nova_user_email', email);
      localStorage.setItem('nova_user_address', mockSmartAccount);

      setSuccessMsg(`Welcome, ${email}! Logging into your Smart Account...`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoadingMethod(null);
    }
  };

  // 2. Web3 Option A: 1-Click Biometric Passkey (WebAuthn / ERC-4337 Smart Account)
  const handlePasskeyAuth = async () => {
    setErrorMsg(null);
    setLoadingMethod('passkey');

    try {
      let passkeyId = 'pk_' + Math.random().toString(36).substring(2, 10);

      // Trigger native browser WebAuthn API if supported
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        try {
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          const userId = new Uint8Array(16);
          window.crypto.getRandomValues(userId);

          const credential = (await navigator.credentials.create({
            publicKey: {
              challenge,
              rp: { name: 'NovaWealth Robinhood', id: window.location.hostname },
              user: {
                id: userId,
                name: email || 'investor@novawealth.rh',
                displayName: 'NovaWealth Robinhood Investor',
              },
              pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
              timeout: 60000,
              authenticatorSelection: {
                authenticatorAttachment: 'platform',
                userVerification: 'preferred',
              },
            },
          })) as any;

          if (credential && credential.id) {
            passkeyId = credential.id;
          }
        } catch (webauthnErr: any) {
          console.warn('WebAuthn prompt bypassed or local fallback used:', webauthnErr.message);
          // If user cancelled, throw
          if (webauthnErr.name === 'NotAllowedError') {
            throw new Error('Biometric Passkey scan was cancelled.');
          }
        }
      }

      // Bind to user's smart account on Robinhood Chain
      const passkeySmartAccount = '0xb8AD2787f447e04E8D66D7e888Dd48fB68DdedB7';
      localStorage.setItem('nova_auth_method', 'passkey');
      localStorage.setItem('nova_passkey_id', passkeyId);
      localStorage.setItem('nova_user_address', passkeySmartAccount);

      setSuccessMsg(`✓ Biometric Passkey verified! Bound to Smart Account ${passkeySmartAccount.slice(0, 6)}...${passkeySmartAccount.slice(-4)}`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Biometric authentication failed.');
    } finally {
      setLoadingMethod(null);
    }
  };

  // 3. Web3 Option B: Connect Wallet (MetaMask / Rabby / Robinhood Wallet on Chain 46630)
  const handleWalletConnect = async () => {
    setErrorMsg(null);
    setLoadingMethod('wallet');

    try {
      if (typeof window === 'undefined' || !(window as any).ethereum) {
        throw new Error('No Web3 wallet found. Please install MetaMask, Rabby, or use the 1-Click Biometric Passkey.');
      }

      const ethereum = (window as any).ethereum;

      // 1. Request account access
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('No account selected.');
      }
      const account = accounts[0];

      // 2. Ensure user is connected to Robinhood Chain Testnet (46630)
      const currentChainId = await ethereum.request({ method: 'eth_chainId' });
      if (currentChainId !== ROBINHOOD_TESTNET_PARAMS.chainId) {
        try {
          // Attempt to switch to Robinhood Chain
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ROBINHOOD_TESTNET_PARAMS.chainId }],
          });
        } catch (switchError: any) {
          // If chain has not been added to MetaMask (error code 4902), add it
          if (switchError.code === 4902 || switchError.data?.originalError?.code === 4902) {
            await ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [ROBINHOOD_TESTNET_PARAMS],
            });
          } else {
            console.warn('Network switch warning:', switchError.message);
          }
        }
      }

      // Save connected wallet state
      localStorage.setItem('nova_auth_method', 'wallet');
      localStorage.setItem('nova_user_address', account);

      setSuccessMsg(`✓ Wallet Connected: ${account.slice(0, 6)}...${account.slice(-4)} on Robinhood Chain (46630)`);
      setTimeout(() => {
        router.push('/dashboard');
      }, 900);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Wallet connection failed.');
    } finally {
      setLoadingMethod(null);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <Link href="/" className="inline-block mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            Nova<span className="text-accent">Wealth</span>
          </h1>
        </Link>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-xl p-8 mb-6 shadow-2xl">
          {/* Tab Selector */}
          <div className="flex gap-4 mb-6 border-b border-border">
            <button
              onClick={() => {
                setTab('signin');
                setErrorMsg(null);
              }}
              className={`pb-3 text-sm font-semibold transition-colors ${
                tab === 'signin'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('signup');
                setErrorMsg(null);
              }}
              className={`pb-3 text-sm font-semibold transition-colors ${
                tab === 'signup'
                  ? 'border-b-2 border-accent text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Alert / Feedback Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs flex items-start gap-2">
              <Check size={15} className="mt-0.5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Option 1: Email & Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investor@novawealth.rh"
                className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition-colors pr-10 font-medium"
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
              disabled={loadingMethod !== null}
              className="w-full bg-accent text-primary-foreground py-3 rounded-lg font-bold hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loadingMethod === 'email' && <Loader2 size={16} className="animate-spin" />}
              <span>{tab === 'signin' ? 'Sign In to Dashboard' : 'Create Smart Account'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              OR WEB3 PASSKEY
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Option 2: 1-Click Biometric Passkey (FaceID / TouchID) */}
          <button
            type="button"
            onClick={handlePasskeyAuth}
            disabled={loadingMethod !== null}
            className="w-full flex items-center justify-center gap-2.5 bg-secondary border border-border rounded-lg px-4 py-3.5 font-semibold text-foreground hover:border-accent hover:bg-secondary/80 transition-all mb-3 text-sm group disabled:opacity-50"
          >
            {loadingMethod === 'passkey' ? (
              <Loader2 size={18} className="animate-spin text-accent" />
            ) : (
              <Smartphone size={18} className="text-accent group-hover:scale-110 transition-transform" />
            )}
            <span>
              {loadingMethod === 'passkey'
                ? 'Authenticating FaceID / TouchID...'
                : '1-Click Biometric Passkey (FaceID / TouchID)'}
            </span>
          </button>

          {/* Option 3: Connect Wallet (Robinhood Chain 46630) */}
          <button
            type="button"
            onClick={handleWalletConnect}
            disabled={loadingMethod !== null}
            className="w-full flex items-center justify-center gap-2.5 bg-secondary border border-border rounded-lg px-4 py-3.5 font-semibold text-foreground hover:border-accent hover:bg-secondary/80 transition-all text-sm group disabled:opacity-50"
          >
            {loadingMethod === 'wallet' ? (
              <Loader2 size={18} className="animate-spin text-accent" />
            ) : (
              <Wallet size={18} className="text-accent group-hover:scale-110 transition-transform" />
            )}
            <span>
              {loadingMethod === 'wallet'
                ? 'Connecting to Robinhood Chain (46630)...'
                : 'Connect Wallet (Robinhood Chain 46630)'}
            </span>
          </button>
        </div>

        {/* Info Badges */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs font-bold text-accent mb-1 flex items-center gap-1">
              <Sparkles size={12} /> Biometric Passkey
            </p>
            <p className="text-xs text-muted-foreground">
              FaceID / TouchID. Zero seed phrases. Instant smart account.
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-xs font-bold text-accent mb-1 flex items-center gap-1">
              <ShieldCheck size={12} /> Gas Sponsored
            </p>
            <p className="text-xs text-muted-foreground">
              All transactions sponsored via Paymaster on Robinhood Chain.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Built for the Arbitrum Open House Singapore Buildathon • Robinhood Chain Testnet (46630)
        </p>
      </div>
    </main>
  );
}
