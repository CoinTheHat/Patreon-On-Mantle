'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Button from '../components/Button';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import RevenueChart from '../components/RevenueChart';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/utils/format';

export default function StudioOverview() {
    const { address } = useAccount();
    const router = useRouter();
    const [checklistVisible, setChecklistVisible] = useState(true);

    const [stats, setStats] = useState<{
        totalRevenue: number;
        activeMembers: number;
        monthlyRecurring: number;
        history: any[];
    }>({ totalRevenue: 0, activeMembers: 0, monthlyRecurring: 0, history: [] });

    useEffect(() => {
        if (!address) return;
        fetch(`/api/stats?address=${address}`)
            .then(res => res.json())
            .then(data => {
                if (data) setStats({
                    totalRevenue: data.totalRevenue || 0,
                    activeMembers: data.activeMembers || 0,
                    monthlyRecurring: data.monthlyRecurring || 0,
                    history: data.history || []
                });
            })
            .catch(err => console.error('Failed to fetch stats', err));
    }, [address]);

    const checklistItems = [
        { label: 'Connect Wallet', done: true },
        { label: 'Set Display Name', done: true },
        { label: 'Create First Tier', done: true },
        { label: 'Publish First Post', done: true },
    ];
    const progress = Math.round((checklistItems.filter(i => i.done).length / checklistItems.length) * 100);

    return (
        <div className="page-container" style={{ paddingBottom: '100px', maxWidth: '1280px', margin: '0 auto' }}>

            {/* 1. Header Section */}
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h1 className="text-h2" style={{ marginBottom: '4px' }}>Welcome back, Creator</h1>
                    <p className="text-body" style={{ color: 'var(--color-text-secondary)' }}>Here is what’s happening in your studio today.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="outline" onClick={() => router.push(`/${address || 'demo'}`)}>View Public Page</Button>
                    <Button variant="primary" onClick={() => router.push('/dashboard/posts')}>Create Post</Button>
                </div>
            </div>

            {/* 2. Setup Checklist (Compact & Dismissible) */}
            {checklistVisible && (
                <div style={{
                    marginBottom: '32px',
                    padding: '16px 24px',
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                            {progress}%
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '1rem' }}>Setup Complete!</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>You are ready to start earning.</div>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setChecklistVisible(false)}>Dismiss</Button>
                </div>
            )}

            {/* 3. KPI Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <Card variant="surface" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span className="text-caption" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Total Revenue</span>
                        <span style={{ fontSize: '1.25rem' }}>💰</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: '8px' }}>{formatPrice(stats.totalRevenue)}</div>
                    <div className="text-body-sm" style={{ color: 'var(--color-success)' }}>+0% from last month</div>
                </Card>

                <Card variant="surface" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span className="text-caption" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Active Members</span>
                        <span style={{ fontSize: '1.25rem' }}>👥</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: '8px' }}>{stats.activeMembers}</div>
                    <div className="text-body-sm" style={{ color: 'var(--color-success)' }}>+0 new this week</div>
                </Card>

                <Card variant="surface" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span className="text-caption" style={{ fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>Monthly Recurring</span>
                        <span style={{ fontSize: '1.25rem' }}>📅</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1, marginBottom: '8px' }}>{formatPrice(stats.monthlyRecurring)}</div>
                    <div className="text-body-sm" style={{ color: 'var(--color-text-tertiary)' }}>Estimated revenue</div>
                </Card>
            </div>

            {/* 4. Main Content Grid: Chart + Quick Actions */}
            <div className="dashboard-grid" style={{ marginBottom: '32px' }}>

                {/* Revenue Chart */}
                <Card variant="surface" style={{ padding: '24px', minHeight: '320px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 className="text-h3">Revenue Growth</h3>
                        <select className="focus-ring" style={{ fontSize: '0.875rem', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'var(--color-bg-page)' }}>
                            <option>Last 6 Months</option>
                        </select>
                    </div>

                    <div style={{ flex: 1, minHeight: '200px' }}>
                        <RevenueChart data={stats.history} />
                    </div>
                </Card>

                {/* Quick Actions List (Clean White Style) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 className="text-h3" style={{ marginBottom: '8px' }}>Quick Actions</h3>

                    {[
                        { icon: '📢', title: 'New Announcement', desc: 'Post an update', path: '/dashboard/posts' },
                        { icon: '💎', title: 'Create Tier', desc: 'Add a new plan', path: '/dashboard/membership' },
                        { icon: '⚙️', title: 'Settings', desc: 'Update profile', path: '/dashboard/settings' }
                    ].map((action, i) => (
                        <div
                            key={i}
                            onClick={() => router.push(action.path)}
                            className="quick-action-item"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                padding: '16px', background: 'var(--color-bg-surface)',
                                border: '1px solid transparent',
                                borderRadius: 'var(--radius-md)', cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--color-bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                {action.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{action.title}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{action.desc}</div>
                            </div>
                            <div style={{ color: 'var(--color-text-tertiary)' }}>→</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
