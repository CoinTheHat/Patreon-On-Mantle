'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import Button from '../components/Button';
import Card from '../components/Card';
import SectionHeader from '../components/SectionHeader';
import WalletButton from '../components/WalletButton';
import { useRouter } from 'next/navigation';
import { FACTORY_ABI, FACTORY_ADDRESS } from '@/utils/abis';
import { Address } from 'viem';
import { useToast } from '../components/Toast';

export default function Dashboard() {
    const { address, isConnected } = useAccount();
    const router = useRouter();
    const { showToast, ToastComponent } = useToast();

    const { data: hash, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const [deployedAddress, setDeployedAddress] = useState<Address | null>(null);

    // Check if already deployed (read from Factory)
    const { data: existingProfile, refetch: refetchProfile } = useReadContract({
        address: FACTORY_ADDRESS as Address,
        abi: FACTORY_ABI,
        functionName: 'getProfile',
        args: [address],
    });

    const [stats, setStats] = useState({ activeMembers: 0, monthlyRevenue: '0.00', totalWithdrawals: '0.00' });
    const [isInitializing, setIsInitializing] = useState(false);

    // Fetch real stats
    useEffect(() => {
        if (!address) return;
        fetch(`/api/stats?creator=${address}`)
            .then(res => res.json())
            .then(data => {
                if (data && !data.error) setStats(data);
            })
            .catch(err => console.error(err));
    }, [address]);

    useEffect(() => {
        if (existingProfile && existingProfile !== '0x0000000000000000000000000000000000000000') {
            setDeployedAddress(existingProfile as Address);
        }
    }, [existingProfile]);

    const handleDeploy = async () => {
        writeContract({
            address: FACTORY_ADDRESS as Address,
            abi: FACTORY_ABI,
            functionName: 'createProfile',
            args: ['0x0000000000000000000000000000000000000000'] // native MNT payment
        });
    };

    // When confirmed, save to our DB
    useEffect(() => {
        if (isConfirmed && address && existingProfile) {
            // Trigger a refetch to update the UI specifically for the deployment step
            refetchProfile();

            // Save the deployed contract address to database
            const contractAddress = existingProfile as string;
            fetch('/api/creators', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    address,
                    name: `Creator ${address.slice(0, 6)}`,
                    contractAddress: contractAddress
                })
            });
        }
    }, [isConfirmed, address, existingProfile, refetchProfile]);

    // If connected but no profile, show onboarding "Become a Creator"
    // BUT user said "no email etc, just wallet".
    // So we just assume they are a creator if they are here?
    // Or we show a simple "Setup Profile" form if empty.

    // Check local DB for profile
    const [profile, setProfile] = useState<any>(null);
    const [hasTiers, setHasTiers] = useState(false);

    useEffect(() => {
        if (address) {
            fetch('/api/creators?includePending=true')
                .then(res => res.json())
                .then(creators => {
                    const found = creators.find((c: any) => c.address === address);
                    setProfile(found);
                });

            // Check for tiers
            fetch(`/api/tiers?address=${address}`)
                .then(res => res.json())
                .then(tiers => {
                    setHasTiers(tiers && tiers.length > 0);
                });
        }
    }, [address]);

    if (!isConnected) {
        return (
            <div style={{ padding: '48px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>Please Connect Wallet</h2>
                <WalletButton /> {/* Replaced generic button with WalletButton for consistency */}
            </div>
        );
    }

    if (!profile) {
        // Auto-create or Prompt
        // For MVP, lets just auto-initialize a profile in DB if not found, or show "Create Profile"
        return (
            <div style={{ maxWidth: '600px', margin: '48px auto', textAlign: 'center' }}>
                {ToastComponent}
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Welcome, Creator!</h1>
                <p style={{ color: '#a1a1aa', marginBottom: '32px' }}>Let's set up your profile to start receiving payments on Mantle.</p>
                <Card>
                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>Wallet Connected</p>
                        <p style={{ fontFamily: 'monospace', color: '#65b3ad' }}>{address}</p>
                    </div>
                    <Button
                        disabled={isInitializing}
                        onClick={async () => {
                            setIsInitializing(true);
                            try {
                                const res = await fetch('/api/creators', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ address, name: `Creator ${address?.slice(0, 6)}`, description: 'New Creator' })
                                });
                                if (res.ok) {
                                    window.location.reload();
                                } else {
                                    setIsInitializing(false);
                                    showToast('Failed to create profile.', 'error');
                                }
                            } catch (e) {
                                console.error(e);
                                setIsInitializing(false);
                                showToast('Error connecting to server. Please try again.', 'error');
                            }
                        }}
                        style={{ width: '100%', opacity: isInitializing ? 0.7 : 1 }}
                    >
                        {isInitializing ? 'Initializing...' : 'Initialize Dashboard'}
                    </Button>
                </Card>
            </div>
        );
    }

    // ... imports and logic same ...

    // Calculate progress
    const steps = [
        { label: "Create Profile", done: true }, // Always true if they are on this dashboard
        { label: "Deploy Contract", done: !!(profile?.contractAddress && profile.contractAddress.length > 0) },
        { label: "Create First Tier", done: hasTiers === true },
        { label: "Preview Public Page", done: !!(profile && profile.description && profile.description !== 'New Creator') }
    ];

    const completedSteps = steps.filter(s => s.done).length;
    const progress = (completedSteps / steps.length) * 100;

    return (
        <div className="page-container">
            <SectionHeader
                title="Overview"
                description="Welcome back! Here's what's happening with your page."
            />

            {/* Warning if no contract */}
            {!profile?.contractAddress && !isConfirming && (
                <div style={{ marginBottom: '32px', padding: '16px 24px', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 'var(--radius-md)', color: '#92400E', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                    <div>
                        <div style={{ fontWeight: 'bold' }}>Action Required</div>
                        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>You need to deploy your contract to start accepting memberships.</div>
                    </div>
                    <Button onClick={handleDeploy} size="sm" style={{ marginLeft: 'auto', background: '#F59E0B', color: '#fff', border: 'none' }}>Deploy Contract</Button>
                </div>
            )}

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                <Card padding="lg">
                    <div className="text-body-sm" style={{ marginBottom: '8px', fontWeight: 600 }}>Active Members</div>
                    <div className="text-h1" style={{ color: 'var(--color-text-primary)' }}>{stats.activeMembers}</div>
                </Card>
                <Card padding="lg">
                    <div className="text-body-sm" style={{ marginBottom: '8px', fontWeight: 600 }}>Monthly Income</div>
                    <div className="text-h1" style={{ color: 'var(--color-text-primary)' }}>${stats.monthlyRevenue}</div>
                </Card>
                <Card padding="lg">
                    <div className="text-body-sm" style={{ marginBottom: '8px', fontWeight: 600 }}>30-Day Growth</div>
                    <div className="text-h1" style={{ color: 'var(--color-success)' }}>+0%</div>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                {/* Main: Getting Started */}
                <div>
                    <h3 className="text-h3" style={{ marginBottom: '24px' }}>Getting Started</h3>
                    <Card padding="none" style={{ overflow: 'hidden' }}>
                        {steps.map((step, i) => (
                            <div key={i} style={{
                                padding: '20px 24px',
                                borderBottom: i < steps.length - 1 ? '1px solid var(--color-border)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                opacity: step.done ? 0.6 : 1,
                                background: step.done ? 'var(--color-bg-page)' : 'transparent'
                            }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    border: step.done ? 'none' : '2px solid var(--color-border)',
                                    background: step.done ? 'var(--color-success)' : 'transparent',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: '14px', fontWeight: 'bold'
                                }}>
                                    {step.done && '✓'}
                                </div>
                                <div style={{ flex: 1, fontWeight: step.done ? 'normal' : '600', textDecoration: step.done ? 'line-through' : 'none', color: 'var(--color-text-primary)' }}>{step.label}</div>
                                {!step.done && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (i === 1) handleDeploy();
                                            if (i === 2) router.push('/dashboard/membership');
                                            if (i === 3) router.push(`/${address}`);
                                        }}
                                        disabled={i === 1 && isConfirming}
                                    >
                                        {i === 1 && isConfirming ? 'Working...' : 'Start'}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </Card>
                </div>

                {/* Side: Quick Links */}
                <div>
                    <h3 className="text-h3" style={{ marginBottom: '24px' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button variant="secondary" onClick={() => router.push('/dashboard/posts')} style={{ justifyContent: 'flex-start', width: '100%' }}>📝 Write a Post</Button>
                        <Button variant="secondary" onClick={() => router.push('/dashboard/membership')} style={{ justifyContent: 'flex-start', width: '100%' }}>💎 Edit Tiers</Button>
                        <Button variant="secondary" onClick={() => router.push(`/${address}`)} style={{ justifyContent: 'flex-start', width: '100%' }}>👀 View Public Page</Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
