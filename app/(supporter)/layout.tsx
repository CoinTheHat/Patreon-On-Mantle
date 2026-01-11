'use client';

import { useRouter, usePathname } from 'next/navigation';
import Button from '../components/Button';
import WalletButton from '../components/WalletButton';
import { useAccount } from 'wagmi';

export default function SupporterLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isConnected } = useAccount();

    const navItems = [
        { label: 'Explore', path: '/explore' },
        { label: 'Feed', path: '/feed' },
        { label: 'My Memberships', path: '/memberships' },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0f1115', color: '#fff' }}>
            <nav style={{ padding: '0 24px', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#0f1115', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <h1
                        style={{ fontSize: '1.25rem', fontWeight: 'bold', background: 'linear-gradient(to right, #22d3ee, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', letterSpacing: '-0.02em' }}
                        onClick={() => router.push('/')}
                    >
                        Backr
                    </h1>

                    <div style={{ display: 'flex', gap: '24px' }}>
                        {navItems.map(item => (
                            <div
                                key={item.path}
                                onClick={() => router.push(item.path)}
                                style={{
                                    cursor: 'pointer',
                                    color: pathname === item.path ? '#fff' : '#a1a1aa',
                                    fontWeight: pathname === item.path ? '600' : '500',
                                    fontSize: '0.9rem',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    {isConnected && (
                        <Button variant="outline" onClick={() => router.push('/dashboard')} style={{ fontSize: '0.85rem', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>Create</Button>
                    )}
                    <WalletButton />
                </div>
            </nav>

            <main style={{ flex: 1, padding: '0', margin: '0 auto', width: '100%' }}>
                {children}
            </main>
        </div>
    );
}
