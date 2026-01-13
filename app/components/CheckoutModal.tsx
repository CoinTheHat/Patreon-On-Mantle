'use client';

import { useState, useEffect } from 'react';
import Button from './Button';
import { createPortal } from 'react-dom';

type CheckoutStatus = 'idle' | 'pending' | 'success' | 'error';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tier: {
        name: string;
        price: string;
        benefits?: string[];
    } | null;
    status: CheckoutStatus;
    txHash?: string;
}

export default function CheckoutModal({ isOpen, onClose, onConfirm, tier, status, txHash }: CheckoutModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen || !tier) return null;

    const modalContent = (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            {/* Backdrop */}
            <div
                onClick={status === 'pending' || status === 'success' ? undefined : onClose}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            />

            {/* Modal Card */}
            <div style={{
                position: 'relative',
                width: '100%', maxWidth: '480px',
                background: '#fff',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex', flexDirection: 'column'
            }}>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}} />

                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'var(--color-bg-surface)'
                }}>
                    <h3 className="text-h3" style={{ margin: 0, fontSize: '1.25rem' }}>
                        {status === 'success' ? 'Membership Active' : 'Complete Purchase'}
                    </h3>
                    {(status === 'idle' || status === 'error') && (
                        <button
                            onClick={onClose}
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '1.5rem', lineHeight: 1, color: 'var(--color-text-tertiary)'
                            }}
                        >
                            &times;
                        </button>
                    )}
                </div>

                {/* Body */}
                <div style={{ padding: '32px 24px' }}>

                    {status === 'idle' && (
                        <>
                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>You are joining</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{tier.name}</div>
                            </div>

                            <div style={{
                                background: 'var(--color-bg-page)',
                                padding: '20px',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: '24px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 600 }}>Total Due</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{tier.price} MNT</span>
                            </div>

                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '24px', textAlign: 'center' }}>
                                By confirming, you agree to the terms of service. This represents a recurring subscription.
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={onConfirm}
                                    style={{ flex: 2 }}
                                >
                                    Confirm Payment
                                </Button>
                            </div>
                        </>
                    )}

                    {status === 'pending' && (
                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{
                                width: '64px', height: '64px',
                                border: '4px solid var(--color-border)',
                                borderTopColor: 'var(--color-brand-blue)',
                                borderRadius: '50%',
                                margin: '0 auto 24px',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Processing Transaction</h4>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Please confirm the transaction in your wallet.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div style={{ textAlign: 'center', padding: '10px 0' }}>
                            <div style={{
                                width: '80px', height: '80px',
                                background: 'var(--color-success)',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                                color: '#fff', fontSize: '3rem'
                            }}>
                                ✓
                            </div>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>Welcome aboard!</h4>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
                                You successfully joined the <strong>{tier.name}</strong> tier. You now have access to exclusive content.
                            </p>
                            <Button variant="primary" onClick={onClose} style={{ width: '100%' }}>
                                Start Exploring
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div style={{ textAlign: 'center', padding: '10px 0' }}>
                            <div style={{
                                width: '64px', height: '64px',
                                background: '#fee2e2',
                                borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 24px',
                                color: '#ef4444', fontSize: '2rem', fontWeight: 700
                            }}>
                                !
                            </div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px', color: '#ef4444' }}>Transaction Failed</h4>
                            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '32px' }}>
                                Something went wrong with the transaction. Please try again.
                            </p>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    style={{ flex: 1 }}
                                >
                                    Close
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={onConfirm}
                                    style={{ flex: 1 }}
                                >
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
