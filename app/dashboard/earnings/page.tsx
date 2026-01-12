'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import SectionHeader from '../../components/SectionHeader';
import { useAccount, useReadContract, useWriteContract, useBalance, usePublicClient } from 'wagmi';
import { formatEther, parseAbiItem } from 'viem';
import { FACTORY_ABI, SUBSCRIPTION_ABI, FACTORY_ADDRESS } from '@/utils/abis';
import { supabase } from '@/utils/supabase';

export default function EarningsPage() {
    const { address } = useAccount();
    const [withdrawOpen, setWithdrawOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [revenue, setRevenue] = useState('0.00');

    // 1. Get Creator's Contract Address
    const { data: contractAddress } = useReadContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI,
        functionName: 'getProfile',
        args: [address],
    });

    // 2. Get Contract Balance (Available to Withdraw)
    const { data: balanceData, refetch: refetchBalance } = useBalance({
        address: contractAddress as `0x${string}`,
    });

    const { writeContract, isPending } = useWriteContract();

    // 3. Fetch Revenue from DB
    useEffect(() => {
        const fetchRevenue = async () => {
            if (!address) return;
            const { data } = await supabase
                .from('subscriptions')
                .select('price')
                .eq('creatorAddress', address);

            if (data) {
                let total = 0;
                data.forEach(sub => {
                    const val = parseFloat(sub.price.split(' ')[0]);
                    if (!isNaN(val)) total += val;
                });
                setRevenue(total.toFixed(2));
            }
        };
        fetchRevenue();
    }, [address]);

    const publicClient = usePublicClient();
    const [payouts, setPayouts] = useState<any[]>([]);

    // 4. Fetch Payout History from Chain Events
    useEffect(() => {
        const fetchPayouts = async () => {
            if (!contractAddress || !publicClient) return;

            try {
                const logs = await publicClient.getLogs({
                    address: contractAddress as `0x${string}`,
                    event: parseAbiItem('event Withdrawn(uint256 amount)'),
                    fromBlock: 'earliest'
                });

                const history = await Promise.all(logs.map(async (log: any) => {
                    const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
                    return {
                        hash: log.transactionHash,
                        amount: formatEther(log.args.amount),
                        date: new Date(Number(block.timestamp) * 1000).toLocaleDateString(),
                        to: address
                    };
                }));

                setPayouts(history.reverse());
            } catch (e) {
                console.error("Error fetching payouts:", e);
            }
        };

        if (contractAddress) {
            fetchPayouts();
        }
    }, [contractAddress, publicClient, address, balanceData]);

    const handleWithdraw = () => {
        if (!contractAddress) return;
        writeContract({
            address: contractAddress as `0x${string}`,
            abi: SUBSCRIPTION_ABI,
            functionName: 'withdraw',
            args: [],
        }, {
            onSuccess: () => {
                setWithdrawOpen(false);
                setTimeout(() => {
                    refetchBalance();
                }, 5000);
            }
        });
    };

    const displayBalance = balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(2) : '0.00';
    const symbol = balanceData?.symbol || 'MNT';

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <SectionHeader
                title="Earnings"
                description="Track your revenue and manage withdrawals."
                action={{
                    label: 'Withdraw Balance',
                    onClick: () => setWithdrawOpen(true),
                    variant: displayBalance === '0.00' ? 'secondary' : 'primary'
                }}
            />

            {/* WITHDRAW MODAL */}
            {withdrawOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 100, backdropFilter: 'blur(4px)'
                }}>
                    <div className="card-surface" style={{ width: '100%', maxWidth: '440px', padding: '32px', position: 'relative', boxShadow: 'var(--shadow-lg)' }}>
                        <h2 className="text-h2" style={{ marginBottom: '8px' }}>Withdraw Funds</h2>
                        <p className="text-body-sm" style={{ marginBottom: '24px' }}>Transfer your available earnings to your wallet.</p>

                        <div style={{ marginBottom: '24px', background: 'var(--color-bg-page)', padding: '24px', borderRadius: 'var(--radius-lg)' }}>
                            <div className="text-caption" style={{ marginBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>Available Balance</div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)' }}>{displayBalance} {symbol}</div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <Button variant="ghost" onClick={() => setWithdrawOpen(false)}>Cancel</Button>
                            <Button onClick={handleWithdraw} disabled={isPending || displayBalance === '0.00'}>
                                {isPending ? 'Processing...' : 'Confirm Withdraw'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* STAT CARDS & CHART GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>

                {/* Available Balance Card */}
                <Card variant="surface" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <div className="text-caption" style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Available Balance</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{displayBalance} <span style={{ fontSize: '0.4em', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{symbol}</span></div>
                        </div>
                        <div style={{ width: '48px', height: '48px', background: 'var(--color-primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-primary)' }}>💰</div>
                    </div>
                    <div className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>Ready to withdraw</div>
                    {/* Decorative Blob */}
                    <div style={{ position: 'absolute', bottom: -20, right: -20, width: '100px', height: '100px', background: 'var(--color-primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(20px)' }}></div>
                </Card>

                {/* Lifetime Revenue */}
                <Card variant="surface" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <div className="text-caption" style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>Total Revenue</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, lineHeight: 1 }}>{revenue} <span style={{ fontSize: '0.4em', color: 'var(--color-text-secondary)', fontWeight: 600 }}>MNT</span></div>
                        </div>
                        <div style={{ width: '48px', height: '48px', background: 'var(--color-accent-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--color-accent)' }}>📈</div>
                    </div>
                    <div className="text-body-sm" style={{ color: 'var(--color-success)' }}>+12% this month</div>
                </Card>

                {/* 30 Day Chart Placeholder */}
                <Card variant="surface" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div className="text-caption" style={{ fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px' }}>Revenue (Last 30 Days)</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '4px', height: '60px' }}>
                        {[40, 60, 30, 80, 50, 90, 70, 40, 60, 80, 95, 100].map((h, i) => (
                            <div key={i} style={{ width: '8%', height: `${h}%`, background: i === 11 ? 'var(--color-primary)' : '#e4e4e7', borderRadius: '4px' }}></div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Info Callout */}
            <div style={{ marginBottom: '32px', padding: '16px 24px', background: '#F0FDFA', border: '1px solid #CCFBF1', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
                <div>
                    <h4 style={{ fontWeight: 700, color: '#115E59', fontSize: '0.9rem', marginBottom: '4px' }}>Transparent Payouts</h4>
                    <p style={{ color: '#134E4A', fontSize: '0.85rem', lineHeight: 1.5 }}>
                        Payouts are processed directly on the Mantle Network. Funds are sent to your wallet immediately upon withdrawal. Network gas fees are paid in MNT.
                    </p>
                </div>
            </div>

            {/* Payout History */}
            <h3 className="text-h3" style={{ marginBottom: '16px' }}>Payout History</h3>
            <Card padding="none" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                        <thead style={{ background: 'var(--color-bg-page)', borderBottom: '1px solid var(--color-border)' }}>
                            <tr>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Date</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Amount</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Status</th>
                                <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Transaction</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payouts.length > 0 ? payouts.map((p, i) => (
                                <tr key={i} className="hover:bg-gray-50" style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.1s' }}>
                                    <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{p.date}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 700 }}>{parseFloat(p.amount).toFixed(2)} MNT</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--color-success)', color: '#fff' }}>COMPLETED</span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <a href={`https://sepolia.mantlescan.xyz/tx/${p.hash}`} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: 500, textDecoration: 'none' }}>
                                            {p.hash.slice(0, 8)}...
                                            <span style={{ fontSize: '0.8rem' }}>↗</span>
                                        </a>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} style={{ padding: '48px', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                                        No withdrawals yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover\\:bg-gray-50:hover {
                    background-color: var(--color-bg-surface-hover) !important;
                }
            `}} />
        </div>
    );
}
