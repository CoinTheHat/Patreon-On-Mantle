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

        // Mock filter logic for now
        const matchesCategory = !category || category === 'All';

        return matchesQuery && matchesCategory;
    });

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '24px' }}>Explore Creators</h1>

                {/* Search & Filter Bar */}
                <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
                        <input
                            type="text"
                            placeholder="Find a creator..."
                            defaultValue={query}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') router.push(`/explore?q=${e.currentTarget.value}`)
                            }}
                            style={{
                                width: '100%',
                                background: '#1a1d24',
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '12px 20px',
                                borderRadius: '24px',
                                color: '#fff',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Categories */}
                    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => router.push(`/explore?cat=${cat === 'All' ? '' : cat}`)}
                                style={{
                                    background: (category === cat || (!category && cat === 'All')) ? '#fff' : 'rgba(255,255,255,0.05)',
                                    color: (category === cat || (!category && cat === 'All')) ? '#000' : '#a1a1aa',
                                    border: 'none',
                                    padding: '8px 20px',
                                    borderRadius: '20px',
                                    whiteSpace: 'nowrap',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {filteredCreators.map((creator, i) => (
                    <div
                        key={i}
                        style={{ background: '#13151a', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'transform 0.2s', position: 'relative' }}
                        onClick={() => router.push(`/${creator.address}`)}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        {/* Cover Area */}
                        <div style={{ height: '120px', background: creator.coverUrl ? `url(${creator.coverUrl}) center/cover` : 'linear-gradient(to right, #2e333d, #1a1d24)' }}></div>

                        {/* Content */}
                        <div style={{ padding: '16px', position: 'relative' }}>
                            {/* Avatar overlapping */}
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: creator.avatarUrl ? `url(${creator.avatarUrl}) center/cover` : '#2e333d', border: '4px solid #13151a', position: 'absolute', top: '-32px', left: '16px' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                                <Button variant="outline" style={{ borderRadius: '16px', padding: '4px 12px', fontSize: '0.8rem' }}>View</Button>
                            </div>

                            <div style={{ marginTop: '8px' }}>
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '4px' }}>{creator.name}</h3>
                                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.5' }}>
                                    {creator.description || "Creating content on Backr."}
                                </p>
                            </div>

                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '16px', fontSize: '0.85rem', color: '#71717a' }}>
                                <span><strong>{Math.floor(Math.random() * 500) + 10}</strong> Patrons</span>
                                <span>Creating <strong>Video</strong></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCreators.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px', color: '#52525b' }}>
                    No creators found.
                </div>
            )}
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<div style={{ padding: '48px', textAlign: 'center', color: '#fff' }}>Loading search...</div>}>
            <ExploreContent />
        </Suspense>
    );
}
