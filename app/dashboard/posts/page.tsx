'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import Input from '../../components/Input';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
    const { address } = useAccount();
    const router = useRouter();

    // Editor State
    const [title, setTitle] = useState('');
    const [teaser, setTeaser] = useState('');
    const [content, setContent] = useState('');
    const [postImage, setPostImage] = useState('');
    const [visibility, setVisibility] = useState<'members' | 'public'>('members');
    const [minTier, setMinTier] = useState<number>(0);
    const [status, setStatus] = useState<'draft' | 'published'>('draft');

    // Stepper State
    const blocks = ['Basics', 'Access', 'Content', 'Review'];
    const [activeBlock, setActiveBlock] = useState(0);

    // App State
    const [saving, setSaving] = useState(false);
    const [creatorTiers, setCreatorTiers] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, published, draft

    // Load Data
    useEffect(() => {
        if (!address) return;

        // Fetch tiers
        fetch(`/api/tiers?address=${address}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCreatorTiers(data);
            });

        fetchPosts();
    }, [address]);

    const fetchPosts = async () => {
        if (!address) return;
        const res = await fetch(`/api/posts?creator=${address}`);
        const data = await res.json();
        if (Array.isArray(data)) setPosts(data);
    };

    const handleSave = async (newStatus: 'draft' | 'published') => {
        if (!title || !address) {
            alert('Post title is required');
            return;
        }
        if (newStatus === 'published' && !content) {
            alert('Cannot publish empty content');
            return;
        }

        setSaving(true);
        const method = editingPostId ? 'PUT' : 'POST';
        const body: any = {
            creatorAddress: address,
            title,
            content,
            teaser,
            image: postImage,
            isPublic: visibility === 'public',
            minTier: visibility === 'public' ? 0 : minTier,
            status: newStatus,
            createdAt: new Date().toISOString()
        };

        if (editingPostId) body.id = editingPostId;

        try {
            await fetch('/api/posts', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            await fetchPosts();

            // Reset form if published
            if (newStatus === 'published') {
                resetForm();
                alert('Post published successfully!');
            } else {
                // Keep form for drafting but update ID if new
                // In a real app we'd get the ID back from API
            }
        } catch (e) {
            console.error(e);
            alert('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setTeaser('');
        setPostImage('');
        setEditingPostId(null);
        setStatus('draft');
        setVisibility('members');
        setMinTier(0);
        setActiveBlock(0);
    };

    const handleEdit = (post: any) => {
        setEditingPostId(post.id);
        setTitle(post.title);
        setContent(post.content);
        setTeaser(post.teaser || '');
        setPostImage(post.image || '');
        setVisibility(post.isPublic ? 'public' : 'members');
        setMinTier(post.minTier || 0);
        setStatus(post.status || 'published');

        // Scroll to editor
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (postId: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        // Simulating delete
        const remaining = posts.filter(p => p.id !== postId);
        setPosts(remaining);
        // In real app: DELETE /api/posts/id
    };

    // Derived
    const wordCount = content.trim().split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200); // 200 wpm
    const filteredPosts = posts.filter(post => {
        if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterStatus === 'published' && post.status === 'draft') return false;
        if (filterStatus === 'draft' && post.status !== 'draft') return false;
        return true;
    });

    return (
        <div className="page-container" style={{ paddingBottom: '120px' }}>
            <SectionHeader
                title={editingPostId ? "Edit Post" : "Creator Studio"}
                description="Create, manage, and publish your content."
            />

            {/* STEPPER NAV */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)', marginBottom: '32px', gap: '40px' }}>
                {blocks.map((block, i) => (
                    <div
                        key={i}
                        onClick={() => setActiveBlock(i)}
                        style={{
                            padding: '16px 0',
                            borderBottom: activeBlock === i ? '2px solid var(--color-primary)' : '2px solid transparent',
                            color: activeBlock === i ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{
                            width: '24px', height: '24px', borderRadius: '50%',
                            background: activeBlock === i ? 'var(--color-primary)' : 'var(--color-border)',
                            color: activeBlock === i ? '#fff' : 'var(--color-text-secondary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem'
                        }}>{i + 1}</span>
                        {block}
                    </div>
                ))}
            </div>

            <div className="editor-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 5fr) minmax(0, 3fr)', gap: '40px' }}>

                {/* LEFT: FORM BLOCKS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                    {/* BLOCK 1: BASICS */}
                    {activeBlock === 0 && (
                        <Card padding="lg">
                            <h3 className="text-h3" style={{ marginBottom: '24px' }}>Post Basics</h3>
                            <Input
                                label="Title"
                                placeholder="Give your post a catchy title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ fontSize: '1.2rem', padding: '16px' }}
                            />

                            <div style={{ marginTop: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Visibility</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div
                                        onClick={() => setVisibility('members')}
                                        className={`selection-card ${visibility === 'members' ? 'selected' : ''}`}
                                        style={{
                                            padding: '16px', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            background: visibility === 'members' ? 'var(--color-primary-light)' : 'var(--color-bg-page)'
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, marginBottom: '4px' }}>🔒 Members Only</div>
                                        <div className="text-caption">For paying subscribers</div>
                                    </div>
                                    <div
                                        onClick={() => setVisibility('public')}
                                        className={`selection-card ${visibility === 'public' ? 'selected' : ''}`}
                                        style={{
                                            padding: '16px', borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--color-border)',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            background: visibility === 'public' ? 'var(--color-primary-light)' : 'var(--color-bg-page)'
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, marginBottom: '4px' }}>🌍 Public</div>
                                        <div className="text-caption">Visible to everyone</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* BLOCK 2: ACCESS */}
                    {activeBlock === 1 && (
                        <Card padding="lg">
                            <h3 className="text-h3" style={{ marginBottom: '24px' }}>Who can access this?</h3>

                            {visibility === 'public' ? (
                                <div style={{ padding: '24px', background: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                                    <p>This post is currently set to <strong>Public</strong>. Everyone will be able to see it.</p>
                                    <Button variant="ghost" size="sm" onClick={() => { setVisibility('members'); setActiveBlock(0); }}>Change to Members Only</Button>
                                </div>
                            ) : (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600 }}>Minimum Tier Required</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div
                                            onClick={() => setMinTier(0)}
                                            style={{
                                                padding: '16px', borderRadius: 'var(--radius-md)',
                                                border: minTier === 0 ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
                                            }}
                                        >
                                            <input type="radio" checked={minTier === 0} readOnly />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>All Members</div>
                                                <div className="text-caption">Accessible to any subscriber</div>
                                            </div>
                                        </div>
                                        {creatorTiers.map((t, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setMinTier(i + 1)}
                                                style={{
                                                    padding: '16px', borderRadius: 'var(--radius-md)',
                                                    border: minTier === i + 1 ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px'
                                                }}
                                            >
                                                <input type="radio" checked={minTier === i + 1} readOnly />
                                                <div>
                                                    <div style={{ fontWeight: 600 }}>{t.name} +</div>
                                                    <div className="text-caption">{t.price} MNT/mo and higher</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* BLOCK 3: CONTENT */}
                    {activeBlock === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <Card padding="lg">
                                <h3 className="text-h3" style={{ marginBottom: '16px' }}>Teaser & Media</h3>
                                <div style={{ marginBottom: '24px' }}>
                                    <label className="text-caption" style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>COVER IMAGE</label>
                                    {postImage ? (
                                        <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', height: '200px' }}>
                                            <img src={postImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <Button size="sm" variant="danger" style={{ position: 'absolute', top: 12, right: 12 }} onClick={() => setPostImage('')}>Remove</Button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => {
                                                const url = prompt('Enter Image URL (Mock Upload)');
                                                if (url) setPostImage(url);
                                            }}
                                            style={{
                                                height: '120px', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-md)',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', color: 'var(--color-text-tertiary)', transition: 'all 0.2s'
                                            }}
                                            className="hover-border-primary"
                                        >
                                            <span style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🖼️</span>
                                            <span style={{ fontSize: '0.9rem' }}>Add Cover Image</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="text-caption" style={{ fontWeight: 600, marginBottom: '8px', display: 'block' }}>PUBLIC TEASER</label>
                                    <textarea
                                        placeholder="Write a hook visible to everyone..."
                                        value={teaser}
                                        onChange={(e) => setTeaser(e.target.value)}
                                        style={{
                                            width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                                            minHeight: '80px', fontFamily: 'inherit', resize: 'vertical'
                                        }}
                                    />
                                </div>
                            </Card>

                            <Card padding="none" style={{ overflow: 'hidden' }}>
                                {/* Toolbar Placeholder */}
                                <div style={{
                                    padding: '12px 16px', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-page)',
                                    display: 'flex', gap: '8px'
                                }}>
                                    {['B', 'I', 'U', '🔗', 'H1', 'H2', '❝'].map(tool => (
                                        <button key={tool} style={{
                                            width: '32px', height: '32px', border: '1px solid var(--color-border)', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontWeight: 600
                                        }}>{tool}</button>
                                    ))}
                                    <div style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--color-text-tertiary)', display: 'flex', alignItems: 'center' }}>
                                        {wordCount} words
                                    </div>
                                </div>
                                <textarea
                                    placeholder="Write your exclusive content here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    style={{
                                        width: '100%', padding: '24px', border: 'none', minHeight: '500px',
                                        fontFamily: 'inherit', fontSize: '1.1rem', lineHeight: '1.7', resize: 'vertical', outline: 'none'
                                    }}
                                />
                            </Card>
                        </div>
                    )}

                    {/* BLOCK 4: REVIEW */}
                    {activeBlock === 3 && (
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✨</div>
                            <h2 className="text-h2">Ready to Publish?</h2>
                            <p className="text-body" style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto 32px' }}>
                                Your post "{title}" will be {visibility === 'public' ? 'visible to everyone' : `locked for Tier ${minTier || 'All'} members`}.
                            </p>

                            <Button variant="primary" size="lg" onClick={() => handleSave('published')}>Publish Now</Button>
                        </div>
                    )}
                </div>

                {/* RIGHT: LIVE PREVIEW */}
                <div className="preview-column">
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Live Preview</h4>
                            <span style={{ fontSize: '0.8rem', color: title ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>● Saving...</span>
                        </div>

                        {/* Feed Card Preview */}
                        <div className="card-surface" style={{ overflow: 'hidden', padding: 0, opacity: title ? 1 : 0.6, transform: 'scale(0.98)', transformOrigin: 'top center' }}>
                            {postImage ? (
                                <div style={{ height: '200px', background: '#000' }}>
                                    <img src={postImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ) : (
                                <div style={{ height: '200px', background: 'var(--color-bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>No Cover Image</div>
                            )}
                            <div style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span className="text-caption">{new Date().toLocaleDateString()}</span>
                                    {visibility === 'members' && <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Locked 🔒</span>}
                                </div>
                                <h3 className="text-h3" style={{ marginBottom: '12px', fontSize: '1.25rem' }}>{title || "Untitled Post"}</h3>
                                <div className="text-body" style={{ color: 'var(--color-text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
                                    {teaser || content.substring(0, 100) || "Start writing to see a preview of your post content here..."}
                                </div>
                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', gap: '16px', opacity: 0.5 }}>
                                    <span>❤️ Like</span>
                                    <span>💬 Comment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* STICKY BOTTOM BAR */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                borderTop: '1px solid var(--color-border)',
                padding: '16px 24px', zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 -4px 10px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Button variant="ghost" onClick={() => router.push('/dashboard')}>Cancel</Button>
                    <div style={{ height: '24px', width: '1px', background: 'var(--color-border)' }}></div>
                    <span className="text-caption">
                        {activeBlock + 1} / {blocks.length}: {blocks[activeBlock]}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {activeBlock > 0 && (
                        <Button variant="outline" onClick={() => setActiveBlock(p => p - 1)}>Back</Button>
                    )}
                    {activeBlock < blocks.length - 1 ? (
                        <Button variant="primary" onClick={() => setActiveBlock(p => p + 1)}>Next: {blocks[activeBlock + 1]}</Button>
                    ) : (
                        <Button variant="primary" onClick={() => handleSave('published')} disabled={saving || !title}>Publish</Button>
                    )}
                    <Button variant="secondary" onClick={() => handleSave('draft')} disabled={saving}>Save Draft</Button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 900px) {
                    .editor-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .preview-column {
                        display: none;
                    }
                }
                .hover-border-primary:hover {
                    border-color: var(--color-primary) !important;
                }
                .selection-card.selected {
                    border-color: var(--color-primary) !important;
                    background: var(--color-primary-light) !important;
                }
            `}} />
        </div>
    );
}
