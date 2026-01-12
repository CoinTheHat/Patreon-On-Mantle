'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

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
            font-weight: 400; /* Editorial style */
            letter-spacing: -0.02em;
        }

        /* Hero */
        .hero-section {
          background: linear-gradient(135deg, #7FA1F7 0%, #5865F2 100%); /* Brand Blue Gradient */
          min-height: 90vh;
          padding: 120px var(--padding-x) 100px;
          position: relative;
          color: #fff;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .hero-title {
            font-size: clamp(3.5rem, 8vw, 6.5rem);
            line-height: 0.95;
            margin-bottom: 32px;
        }

        /* Floating Images Collage */
        .collage-img {
            position: absolute;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            transition: transform 0.3s ease;
            object-fit: cover;
            z-index: 1;
        }
        .collage-img:hover { z-index: 10; transform: scale(1.05); }

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
        .btn-light { background: #fff; color: #000; }
        .btn-light:hover { transform: scale(1.05); background: #f0f0f0; }

        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
      `}} />

      {/* Navigation - Transparent on Blue */}
      <nav className="nav-container" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="headline-serif" style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', color: '#000' }} onClick={() => router.push('/')}>
          Backr
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span className="headline-serif" style={{ cursor: 'pointer', color: '#000', fontSize: '1.1rem' }} onClick={() => router.push('/explore')}>Find Creators</span>
          {isConnected ? (
            <button onClick={() => router.push('/dashboard')} className="btn-pill btn-dark" style={{ fontSize: '0.9rem', padding: '12px 24px' }}>Dashboard</button>
          ) : (
            <button onClick={() => router.push('/dashboard')} className="btn-pill btn-light" style={{ fontSize: '0.9rem', padding: '12px 24px', border: '1px solid #000' }}>Log In</button>
          )}
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="hero-section">
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center', zIndex: 10 }}>

            {/* Left: Text Content */}
            <div>
              <h1 className="hero-title headline-serif">
                Creativity<br />powered<br />by <span style={{ fontStyle: 'italic' }}>fandom</span>
              </h1>
              <p style={{ fontSize: '1.35rem', lineHeight: '1.6', maxWidth: '540px', marginBottom: '48px', opacity: 0.95 }}>
                Backr is the best place to build community with your biggest fans, share exclusive work, and turn your passion into a lasting creative business.
              </p>
              <button className="btn-pill btn-dark" onClick={() => router.push('/dashboard')}>
                Get Started
              </button>
            </div>

            {/* Right: Abstract Collage Visuals */}
            <div style={{ position: 'relative', height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Phone App Mockup centered */}
              <div style={{ position: 'relative', zIndex: 5, transform: 'rotate(-4deg)', animation: 'float 6s ease-in-out infinite' }}>
                <div className="phone-mockup">
                  <div className="phone-screen">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '0.8rem', color: '#888' }}>
                      <span>9:41</span><span>Signal</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Insights</h3>
                    <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '32px' }}>This Month</div>

                    <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '8px' }}>$16,414</div>
                    <div style={{ color: '#4ade80' }}>+12% vs last month</div>

                    <div style={{ marginTop: '48px', height: '120px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                      {[30, 45, 35, 60, 50, 70, 65, 85].map((h, i) => (
                        <div key={i} style={{ flex: 1, background: i === 7 ? '#fff' : '#333', height: `${h}%`, borderRadius: '4px' }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements around phone */}
              <img src="/images/home_visuals/music.png" className="collage-img" style={{ top: '10%', right: '0%', width: '180px', height: '240px', transform: 'rotate(6deg)' }} />
              <img src="/images/home_visuals/art.png" className="collage-img" style={{ bottom: '5%', left: '-10%', width: '200px', height: '200px', transform: 'rotate(-8deg)' }} />
              <img src="/images/home_visuals/podcast.png" className="collage-img" style={{ top: '0%', left: '0%', width: '160px', height: '160px', borderRadius: '50%', border: '4px solid #fff' }} />
            </div>
          </div>
        </section>

        {/* FEATURE HIGHLIGHTS */}
        <section style={{ padding: '120px var(--padding-x)', background: '#fff' }}>
          <h2 className="headline-serif" style={{ fontSize: '3.5rem', textAlign: 'center', marginBottom: '80px', color: '#000' }}>
            Complete creative control.
          </h2>

          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
            {[
              { title: 'Your newsletter', desc: 'Own your list. Reach every fan directly, no algorithms.', color: '#EF4444' },
              { title: 'Your rules', desc: 'Set your own prices, tiers, and benefits.', color: '#3B82F6' },
              { title: 'Your community', desc: 'A safe space for your biggest supporters to connect.', color: '#fbbf24' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '40px', background: '#f8fafc', borderRadius: '24px' }}>
                <div style={{ width: '60px', height: '60px', background: item.color, borderRadius: '50%', marginBottom: '24px' }}></div>
                <h3 className="headline-serif" style={{ fontSize: '2rem', marginBottom: '16px' }}>{item.title}</h3>
                <p style={{ fontSize: '1.1rem', color: '#52525b', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            ))}
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
