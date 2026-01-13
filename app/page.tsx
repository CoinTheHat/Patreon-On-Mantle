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
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #dbeafe 0%, #eff6ff 100%)',
          paddingTop: '140px',
          paddingBottom: '80px',
          position: 'relative',
          overflow: 'hidden'
        }}>

          <div className="page-container" style={{ position: 'relative', height: '100%' }}>

            {/* Top Text */}
            <h1 className="headline-huge" style={{ fontSize: 'clamp(5rem, 11vw, 13rem)', color: '#4b3f35', marginBottom: '0' }}>
              Creativity
            </h1>

            <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '-20px' }}>
              {/* Middle Text - "powered" */}
              <div style={{ position: 'relative', zIndex: 2 }}>
                <h1 className="headline-huge" style={{
                  fontSize: 'clamp(5rem, 11vw, 13rem)',
                  color: '#4b3f35',
                  marginLeft: 'clamp(0px, 10vw, 150px)',
                  fontStyle: 'italic',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: '300'
                }}>
                  powered
                </h1>
              </div>

              {/* Creator Image 1 (Right side floating) */}
              <div className="creator-card-hover float-slow" style={{
                width: 'clamp(200px, 25vw, 350px)',
                aspectRatio: '3/4',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                transform: 'rotate(2deg)',
                marginTop: '40px'
              }}>
                <img src="/images/home_visuals/creator2.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Musician" />
              </div>
            </div>

            <div className="mobile-stack" style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
              {/* Creator Image 2 (Left side) */}
              <div className="creator-card-hover float-medium mobile-hide" style={{
                width: 'clamp(180px, 20vw, 280px)',
                aspectRatio: '4/5',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                transform: 'rotate(-3deg)',
                marginTop: '-100px',
                marginLeft: '50px'
              }}>
                <img src="/images/home_visuals/creator1.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Artist" />
              </div>

              {/* Bottom Text - "by fandom" */}
              <h1 className="headline-huge" style={{
                fontSize: 'clamp(5rem, 11vw, 13rem)',
                color: '#9ca3af',
                textAlign: 'right',
                width: '100%',
                marginTop: '20px'
              }}>
                by fandom
              </h1>
            </div>

            {/* Main CTA */}
            <div style={{ marginTop: 'var(--space-16)', textAlign: 'center' }}>
              <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 32px', lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>
                Patreon is the best place to build community with your biggest fans, share exclusive work, and turn your passion into a lasting creative business.
              </p>
              <button onClick={() => router.push('/dashboard')} style={{
                padding: '24px 64px',
                fontSize: '1.25rem',
                background: '#000',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                boxShadow: 'var(--shadow-lg)',
                transition: 'transform 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Get Started
              </button>
            </div>

          </div>
        </section>


        {/* SECTION 2: "Complete Creative Control" */}
        <section style={{ padding: 'var(--space-16) 0', background: '#fff', position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Centered Massive Text */}
          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
            <h2 className="headline-huge" style={{ fontSize: 'clamp(4rem, 9vw, 8rem)', color: '#000' }}>
              Complete<br />
              creative<br />
              control
            </h2>
          </div>

          {/* Orbiting Cards */}
          <div className="float-fast mobile-hide" style={{ position: 'absolute', top: '15%', left: '10%', width: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', transform: 'rotate(-5deg)' }}>
            <div style={{ background: '#000', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <span style={{ fontSize: '3rem' }}>▶</span>
            </div>
            <div style={{ padding: 'var(--space-md)', background: '#fff' }}>
              <div style={{ fontWeight: 'bold' }}>Exclusive: Behind the scenes</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Video • 12 mins</div>
            </div>
          </div>

          <div className="float-slow mobile-hide" style={{ position: 'absolute', bottom: '20%', right: '8%', width: '280px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', transform: 'rotate(3deg)' }}>
            <img src="/images/home_visuals/creator2.png" style={{ width: '100%', height: '280px', objectFit: 'cover' }} alt="Musician" />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', background: 'rgba(255,255,255,0.9)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>New Track Demo</div>
              <div style={{ width: '100%', height: '4px', background: '#ddd', marginTop: '8px', borderRadius: '2px' }}>
                <div style={{ width: '40%', height: '100%', background: '#000' }}></div>
              </div>
            </div>
          </div>

          <div className="float-medium mobile-hide" style={{ position: 'absolute', top: '10%', right: '15%', width: '240px', background: '#fdfbf7', padding: 'var(--space-lg)', borderRadius: '2px', boxShadow: 'var(--shadow-md)', transform: 'rotate(2deg)' }}>
            <div style={{ fontFamily: 'serif', fontSize: '1.5rem', lineHeight: '1.2', marginBottom: 'var(--space-3)' }}>
              "My Gold Tier members just unlocked this exclusive demo."
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Membership Perks →</div>
          </div>

        </section>


        {/* SECTION 3: "Creators. Fans. Nothing in between." */}
        <section style={{ background: '#5865F2', padding: 'var(--space-16) 0', color: '#fff' }}>
          <div className="page-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-16)', alignItems: 'center' }}>

            {/* Text Content */}
            <div>
              <h2 className="headline-huge" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', marginBottom: 'var(--space-8)' }}>
                Creators.<br />
                Fans.<br />
                Nothing in<br />
                between.
              </h2>
              <p style={{ fontSize: '1.5rem', lineHeight: '1.5', opacity: '0.9', maxWidth: '600px' }}>
                Patreon gives you a direct line of access to your fan community, with no ads or gatekeepers in the way.
              </p>
            </div>

            {/* Visual */}
            <div style={{ transform: 'scale(1.1) rotate(-2deg)' }}>
              <ExclusiveContentMockup />
            </div>

          </div>
        </section>


        {/* SECTION 4: "Turning passions into business" */}
        <section style={{ background: '#000', padding: 'var(--space-16) 0', color: '#fff', position: 'relative' }}>
          <div className="page-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>

            {/* Phone Visual */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '320px',
                height: '640px',
                background: '#1a1a1a',
                borderRadius: '40px',
                border: '8px solid #333',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '20px' }}>Dashboard</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>$16,414</div>
                  <div style={{ color: '#4ade80', fontSize: '0.9rem', marginBottom: '40px' }}>▲ 12% from last month</div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', height: '150px', gap: '8px', marginBottom: '40px' }}>
                    {[40, 60, 45, 70, 55, 80, 65, 90].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: i === 7 ? '#5865F2' : '#333', height: `${h}%`, borderRadius: '4px' }}></div>
                    ))}
                  </div>

                  <div style={{ background: '#333', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>Active Members</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>1,240</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div>
              <h2 className="headline-huge" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', marginBottom: 'var(--space-8)' }}>
                Turning<br /> passions into<br /> <span style={{ color: '#5865F2' }}>businesses</span>
              </h2>
              <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>Unlock growth</h3>
                  <p style={{ color: '#aaa', lineHeight: '1.6' }}>Get deep insights into who your fans are and what they love.</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>More ways to earn</h3>
                  <p style={{ color: '#aaa', lineHeight: '1.6' }}>From memberships to one-off shops, you set the rules.</p>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 5: "Your Rules" */}
        <section style={{ position: 'relative', padding: 'var(--space-16) 0', background: '#f3f4f6', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }} className="halftone-bg"></div>

          <div className="page-container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(4rem, 12vw, 15rem)',
              lineHeight: '0.85',
              color: '#000',
              textAlign: 'center'
            }}>
              Your<br />
              newsletter<br />
              <span style={{
                display: 'block',
                textAlign: 'right',
                fontStyle: 'italic',
                background: 'linear-gradient(45deg, #FF5E5E, #5865F2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Your rules
              </span>
            </div>
          </div>

          <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '300px', height: '300px', background: 'radial-gradient(circle, #ffaaaa 0%, transparent 70%)', opacity: 0.5, filter: 'blur(40px)' }}></div>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '400px', height: '400px', background: 'radial-gradient(circle, #aaaaff 0%, transparent 70%)', opacity: 0.5, filter: 'blur(40px)' }}></div>
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
