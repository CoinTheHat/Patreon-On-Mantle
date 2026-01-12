'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import Button from '../../components/Button';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import Input from '../../components/Input';
import Dropdown from '../../components/Dropdown';
import { SUBSCRIPTION_ABI, FACTORY_ABI, FACTORY_ADDRESS } from '@/utils/abis';
import { parseEther } from 'viem';
import { useToast } from '../../components/Toast';

export default function MembershipPage() {
    const { address } = useAccount();
    const { showToast, ToastComponent } = useToast();
    const [tiers, setTiers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [contractAddress, setContractAddress] = useState<string | null>(null);

    // Editor Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTier, setEditingTier] = useState<any>(null);

    // Fallback: Read from Factory
    const { data: factoryProfile } = useReadContract({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: FACTORY_ABI, functionName: 'getProfile', args: [address],
    });

    const { data: hash, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    // Fetch Data
    useEffect(() => {
        if (!address) return;
        const fetchProfile = async () => {
            try {
                const res = await fetch(`/api/creators`);
                const creators = await res.json();
                const me = creators.find((c: any) => c.address === address);
                if (me?.contractAddress) setContractAddress(me.contractAddress);
                else if (factoryProfile && factoryProfile !== '0x0000000000000000000000000000000000000000') setContractAddress(factoryProfile as string);
            } catch (e) { console.error("Profile fetch error", e); }
        };
        fetchProfile();
        fetch(`/api/tiers?address=${address}`).then(res => res.json()).then(setTiers).finally(() => setLoading(false));
    }, [address, factoryProfile]);

    const handleCreate = () => {
        setEditingTier({ name: '', price: '', benefits: [], active: true, index: -1, recommended: false });
        setIsModalOpen(true);
    };

    const handleEdit = (tier: any, index: number) => {
        setEditingTier({ ...tier, index });
        setIsModalOpen(true);
    };

    const handleDuplicate = (tier: any) => {
        const duplicated = { ...tier, name: `${tier.name} (Copy)`, active: false };
        setEditingTier({ ...duplicated, index: -1 }); // Open modal as new creation
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (index: number) => {
        const newTiers = [...tiers];
        newTiers[index].active = !newTiers[index].active;
        setTiers(newTiers);
        await saveTiersToBackend(newTiers);
    };

    const handleDelete = async (index: number) => {
        if (!confirm('Are you sure you want to delete this tier? This cannot be undone.')) return;
        const newTiers = tiers.filter((_, i) => i !== index);
        setTiers(newTiers);
        await saveTiersToBackend(newTiers);
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === tiers.length - 1) return;
        const newTiers = [...tiers];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        [newTiers[index], newTiers[targetIndex]] = [newTiers[targetIndex], newTiers[index]];
        setTiers(newTiers);
        await saveTiersToBackend(newTiers);
    };

    const saveTiersToBackend = async (newTiers: any[]) => {
        try {
            await fetch('/api/tiers', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address, tiers: newTiers })
            });
        } catch (e) { console.error("Failed to save", e); showToast('Failed to save changes', 'error'); }
    };

    const onSaveModal = async () => {
        if (!address) return;
        if (!editingTier.name || !editingTier.price) { alert("Name and Price are required"); return; }

        const tierToSave = {
            name: editingTier.name, price: editingTier.price, duration: editingTier.duration || '30',
            benefits: editingTier.benefits.filter((b: string) => b.trim() !== ''),
            active: editingTier.active, recommended: editingTier.recommended
        };

        // Chain Logic (Simplified for Demo)
        if (tierToSave.active && editingTier.index === -1 && contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000') {
            try {
                writeContract({
                    address: contractAddress as `0x${string}`, abi: SUBSCRIPTION_ABI, functionName: 'createTier',
                    args: [tierToSave.name, parseEther(tierToSave.price.toString()), BigInt(tierToSave.duration) * BigInt(86400)]
                });
            } catch (e) { console.error("Chain fail", e); }
        }

        let newTiers = [...tiers];
        if (editingTier.index === -1) newTiers.push(tierToSave);
        else newTiers[editingTier.index] = tierToSave;

        setTiers(newTiers);
        await saveTiersToBackend(newTiers);
        setIsModalOpen(false);
    };

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            {ToastComponent}
            <SectionHeader
                title="Membership Tiers"
                description="Design your product offering. Tiers are displayed on your public page."
                action={{ label: 'Create Tier', onClick: handleCreate, icon: '＋' }}
            />

            {loading ? (
                <div style={{ textAlign: 'center', padding: '64px', color: 'var(--color-text-tertiary)' }}>Loading tiers...</div>
            ) : tiers.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '64px 24px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '24px' }}>💎</div>
                    <h3 className="text-h3" style={{ marginBottom: '12px' }}>Create your first tier</h3>
                    <p className="text-body" style={{ color: 'var(--color-text-secondary)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                        Start earning by offering exclusive content. Simple tiers like "Supporter" (5 MNT) work best to start.
                    </p>
                    <Button onClick={handleCreate}>Create Tier</Button>
                </Card>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {tiers.map((tier, index) => (
                        <Card key={index} padding="none" style={{ display: 'flex', flexDirection: 'column', height: '100%', opacity: tier.active ? 1 : 0.7, border: tier.recommended ? '2px solid var(--color-primary)' : '1px solid var(--color-border)' }}>
                            {/* Header */}
                            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', background: tier.recommended ? 'rgba(var(--color-primary-rgb), 0.05)' : 'transparent', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                    <div>
                                        <h3 className="text-h3" style={{ fontSize: '1.25rem' }}>{tier.name}</h3>
                                        <div className="text-caption" style={{ marginTop: '4px' }}>
                                            {/* Simulated member count - in real app would come from subgraph/API */}
                                            Needs Data API for Count
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{tier.price} MNT</span>
                                        {tier.recommended && <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#fff', background: 'var(--color-primary)', padding: '2px 6px', borderRadius: '4px' }}>Recommended</span>}
                                        {!tier.active && <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#fff', background: 'var(--color-text-tertiary)', padding: '2px 6px', borderRadius: '4px' }}>Inactive</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '16px', letterSpacing: '0.05em' }}>Benefits</div>

                                {tier.benefits && tier.benefits.length > 0 ? (
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {tier.benefits.map((b: string, i: number) => (
                                            <li key={i} style={{ display: 'flex', alignItems: 'start', gap: '12px', fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                                                <span style={{ color: 'var(--color-success)', fontWeight: 'bold', fontSize: '1rem' }}>✓</span> {b}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', border: '1px dashed var(--color-border)', borderRadius: '8px', background: 'var(--color-bg-page)' }}>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>No specific benefits</div>
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(tier, index)}>+ Add Benefits</Button>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'var(--color-bg-page)' }}>
                                <Button variant="secondary" size="sm" onClick={() => handleEdit(tier, index)} style={{ flex: 1 }}>Edit</Button>

                                <Dropdown trigger={<Button variant="ghost" size="sm" style={{ height: '32px', width: '32px', padding: 0 }}>•••</Button>}>
                                    <div className="dropdown-menu">
                                        <button onClick={() => handleDuplicate(tier)}>Duplicate</button>
                                        <button onClick={() => handleToggleStatus(index)}>{tier.active ? 'Disable' : 'Enable'}</button>
                                        <div className="divider"></div>
                                        <button onClick={() => handleDelete(index)} className="danger">Delete</button>
                                        <div className="divider"></div>
                                        <div style={{ padding: '4px 12px', fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>ORDER</div>
                                        <button onClick={() => handleMove(index, 'up')} disabled={index === 0}>Move Up</button>
                                        <button onClick={() => handleMove(index, 'down')} disabled={index === tiers.length - 1}>Move Down</button>
                                    </div>
                                </Dropdown>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* MODAL */}
            {isModalOpen && editingTier && (
                <div className="modal-overlay">
                    <div className="modal-content card-surface">
                        <h2 className="text-h2" style={{ marginBottom: '24px' }}>{editingTier.index === -1 ? 'Create Plan' : 'Edit Plan'}</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                            <Card padding="md" style={{ background: 'var(--color-bg-page)', border: 'none' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-tertiary)', marginBottom: '16px', textTransform: 'uppercase' }}>Basic Info</div>
                                <Input label="Tier Name" value={editingTier.name} onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })} placeholder="e.g. Gold Tier" style={{ marginBottom: '16px' }} />
                                <Input label="Monthly Price (MNT)" type="number" value={editingTier.price} onChange={(e) => setEditingTier({ ...editingTier, price: e.target.value })} placeholder="0.0" />
                                <div style={{ marginTop: '16px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={editingTier.recommended} onChange={(e) => setEditingTier({ ...editingTier, recommended: e.target.checked })} />
                                        <span style={{ fontWeight: 500 }}>Mark as Recommended</span>
                                    </label>
                                </div>
                            </Card>

                            <Card padding="md" style={{ background: 'var(--color-bg-page)', border: 'none', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-tertiary)', marginBottom: '16px', textTransform: 'uppercase' }}>Status</div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
                                        <input type="checkbox" checked={editingTier.active} onChange={(e) => setEditingTier({ ...editingTier, active: e.target.checked })} />
                                        <span style={{ fontWeight: 500 }}>Active (Visible)</span>
                                    </label>
                                    <p className="text-caption">Inactive tiers are hidden from your public page but existing members keep access.</p>
                                </div>
                            </Card>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Benefits</label>
                                <span className="text-caption" style={{ color: 'var(--color-text-tertiary)' }}>Drag handle icon to reorder (Visual Only)</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                                {editingTier.benefits.map((benefit: string, i: number) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#fff', padding: '8px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                        <span style={{ cursor: 'grab', color: 'var(--color-text-tertiary)', padding: '0 4px' }}>⋮⋮</span>
                                        <input
                                            className="focus-ring"
                                            value={benefit}
                                            placeholder="e.g. Early access to videos"
                                            onChange={(e) => {
                                                const newBenefits = [...editingTier.benefits];
                                                newBenefits[i] = e.target.value;
                                                setEditingTier({ ...editingTier, benefits: newBenefits });
                                            }}
                                            style={{ flex: 1, border: 'none', fontSize: '0.95rem', outline: 'none' }}
                                        />
                                        <button onClick={() => {
                                            const newBenefits = editingTier.benefits.filter((_: any, idx: number) => idx !== i);
                                            setEditingTier({ ...editingTier, benefits: newBenefits });
                                        }} style={{ color: 'var(--color-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', padding: '0 8px' }}>×</button>
                                    </div>
                                ))}
                                <Button variant="secondary" size="sm" onClick={() => setEditingTier({ ...editingTier, benefits: [...editingTier.benefits, ''] })} style={{ alignSelf: 'start' }}>+ Add Benefit</Button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '24px', borderTop: '1px solid var(--color-border)' }}>
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                            <Button variant="primary" onClick={onSaveModal}>{editingTier.index === -1 ? 'Create Tier' : 'Save Changes'}</Button>
                        </div>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 16px; }
                .modal-content { width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; padding: 32px; animation: slideUp 0.2s ease-out; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .dropdown-menu { display: flex; flex-direction: column; padding: 8px; min-width: 160px; }
                .dropdown-menu button { text-align: left; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: 4px; color: var(--color-text-primary); font-size: 0.875rem; transition: background 0.1s; }
                .dropdown-menu button:hover:not(:disabled) { background: var(--color-bg-page); }
                .dropdown-menu button:disabled { opacity: 0.5; cursor: not-allowed; }
                .dropdown-menu .divider { height: 1px; background: var(--color-border); margin: 4px 0; }
                .dropdown-menu button.danger { color: var(--color-error); }
                .dropdown-menu button.danger:hover { background: #fee2e2; }
            `}} />
        </div>
    );
}
