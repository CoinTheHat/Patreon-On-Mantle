'use client';

import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function FeedPage() {
    const router = useRouter();
    const { isConnected } = useAccount();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(sorted);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (!isConnected) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #a8c0f7 0%, #7FA1F7 100%)',
                    padding: '120px 24px',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        color: '#000',
                        marginBottom: '24px',
                        fontWeight: '400',
                        lineHeight: '1.1'
                    }}>
                        Your personal <span style={{ fontStyle: 'italic' }}>feed</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#111', maxWidth: '600px', margin: '0 auto 48px' }}>
                        Connect your wallet to see updates from your favorite creators.
                    </p>
                    <button
                        onClick={() => router.push('/explore')}
                        style={{
                            padding: '16px 32px',
                            borderRadius: '9999px',
                            background: '#000',
                            color: '#fff',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '1.05rem',
                            cursor: 'pointer'
                        }}
                    >
                        Explore Creators
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .post-card {
                    transition: all 0.2s ease;
                }
                .post-card:hover {
                    box-shadow: 0 10px 20px rgba(0,0,0,0.08);
                }
            `}} />

            {/* Hero */}
            <div style={{
                background: 'linear-gradient(135deg, #a8c0f7 0%, #7FA1F7 100%)',
                padding: '80px 24px 100px',
                marginBottom: '-40px'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                        color: '#000',
                        marginBottom: '16px',
                        fontWeight: '400',
                        lineHeight: '1.1'
                    }}>
                        Your feed
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#111' }}>
                        Fresh updates from creators you support
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '64px', color: '#52525b' }}>Loading feed...</div>
                ) : posts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>No posts yet</h3>
                        <p style={{ color: '#52525b', marginBottom: '32px' }}>Explore and support creators to see their content here.</p>
                        <button
                            onClick={() => router.push('/explore')}
                            style={{
                                padding: '14px 32px',
                                borderRadius: '9999px',
                                background: '#5865F2',
                                color: '#fff',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Discover Creators
                        </button>
                    </div>
                ) : (
                    posts.map((post: any, i) => (
                        <div
                            key={i}
                            className="post-card"
                            style={{
                                marginBottom: '24px',
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '20px',
                                padding: '32px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem'
                                }}>
                                    {post.creatorAddress?.charAt(2).toUpperCase() || '?'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#000', fontSize: '1.05rem' }}>
                                        Creator {post.creatorAddress?.slice(0, 6)}...
                                    </div>
                                    <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
                                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '16px', color: '#000', lineHeight: '1.3' }}>
                                {post.title}
                            </h3>

                            {post.isPublic ? (
                                <div style={{ color: '#52525b', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontSize: '1.05rem' }}>
                                    {post.content}
                                </div>
                            ) : (
                                <div style={{
                                    padding: '32px',
                                    background: 'linear-gradient(135deg, rgba(88,101,242,0.05) 0%, rgba(118,75,162,0.05) 100%)',
                                    border: '2px dashed #5865F2',
                                    borderRadius: '16px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#5865F2', fontWeight: '700', marginBottom: '12px', fontSize: '1.1rem' }}>
                                        🔒 Members Only Content
                                    </p>
                                    <p style={{ fontSize: '0.95rem', color: '#52525b', lineHeight: '1.6' }}>
                                        {post.teaser ? `"${post.teaser}"` : "Join this creator's community to unlock this post."}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
