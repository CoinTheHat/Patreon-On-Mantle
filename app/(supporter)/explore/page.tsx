'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/Button';
import Card from '../../components/Card';

function ExploreContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('cat') || '';

    const [creators, setCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Podcasters', 'Video Creators', 'Musicians', 'Visual Artists', 'Writers', 'Gaming', 'Education'];

    useEffect(() => {
        fetch('/api/creators')
            .then(res => res.json())
            .then(data => {
                setCreators(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredCreators = creators.filter(c => {
        const matchesQuery = !query ||
            c.name?.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query) ||
            c.address?.toLowerCase().includes(query);

        const matchesCategory = !category || category === 'All';

        return matchesQuery && matchesCategory;
    });

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .headline-serif {
                    font-family: var(--font-serif);
                    font-weight: 400;
                    letter-spacing: -0.02em;
                }
                .creator-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                .creator-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }
            `}} />

            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #a8c0f7 0%, #7FA1F7 100%)',
                padding: '80px 24px 120px',
                marginBottom: '-60px'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                    <h1 className="headline-serif" style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        color: '#000',
                        marginBottom: '24px',
                        lineHeight: '1.1'
                    }}>
                        Discover amazing <span style={{ fontStyle: 'italic' }}>creators</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#111', maxWidth: '700px', margin: '0 auto 48px', lineHeight: '1.6' }}>
                        Support the artists, podcasters, writers, and creators who inspire you. Join their communities and unlock exclusive content.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 80px' }}>
                {/* Search & Filter Bar */}
                <div style={{ marginBottom: '48px', display: 'flex', gap: '16px', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
                    {/* Search */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                        <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
                        <input
                            type="text"
                            placeholder="Find a creator..."
                            defaultValue={query}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') router.push(`/explore?q=${e.currentTarget.value}`)
                            }}
                            style={{
                                width: '100%',
                                background: '#fff',
                                border: '2px solid #e5e7eb',
                                padding: '16px 20px 16px 56px',
                                borderRadius: '50px',
                                color: '#000',
                                fontSize: '1.05rem',
                                outline: 'none',
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}
                            onFocus={(e) => e.currentTarget.style.borderColor = '#5865F2'}
                            onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    {/* Categories */}
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => router.push(cat === 'All' ? '/explore' : `/explore?cat=${cat}`)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '9999px',
                                    background: (!category && cat === 'All') || category === cat ? '#5865F2' : '#f3f4f6',
                                    color: (!category && cat === 'All') || category === cat ? '#fff' : '#52525b',
                                    border: 'none',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{
                                background: '#fff',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div className="skeleton skeleton-card" style={{ height: '160px', borderRadius: 0 }} />
                                <div style={{ padding: '52px 24px 24px' }}>
                                    <div className="skeleton skeleton-text" style={{ width: '60%', marginBottom: '12px', height: '24px' }} />
                                    <div className="skeleton skeleton-text" style={{ width: '100%' }} />
                                    <div className="skeleton skeleton-text" style={{ width: '80%' }} />
                                    <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                                        <div className="skeleton skeleton-text" style={{ width: '50%', height: '14px' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredCreators.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb' }}>
                        <p style={{ fontSize: '1.2rem', color: '#52525b', marginBottom: '16px' }}>No creators found</p>
                        <p style={{ color: '#9ca3af' }}>Try a different search or category</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '24px', color: '#52525b', fontSize: '0.95rem' }}>
                            Found <strong>{filteredCreators.length}</strong> creator{filteredCreators.length !== 1 ? 's' : ''}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
                            {filteredCreators.map((creator, i) => (
                                <div
                                    key={i}
                                    className="creator-card"
                                    onClick={() => router.push(`/${creator.address}`)}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    {/* Cover Image */}
                                    <div style={{
                                        height: '160px',
                                        background: `linear-gradient(135deg, ${['#667eea', '#764ba2', '#f093fb', '#4facfe'][i % 4]} 0%, ${['#764ba2', '#f093fb', '#4facfe', '#00f2fe'][i % 4]} 100%)`,
                                        position: 'relative'
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-40px',
                                            left: '24px',
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: '#fff',
                                            border: '4px solid #fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}>
                                            {creator.name ? creator.name.charAt(0).toUpperCase() : '👤'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div style={{ padding: '52px 24px 24px' }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
                                            {creator.name || `Creator ${creator.address.slice(0, 6)}`}
                                        </h3>
                                        <p style={{ fontSize: '0.95rem', color: '#52525b', marginBottom: '20px', lineHeight: '1.5', minHeight: '60px' }}>
                                            {creator.description || 'Creating amazing content for the community'}
                                        </p>

                                        <div style={{
                                            display: 'flex',
                                            gap: '16px',
                                            paddingTop: '20px',
                                            borderTop: '1px solid #f3f4f6',
                                            fontSize: '0.9rem',
                                            color: '#71717a'
                                        }}>
                                            <span><strong style={{ color: '#000' }}>{Math.floor(Math.random() * 500) + 10}</strong> Backrs</span>
                                            <span>•</span>
                                            <span style={{ color: '#5865F2', fontWeight: '600' }}>Creating content</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center' }}>Loading...</div>}>
            <ExploreContent />
        </Suspense>
    );
}
