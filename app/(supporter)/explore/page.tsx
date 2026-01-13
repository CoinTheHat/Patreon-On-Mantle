'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '../../components/Button';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import EmptyState from '../../components/EmptyState';

function ExploreContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    const category = searchParams.get('cat') || '';

    const [creators, setCreators] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('Trending');

    const categories = ['All', 'Podcasters', 'Video Creators', 'Musicians', 'Visual Artists', 'Writers', 'Gaming', 'Education'];
    const trendingTags = ['#DeFi', '#GenerativeArt', '#IndieDev', '#PodcastLife', '#Web3Gaming'];

    useEffect(() => {
        // Simulation of API Latency
        const timer = setTimeout(() => {
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
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const filteredCreators = creators.filter(c => {
        const matchesQuery = !query ||
            c.name?.toLowerCase().includes(query) ||
            c.description?.toLowerCase().includes(query) ||
            c.address?.toLowerCase().includes(query);

        const matchesCategory = !category || category === 'All';
        return matchesQuery && matchesCategory;
    });

    const sortedCreators = [...filteredCreators].sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0; // Random/Trending
    });

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg-page)' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .explore-grid { 
                    display: grid; 
                    grid-template-columns: 1fr; 
                    gap: 24px; 
                }
                @media (min-width: 640px) { .explore-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; } }
                @media (min-width: 1024px) { .explore-grid { grid-template-columns: repeat(3, 1fr); } }
                
                .tag-chip {
                    font-size: 0.85rem; padding: 6px 14px; background: rgba(255,255,255,0.6);
                    border: 1px solid rgba(0,0,0,0.05); border-radius: 20px; color: var(--color-text-secondary);
                    cursor: pointer; transition: all 0.2s; white-space: nowrap;
                }
                .tag-chip:hover { background: #fff; transform: translateY(-1px); color: var(--color-brand-blue); }
                
                .category-scroll {
                    display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;
                    scrollbar-width: none; -ms-overflow-style: none;
                }
                .category-scroll::-webkit-scrollbar { display: none; }
                
                @media (min-width: 1024px) {
                    .category-scroll { flex-wrap: wrap; overflow-x: visible; }
                }

                .filter-pill {
                    padding: 8px 16px; border-radius: 99px; border: 1px solid var(--color-border);
                    background: var(--color-bg-surface); cursor: pointer; font-size: 0.9rem; font-weight: 500;
                    color: var(--color-text-secondary); transition: all 0.2s; white-space: nowrap;
                }
                .filter-pill:hover { border-color: var(--color-primary); color: var(--color-primary); }
                .filter-pill.active { background: var(--color-primary); color: #fff; border-color: var(--color-primary); }
            `}} />

            {/* HERO SECTION */}
            <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                padding: '48px 0 64px',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                marginBottom: '-32px'
            }}>
                <div className="page-container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                    <h1 className="headline-serif" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '24px', lineHeight: 1.1 }}>
                        Discover <span style={{ color: 'var(--color-brand-blue)' }}>creators</span> & communities.
                    </h1>

                    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto 16px' }}>
                        <input
                            type="text"
                            placeholder="Search creators, tags, content..."
                            defaultValue={query}
                            className="focus-ring"
                            onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/explore?q=${e.currentTarget.value}`) }}
                            style={{
                                width: '100%', padding: '16px 24px 16px 52px', borderRadius: 'var(--radius-full)',
                                border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', fontSize: '1.05rem',
                                outline: 'none'
                            }}
                        />
                        <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', opacity: 0.5 }}>🔍</span>
                    </div>

                    {/* Trending Tags */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>Trending:</span>
                        {trendingTags.map(tag => (
                            <button key={tag} className="tag-chip" onClick={() => router.push(`/explore?q=${tag.replace('#', '')}`)}>
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="page-container" style={{ paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
                {/* FILTER TOOLBAR */}
                <div className="card-surface" style={{ padding: '16px 24px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap-reverse', gap: '16px' }}>
                        {/* Categories */}
                        <div className="category-scroll" style={{ flex: 1, minWidth: '0' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat} onClick={() => router.push(cat === 'All' ? '/explore' : `/explore?cat=${cat}`)}
                                    className={`filter-pill ${(!category && cat === 'All') || category === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Tools */}
                        <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                            <select
                                value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: '8px 16px', borderRadius: '99px', border: '1px solid var(--color-border)',
                                    cursor: 'pointer', outline: 'none', background: 'var(--color-bg-surface)', fontSize: '0.9rem', fontWeight: 500
                                }}
                            >
                                <option>Trending</option>
                                <option>Newest</option>
                                <option>Most Backed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* RESULTS GRID */}
                {loading ? (
                    <div className="explore-grid">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="card-surface" style={{ height: '380px', padding: 0, overflow: 'hidden' }}>
                                <LoadingSkeleton height="120px" borderRadius={0} />
                                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-40px' }}>
                                    <LoadingSkeleton variant="circle" width="80px" height="80px" style={{ border: '4px solid #fff' }} />
                                    <LoadingSkeleton variant="text" width="60%" height="24px" style={{ marginTop: '12px' }} />
                                    <LoadingSkeleton variant="text" width="80%" height="16px" style={{ marginTop: '8px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredCreators.length === 0 ? (
                    <EmptyState
                        title="No creators found"
                        description={`We couldn't find any match for "${query}". Try searching for something else.`}
                        actionLabel="Clear Filters"
                        onAction={() => router.push('/explore')}
                    />
                ) : (
                    <>
                        <div className="explore-grid" style={{ marginBottom: '64px' }}>
                            {sortedCreators.map((creator, i) => (
                                <div
                                    key={i}
                                    className="card-surface hover-lift"
                                    onClick={() => router.push(`/${creator.address}`)}
                                    style={{
                                        padding: 0, overflow: 'hidden', cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', position: 'relative'
                                    }}
                                >
                                    {/* Cover */}
                                    <div style={{ height: '120px', background: creator.coverUrl ? `url(${creator.coverUrl}) center/cover` : `linear-gradient(120deg, var(--color-primary-light) 0%, #fff 100%)` }}></div>

                                    {/* Content */}
                                    <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                                        {/* Avatar */}
                                        <div style={{
                                            marginTop: '-40px', width: '80px', height: '80px', borderRadius: '50%',
                                            background: creator.avatarUrl ? `url(${creator.avatarUrl}) center/cover` : '#fff',
                                            border: '4px solid var(--color-bg-surface)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem'
                                        }}>
                                            {!creator.avatarUrl && (creator.name?.[0] || '👤')}
                                        </div>

                                        <h3 className="text-h3" style={{ marginTop: '12px', marginBottom: '4px' }}>{creator.name}</h3>
                                        <p className="text-caption" style={{ marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {creator.description || 'Digital creator building on Mantle.'}
                                        </p>

                                        {/* Stats */}
                                        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', width: '100%', justifyContent: 'center' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{Math.floor(Math.random() * 500) + 10}</div>
                                                <div className="text-caption" style={{ fontSize: '0.7rem' }}>Backrs</div>
                                            </div>
                                            <div style={{ width: '1px', background: 'var(--color-border)', height: '100%' }}></div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{Math.floor(Math.random() * 50) + 1}</div>
                                                <div className="text-caption" style={{ fontSize: '0.7rem' }}>Posts</div>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: 'auto', width: '100%' }}>
                                            <Button variant="primary" style={{ width: '100%', justifyContent: 'center' }}>View Page</Button>
                                            <div className="text-caption" style={{ marginTop: '8px', fontSize: '0.75rem' }}>
                                                Tiers from <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>5 MNT</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recommended Fallback Block */}
                        <div style={{
                            borderTop: '1px solid var(--color-border)',
                            paddingTop: '48px',
                            display: 'flex', flexDirection: 'column', gap: '24px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 className="text-h2">New on Backr</h2>
                                <Button variant="ghost" size="sm">View All</Button>
                            </div>
                            {/* Simple horizontal list or mini-grid */}
                            <div className="grid-system">
                                {['0x123', '0x456', '0x789'].map(addr => (
                                    <div key={addr} style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eee' }}></div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>New Creator</div>
                                            <div className="text-caption">Joined Today</div>
                                        </div>
                                        <Button size="sm" variant="secondary" style={{ marginLeft: 'auto' }}>Follow</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>}>
            <ExploreContent />
        </Suspense>
    );
}
