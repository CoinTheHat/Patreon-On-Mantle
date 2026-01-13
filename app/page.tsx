'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import ChatMockup from './components/ChatMockup';
import ExclusiveContentMockup from './components/ExclusiveContentMockup';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000', fontFamily: 'var(--font-family)', overflowX: 'hidden' }}>

      {/* Global Styles & Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
            --brand-blue: #5865F2;
            --brand-text: #1a1a1a;
        }
        
        @keyframes float { 
          0%, 100% { transform: translateY(0) rotate(0deg); } 
          50% { transform: translateY(-15px) rotate(1deg); } 
        }
        @keyframes drift {
            0% { transform: translate(0, 0); }
            50% { transform: translate(10px, -10px); }
            100% { transform: translate(0, 0); }
        }
        @keyframes pulse-soft {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.02); }
        }

        .float-slow { animation: float 8s ease-in-out infinite; }
        .float-medium { animation: float 6s ease-in-out infinite 1s; }
        .float-fast { animation: float 5s ease-in-out infinite 0.5s; }
        
        .headline-huge {
            font-family: var(--font-serif);
            font-weight: 400;
            line-height: 0.9;
            letter-spacing: -0.04em;
        }

        .nav-scrolled {
            background: rgba(255, 255, 255, 0.9) !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .creator-card-hover:hover {
            transform: scale(1.03) translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
            z-index: 10;
        }
        
        .halftone-bg {
            background-image: radial-gradient(circle, #000 1px, transparent 1px);
            background-size: 20px 20px;
            opacity: 0.1;
        }

        /* Mobile specific adjustments */
        @media (max-width: 768px) {
            .mobile-stack { flex-direction: column !important; }
            .mobile-hide { display: none !important; }
            .mobile-padding { padding: 40px 20px !important; }
            .headline-huge { font-size: 15vw !important; }
        }
      `}} />

      {/* ---------------------------------------------------------------------------
         NAVIGATION - Transparent to Sticky
         --------------------------------------------------------------------------- */}
      {/* Navigation */}
      <nav
        className={scrolled ? 'nav-scrolled' : ''}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: '20px 0',
          transition: 'all 0.3s ease',
          background: scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-border)' : 'none'
        }}>
        <div className="page-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            onClick={() => router.push('/')}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              color: 'var(--color-text-primary)'
            }}
          >
            Backr
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
            <span
              className="mobile-hide"
              onClick={() => router.push('/explore')}
              style={{
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.95rem',
                color: 'var(--color-text-primary)'
              }}>
              Find Creators
            </span>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-full)',
                background: '#000',
                color: '#fff',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: '0px' }}>

        {/* SECTION 1: HERO */}
        <section style={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
          paddingTop: '120px',
          paddingBottom: '80px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center'
        }}>
          {/* Mobile Layout Fix */}
          <style dangerouslySetInnerHTML={{
            __html: `
             @media (max-width: 1024px) {
                 .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
                 .hero-left { margin: 0 auto; alignItems: center !important; }
                 .hero-kpi { justify-content: center; }
                 .hero-collage { display: none !important; }
                 .mobile-cta-sticky { position: fixed; bottom: 20px; left: 20px; right: 20px; z-index: 1000; box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important; animation: slideUp 0.5s ease-out; }
             }
             @keyframes slideUp { from { transform: translateY(100px); } to { transform: translateY(0); } }
             `
          }} />

          <div className="page-container hero-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
            width: '100%'
          }}>

            {/* LEFT COLUMN */}
            <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', zIndex: 10 }}>
              {/* Trust Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                background: '#fff',
                border: '1px solid var(--color-border)',
                borderRadius: '100px',
                marginBottom: '32px',
                boxShadow: 'var(--shadow-sm)',
                fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)'
              }}>
                <span style={{ width: '8px', height: '8px', background: 'var(--color-brand-blue)', borderRadius: '50%' }}></span>
                Built on Mantle
              </div>

              {/* Headline */}
              <h1 className="headline-huge" style={{
                fontSize: 'clamp(3rem, 5vw, 4.5rem)',
                lineHeight: 1.1,
                marginBottom: '24px',
                color: '#111827',
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-serif)'
              }}>
                Unlock your <br />
                <span style={{ color: 'var(--color-brand-blue)' }}>creative potential</span>
              </h1>

              {/* Subheadline value prop */}
              <p style={{
                fontSize: '1.25rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '40px',
                maxWidth: '540px',
                lineHeight: 1.6
              }}>
                The all-in-one platform for creators to build community, share exclusive content, and earn directly from fans.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
                <button
                  className="mobile-cta-sticky"
                  onClick={() => router.push('/dashboard')}
                  style={{
                    padding: '16px 32px', borderRadius: 'var(--radius-full)', background: '#111827', color: '#fff',
                    fontSize: '1.05rem', fontWeight: 600, border: 'none', cursor: 'pointer',
                    boxShadow: 'var(--shadow-lg)', transition: 'transform 0.2s'
                  }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Create on Backr
                </button>
                <button onClick={() => router.push('/explore')} style={{
                  padding: '16px 32px', borderRadius: 'var(--radius-full)', background: '#fff', color: '#111827',
                  fontSize: '1.05rem', fontWeight: 600, border: '1px solid var(--color-border)', cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)', transition: 'transform 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Find Creators
                </button>
              </div>

              {/* KPIs (Chips) */}
              <div className="hero-kpi" style={{ display: 'flex', gap: '32px', borderTop: '1px solid var(--color-border)', paddingTop: '32px', width: '100%' }}>
                {[
                  { label: 'Creators', value: '10k+' },
                  { label: 'Supporters', value: '250k+' },
                  { label: 'Paid out', value: '$5M+' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN (Collage) */}
            <div className="hero-collage" style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Background Blob */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #dbeafe 0%, transparent 70%)', opacity: 0.6, zIndex: 0 }}></div>

              {/* Card 1: Creator Preview (Main) */}
              <div className="card-surface float-slow" style={{
                position: 'absolute', top: '10%', right: '10%', width: '320px', padding: '0', overflow: 'hidden', zIndex: 2
              }}>
                <div style={{ height: '320px', width: '100%', position: 'relative' }}>
                  <img src="/images/home_visuals/creator1.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Creator" />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#fff' }}>Sarah Artist</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>Digital Illustrator</div>
                  </div>
                </div>
              </div>

              {/* Card 2: Earnings (Overlapping Bottom Left) */}
              <div className="card-surface float-medium" style={{
                position: 'absolute', bottom: '20%', left: '0%', width: '280px', padding: '24px', zIndex: 3
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Monthly Revenue</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', marginBottom: '12px' }}>$4,250</div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '40px' }}>
                  {[40, 60, 35, 80, 55, 90, 70].map((h, i) => <div key={i} style={{ flex: 1, background: '#10b981', height: `${h}%`, borderRadius: '2px', opacity: 0.8 }}></div>)}
                </div>
              </div>

              {/* Card 3: Membership (Small Notification) */}
              <div className="card-surface float-fast" style={{
                position: 'absolute', top: '25%', left: '-10%', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1, borderRadius: '100px'
              }}>
                <div style={{ width: '32px', height: '32px', background: '#5865F2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>✨</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>New <strong>Gold Member</strong></div>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 2: HOW IT WORKS */}
        <section style={{ padding: '96px 0', background: '#fff' }}>
          <div className="page-container">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 className="text-h2" style={{ marginBottom: '16px', fontFamily: 'var(--font-serif)' }}>How it works</h2>
              <p className="text-body" style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Start building your membership business in three simple steps.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
              {[
                { icon: '🎨', title: 'Create your page', desc: 'Customize your creator profile, set up membership tiers, and define your brand.' },
                { icon: '🔒', title: 'Share exclusive content', desc: 'Post behind-the-scenes updates, early access work, and member-only media.' },
                { icon: '💸', title: 'Get paid instantly', desc: 'Receive support directly in crypto with low fees and instant settlements on Mantle.' }
              ].map((step, i) => (
                <div key={i} className="card-surface" style={{ padding: '32px', textAlign: 'left', border: 'none', background: 'var(--color-bg-page)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '24px' }}>{step.icon}</div>
                  <h3 className="text-h3" style={{ marginBottom: '12px' }}>{step.title}</h3>
                  <p className="text-body-sm">{step.desc}</p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '48px' }}>
              <a onClick={() => router.push('/dashboard')} style={{ color: 'var(--color-brand-blue)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                Start your page now →
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 3: FEATURES (Creative Control) */}
        <section style={{ padding: '96px 0', background: '#f9fafb', borderTop: '1px solid var(--color-border)' }}>
          <div className="page-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <div>
              <div style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-brand-blue)', marginBottom: '16px' }}>
                Ownership
              </div>
              <h2 className="headline-huge" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '24px', color: '#111827' }}>
                Complete<br />creative control
              </h2>
              <p className="text-body" style={{ fontSize: '1.25rem', marginBottom: '32px', color: 'var(--color-text-secondary)' }}>
                You own your content, your list, and your payments. No algorithms between you and your biggest fans.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Direct audience relationships', 'Own your email list', 'Censorship-resistant payments'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--color-success)', fontSize: '1.2rem' }}>✓</span>
                    <span style={{ fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              {/* Abstract Visual */}
              <div style={{
                background: '#fff', borderRadius: 'var(--radius-xl)', padding: '24px',
                boxShadow: 'var(--shadow-lg)', transform: 'rotate(2deg)',
                border: '1px solid var(--color-border)'
              }}>
                <ExclusiveContentMockup />
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: PRICING TEASER */}
        <section style={{ padding: '96px 0', background: '#111827', color: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 80% 20%, #2a2f45 0%, #111827 70%)' }}></div>

          <div className="page-container" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px', alignItems: 'center' }}>
            <div>
              <h2 className="text-h2" style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '24px' }}>
                Output more.<br />Keep more.
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#9ca3af', marginBottom: '32px', maxWidth: '450px' }}>
                We only earn when you do. Our flat platform fee ensures you keep the lion's share of your hard-earned revenue.
              </p>
              <button onClick={() => router.push('/dashboard')} style={{
                padding: '12px 24px', background: '#fff', color: '#000', borderRadius: 'var(--radius-full)', border: 'none', fontWeight: 600, cursor: 'pointer'
              }}>
                View Pricing Details
              </button>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '8px' }}>Platform Fee</div>
                  <div style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1 }}>5%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: '8px' }}>Gas Fees</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ade80' }}>&lt;$0.01</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>on Mantle</div>
                </div>
              </div>
              <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.5 }}>
                  Compare to traditional platforms taking 30%+ of your income. We leverage Layer 2 technology to maximize your profits.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: FAQ */}
        <section style={{ padding: '96px 0', background: '#fff' }}>
          <div className="page-container" style={{ maxWidth: '800px' }}>
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <h2 className="text-h2" style={{ fontFamily: 'var(--font-serif)' }}>Frequently Asked Questions</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { q: 'What do I need to get started?', a: 'Just a crypto wallet (like MetaMask) and your creativity. No credit card required.' },
                { q: 'How do I get paid?', a: 'Payments are streamed directly to your wallet in real-time. You can withdraw instantly.' },
                { q: 'Can I offer free memberships?', a: 'Yes! You can create a free tier to build your mailing list and community.' },
                { q: 'Is it secure?', a: 'We use audited smart contracts on the Mantle network. You own your data and funds at all times.' },
                { q: 'What are the platform fees?', a: 'We charge a flat 5% fee on earnings. No hidden costs, no monthly subscriptions for creators.' },
                { q: 'Can I export my supporter data?', a: 'Absolutely. You own your relationship with your fans. Export your data anytime.' }
              ].map((item, i) => (
                <details key={i} style={{
                  padding: '24px',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  background: 'var(--color-bg-surface)'
                }}>
                  <summary style={{ fontSize: '1.1rem', fontWeight: 600, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.q}
                    <span style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--color-text-secondary)' }}>+</span>
                  </summary>
                  <p style={{ marginTop: '16px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: NEWSLETTER */}
        <section style={{ padding: '120px 0', background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)', textAlign: 'center' }}>
          <div className="page-container" style={{ maxWidth: '600px' }}>
            <h2 className="headline-huge" style={{ fontSize: '3rem', marginBottom: '16px', color: '#000' }}>Stay in the loop</h2>
            <p style={{ fontSize: '1.125rem', marginBottom: '32px', color: '#333' }}>
              Get the latest updates on creator economy features and Mantle ecosystem growth.
            </p>

            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }} style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  style={{
                    flex: 1,
                    padding: '16px 24px',
                    borderRadius: 'var(--radius-full)',
                    border: '2px solid rgba(0,0,0,0.1)',
                    fontSize: '1rem'
                  }}
                />
                <button type="submit" style={{
                  padding: '16px 32px',
                  borderRadius: 'var(--radius-full)',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                  Subscribe
                </button>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#555', marginTop: '8px' }}>
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </section>


        {/* FOOTER */}
        <footer style={{ background: '#000', color: '#fff', padding: '80px 0' }}>
          <div className="page-container">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div className="headline-huge" style={{ fontSize: '3rem' }}>Backr</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', paddingTop: '40px', borderTop: '1px solid #333' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <strong style={{ marginBottom: '8px' }}>Product</strong>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Lite</a>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Pro</a>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Premium</a>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <strong style={{ marginBottom: '8px' }}>For Creators</strong>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Podcasters</a>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Video Creators</a>
                  <a href="#" style={{ color: '#aaa', textDecoration: 'none' }}>Musicians</a>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ color: '#666' }}>© 2024 Backr on Mantle.</p>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
