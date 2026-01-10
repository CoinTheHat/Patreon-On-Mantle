'use client';
import Button from "./components/Button";
import Card from "./components/Card";
import WalletButton from "./components/WalletButton";
import { useRouter } from "next/navigation";
import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  const handleGetStarted = () => {
    if (isConnected) {
      router.push('/dashboard');
    } else {
      connect({ connector: injected() });
      // In a real app, we'd wait for connection then redirect
    }
  };



  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <nav style={{ padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, #65b3ad, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kinship</h1>
          <div style={{ display: 'flex', gap: '24px', fontSize: '0.875rem', color: '#a1a1aa' }}>
            <span onClick={() => router.push('/explore')} style={{ cursor: 'pointer', color: '#a1a1aa' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = '#a1a1aa'}>Explore</span>
            <span onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer' }}>How it Works</span>
            <span style={{ cursor: 'pointer' }}>Creators</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {isConnected && (
            <Button variant="outline" onClick={() => router.push('/dashboard')}>Dashboard</Button>
          )}
          <WalletButton />
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', position: 'relative' }}>
        {/* Floating Background Orbs */}
        <div className="floating-orb" style={{ top: '10%', left: '15%', width: '300px', height: '300px', background: 'rgba(101, 179, 173, 0.3)' }}></div>
        <div className="floating-orb" style={{ bottom: '20%', right: '15%', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.2)', animationDelay: '-5s' }}></div>

        <div style={{ maxWidth: '800px', marginBottom: '80px', marginTop: '48px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Support Creators.<br />
            <span className="animate-text-gradient">Directly. On-Chain.</span>
          </h2>
          <p style={{ fontSize: '1.5rem', color: '#a1a1aa', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            The Web3 membership platform for communities that value transparency, ownership, and culture over speculation. Built on Mantle.
          </p>

          <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginBottom: '64px', alignItems: 'center' }}>
            <Button onClick={() => router.push('/explore')} style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
              Explore Creators
            </Button>
            <Button variant="secondary" onClick={() => router.push('/dashboard')} style={{ padding: '16px 32px', fontSize: '1.125rem' }}>
              Start Creating
            </Button>
          </div>
        </div>

        {/* How It Works Strip */}
        <div id="how-it-works" style={{ width: '100%', background: 'linear-gradient(180deg, rgba(26,29,36,0.8) 0%, rgba(101,179,173,0.05) 100%)', padding: '80px 0', marginBottom: '80px', borderTop: '1px solid #2e333d', borderBottom: '1px solid #2e333d', backdropFilter: 'blur(10px)' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '48px', color: '#fff' }}>How it Works</h2>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px', filter: 'drop-shadow(0 0 10px rgba(101,179,173,0.4))' }}>🛠️</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.25rem', color: '#fff' }}>Create Tier</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Define benefits, price & perks.</p>
              </div>
              <div style={{ fontSize: '2rem', color: '#65b3ad', opacity: 0.5 }}>→</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px', filter: 'drop-shadow(0 0 10px rgba(139,92,246,0.4))' }}>⛓️</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.25rem', color: '#fff' }}>Fans Join on Mantle</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Secure payment with MNT or USDC.</p>
              </div>
              <div style={{ fontSize: '2rem', color: '#65b3ad', opacity: 0.5 }}>→</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '3rem', marginBottom: '24px', filter: 'drop-shadow(0 0 10px rgba(101,179,173,0.4))' }}>🔓</div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '1.25rem', color: '#fff' }}>Content Unlocks</h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.875rem' }}>Instant access verified on-chain.</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', width: '100%' }}>
            <Card>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Transparent Fees</h3>
              <p style={{ color: '#a1a1aa' }}>Keep what you earn. We take a minimal protocol fee to sustain the platform.</p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Instant Withdrawals</h3>
              <p style={{ color: '#a1a1aa' }}>No net-30 payout terms. Validated memberships mean funds are yours immediately.</p>
            </Card>
            <Card>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '12px', color: '#fff' }}>Community Focused</h3>
              <p style={{ color: '#a1a1aa' }}>Built for creators who want to build a tribe, not just sell tokens.</p>
            </Card>
          </div>
        </div>
      </main>

      <footer style={{ padding: '48px', textAlign: 'center', color: '#52525b' }}>
        <p>&copy; 2026 Kinship. Built on Mantle Testnet.</p>
      </footer>
    </div>
  );
}
