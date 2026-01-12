'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import ChatMockup from './components/ChatMockup';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#000', fontFamily: 'var(--font-family)', overflowX: 'hidden' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        :root { --padding-x: 24px; }
        @media (min-width: 1024px) { :root { --padding-x: 64px; } }
        
        .nav-container { padding: 24px var(--padding-x); }

        /* Typography */
        .headline-serif {
            font-family: var(--font-serif);
            font-weight: 400;
            letter-spacing: -0.02em;
        }

        /* Hero */
        .hero-section {
          background: linear-gradient(135deg, #7FA1F7 0%, #5865F2 100%);
          min-height: 90vh;
          padding: 120px var(--padding-x) 100px;
          position: relative;
          color: #fff;
          display: flex;
          align-items: center;
          overflow: visible;
        }

        .hero-title {
            font-size: clamp(2.5rem, 7vw, 5.5rem);
            line-height: 1.05;
            margin-bottom: 24px;
        }

        /* Phone App Mockup */
        .phone-mockup {
            width: 300px;
            height: 600px;
            background: #000;
            border-radius: 40px;
            border: 8px solid #333;
            position: relative;
            overflow: hidden;
            box-shadow: 0 30px 60px rgba(0,0,0,0.4);
            margin-left: auto;
            margin-right: auto;
        }
        .phone-screen {
            background: #111;
            color: #fff;
            height: 100%;
            padding: 24px;
            font-family: 'Inter', sans-serif;
        }

        /* Buttons */
        .btn-pill {
            padding: 16px 32px;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: transform 0.2s;
            border: none;
        }
        .btn-dark { background: #000; color: #fff; }
        .btn-dark:hover { transform: scale(1.05); background: #222; }
        .btn-light-outline { background: transparent; color: #000; border: 2px solid #000; }
        .btn-light-outline:hover { background: rgba(0,0,0,0.05); }

        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
        
        @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .collage-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .chat-section-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      {/* Navigation */}
      <nav className="nav-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="headline-serif" style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#000' }} onClick={() => router.push('/')}>
          Backr
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {isConnected ? (
            <button onClick={() => router.push('/dashboard')} className="btn-pill btn-dark" style={{ fontSize: '0.9rem', padding: '12px 24px' }}>Dashboard</button>
          ) : (
            <>
              <span style={{ cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }} onClick={() => router.push('/explore')}>Find Creators</span>
              <button onClick={() => router.push('/dashboard')} className="btn-pill btn-dark" style={{ fontSize: '0.9rem', padding: '12px 24px' }}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-grid" style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center', zIndex: 10 }}>

            {/* Left: Text Content */}
            <div>
              <h1 className="hero-title headline-serif">
                Turning passions into <span style={{ fontStyle: 'italic' }}>businesses</span>
              </h1>

              {/* Value Props */}
              <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>More ways to earn</h3>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.95 }}>
                    Build lasting revenue streams with memberships, exclusive content, and direct fan support.
                  </p>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>Unlock growth</h3>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.6', opacity: 0.95 }}>
                    Get powerful analytics, community tools, and tap into a growing creator ecosystem.
                  </p>
                </div>
              </div>

              <button className="btn-pill btn-dark" style={{ marginTop: '48px' }} onClick={() => router.push('/dashboard')}>
                Set up shop
              </button>
            </div>

            {/* Right: Phone Mockup */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ transform: 'rotate(-4deg)', animation: 'float 6s ease-in-out infinite' }}>
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.8rem', color: '#888' }}>
                      <span>9:41</span><span>●●●●</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
                      {['Membership', 'Shop', 'Earnings', 'Posts'].map((tab, i) => (
                        <div key={tab} style={{ fontSize: '0.85rem', color: i === 2 ? '#fbbf24' : '#888', fontWeight: i === 2 ? '700' : '400', cursor: 'pointer' }}>{tab}</div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <select style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <option>Past year</option>
                      </select>
                      <select style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }}>
                        <option>All earnings</option>
                      </select>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#10b981', marginBottom: '16px' }}>In progress earnings Sept 2023</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '32px' }}>$16,414.27</div>

                    <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '24px' }}>
                      {[30, 45, 35, 60, 50, 70, 65, 85].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: i === 7 ? '#fbbf24' : '#333', height: `${h}%`, borderRadius: '4px' }}></div>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px' }}>Monthly earnings details</div>
                    {['Sept 2023 $16,414.27', 'Aug 2023 $14,005.13', 'July 2023 $15,278.41'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #222', fontSize: '0.85rem' }}>
                        <span>{item.split(' $')[0]}</span>
                        <span>${item.split(' $')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLUE SECTION - Create What Excites You */}
        <section style={{ background: 'linear-gradient(180deg, #a8c0f7 0%, #7FA1F7 100%)', padding: '100px var(--padding-x)', color: '#000' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.3rem', lineHeight: '1.7', maxWidth: '800px', margin: '0 auto 48px' }}>
              Backr is your space to create what excites you most, rough or polished, big or small. Thousands of creators use Backr to share videos, podcasts, writing, art, music, and more with their most passionate fans.
            </p>
            <button className="btn-pill btn-dark" onClick={() => router.push('/dashboard')}>
              Create on your terms
            </button>
          </div>
        </section>

        {/* CREATORS. FANS. NOTHING IN BETWEEN. */}
        <section style={{ padding: '120px var(--padding-x)', background: 'linear-gradient(180deg, #7FA1F7 0%, #a8c0f7 100%)' }}>
          <div className="chat-section-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <h2 className="headline-serif" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: '1.05', marginBottom: '32px', color: '#000' }}>
                Creators. Fans.<br />Nothing in between.
              </h2>
              <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#111', marginBottom: '32px' }}>
                Backr gives you a direct line of access to your fan community, with no ads or gatekeepers in the way.
              </p>
              <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#111' }}>
                Through real-time group chats, comments, DMs, and even directly over email, you can connect more deeply and directly with your community here than anywhere else.
              </p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ChatMockup />
            </div>
          </div>
        </section>

        {/* TESTIMONIAL BANNER */}
        <section style={{ background: '#1f2937', color: '#fff', padding: '64px var(--padding-x)', textAlign: 'center' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <p style={{ fontSize: '1.5rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '24px' }}>
              "Backr provides a space for artists to sustain ourselves by connecting us directly to our own communities."
            </p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.8 }}>
              — Creator on Backr
            </p>
          </div>
        </section>

        {/* CREATOR COLLAGE - Creativity powered by fandom */}
        <section style={{ padding: '120px var(--padding-x)', background: 'linear-gradient(180deg, #d4dff9 0%, #a8c0f7 100%)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ position: 'relative', marginBottom: '80px' }}>
              <h2 className="headline-serif" style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: '1.05', color: '#8b5a3c', marginBottom: '80px' }}>
                Creativity<br />powered<br />by fandom
              </h2>

              {/* Creator Grid */}
              <div className="collage-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
                <div style={{ aspectRatio: '2/3', borderRadius: '16px', background: 'url(/images/home_visuals/art.png) center/cover', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}></div>
                <div style={{ aspectRatio: '2/3', borderRadius: '16px', background: 'url(/images/home_visuals/music.png) center/cover', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}></div>
                <div style={{ aspectRatio: '2/3', borderRadius: '16px', background: 'url(/images/home_visuals/podcast.png) center/cover', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}></div>
              </div>
            </div>

            <p style={{ fontSize: '1.4rem', lineHeight: '1.6', color: '#8b5a3c', maxWidth: '700px', fontWeight: '500' }}>
              Backr is the best place to build community with your biggest fans, share exclusive work, and turn your passion into a lasting creative business.
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ background: '#000', color: '#fff', padding: '80px var(--padding-x)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
            <div style={{ fontSize: '2rem' }} className="headline-serif">Backr</div>
            <div style={{ display: 'flex', gap: '32px', fontSize: '1rem', color: '#a1a1aa' }}>
              <span style={{ cursor: 'pointer', color: '#fff' }}>Start Creating</span>
              <span style={{ cursor: 'pointer' }}>Pricing</span>
              <span style={{ cursor: 'pointer' }}>Blog</span>
              <span style={{ cursor: 'pointer' }}>Privacy</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
