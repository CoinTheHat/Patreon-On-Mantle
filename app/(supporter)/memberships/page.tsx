'use client';

import Card from '../../components/Card';
import Button from '../../components/Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function MyMembershipsPage() {
    const router = useRouter();
    const { address } = useAccount();
    const [memberships, setMemberships] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!address) return;
        setLoading(true);
        fetch(`/api/subscriptions?subscriber=${address.toLowerCase()}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setMemberships(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [address]);

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>
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
                        Your memberships
                    </h1>
                    <p style={{ fontSize: '1.15rem', color: '#111' }}>
                        Creators you're currently supporting
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px' }}>
                {!address ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>Connect your wallet</h3>
                        <p style={{ color: '#52525b', marginBottom: '32px' }}>Sign in to view your active memberships</p>
                    </div>
                ) : loading ? (
                    <div style={{ textAlign: 'center', padding: '64px', color: '#52525b' }}>Loading...</div>
                ) : memberships.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: '#f9fafb', borderRadius: '24px', border: '2px dashed #e5e7eb' }}>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '16px', color: '#000' }}>No active memberships</h3>
                        <p style={{ color: '#52525b', marginBottom: '32px', fontSize: '1.05rem' }}>
                            Support your favorite creators to unlock exclusive content and join their communities.
                        </p>
                        <button
                            onClick={() => router.push('/explore')}
                            style={{
                                padding: '14px 32px',
                                borderRadius: '9999px',
                                background: '#5865F2',
                                color: '#fff',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '1.05rem'
                            }}
                        >
                            Discover Creators
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {memberships.map((sub, i) => (
                            <div
                                key={i}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '20px',
                                    padding: '28px 32px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.08)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '1.4rem'
                                    }}>
                                        {sub.creators?.name?.charAt(0).toUpperCase() || sub.creatorAddress.charAt(2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '6px', color: '#000' }}>
                                            {sub.creators?.name || `Creator ${sub.creatorAddress.slice(0, 6)}`}
                                        </h3>
                                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.95rem', color: '#9ca3af' }}>
                                            <span>Status: <span style={{ color: '#10b981', fontWeight: '600' }}>Active</span></span>
                                            <span>•</span>
                                            <span>Expires: {new Date(sub.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link href={`/${sub.creatorAddress}`} style={{ textDecoration: 'none' }}>
                                    <button style={{
                                        padding: '12px 28px',
                                        borderRadius: '9999px',
                                        background: '#f3f4f6',
                                        color: '#000',
                                        border: '1px solid #e5e7eb',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.95rem',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#5865F2';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = '#f3f4f6';
                                            e.currentTarget.style.color = '#000';
                                        }}
                                    >
                                        View Content
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
