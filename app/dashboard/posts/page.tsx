'use client';

import { useState, useEffect } from 'react';
import Button from '../../components/Button';
import Card from '../../components/Card';
import SectionHeader from '../../components/SectionHeader';
import Input from '../../components/Input';
import { useAccount } from 'wagmi';

export default function PostsPage() {
    const { address } = useAccount();

    // Editor State
    const [title, setTitle] = useState('');
    const [teaser, setTeaser] = useState('');
    const [content, setContent] = useState('');
    const [postImage, setPostImage] = useState('');
    const [visibility, setVisibility] = useState<'members' | 'public'>('members');
    const [minTier, setMinTier] = useState<number>(0);
    const [status, setStatus] = useState<'draft' | 'published'>('draft'); // Front-end state for now

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
            status: newStatus, // Assuming backend might store this, or we just rely on isPublic logic for now. 
            // For this UI demo, we send it. If backend ignores, visual update might reset on reload unless backend is updated.
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

            // Reset form
            setTitle('');
            setContent('');
            setTeaser('');
            setPostImage('');
            setEditingPostId(null);
            setStatus('draft');
            setVisibility('members');
            setMinTier(0);

            // Scroll to list
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        } catch (e) {
            console.error(e);
            alert('Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (post: any) => {
        setEditingPostId(post.id);
        setTitle(post.title);
        setContent(post.content);
        setTeaser(post.teaser || '');
        setPostImage(post.image || '');
        setVisibility(post.isPublic ? 'public' : 'members');
        setMinTier(post.minTier || 0);
        setStatus(post.status || 'published'); // Use saved status or default
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (postId: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        // Mock delete or implement API endpoint
        // For now, assuming DELETE method on /api/posts or similar
        // Just filtering local to simulate
        // setPosts(posts.filter(p => p.id !== postId)); 
        // alert('Delete not fully implemented in this demo');
    };

    // Filter Logic
    const filteredPosts = posts.filter(post => {
        if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterStatus === 'published' && post.status === 'draft') return false;
        if (filterStatus === 'draft' && post.status !== 'draft') return false;
        return true;
    });

    return (
        <div className="page-container" style={{ paddingBottom: '100px' }}>
            <SectionHeader
                title={editingPostId ? "Edit Post" : "New Post"}
                description="Create content for your audience. Drafts are autosaved."
            />

            {/* EDITOR SECTION */}
            <div style={{ display: 'grid', gap: '32px', marginBottom: '48px' }}>

                {/* 1. Basics */}
                <Card padding="lg">
                    <h3 className="text-h3" style={{ marginBottom: '24px' }}>Basics</h3>
                    <div style={{ marginBottom: '24px' }}>
                        <Input
                            label="Post Title"
                            placeholder="e.g. Weekly Market Analysis - Jan 15"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ fontSize: '1.25rem', padding: '16px' }}
                        />
                    </div>

                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Visibility</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        <div
                            onClick={() => setVisibility('members')}
                            style={{
                                border: visibility === 'members' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                background: visibility === 'members' ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                                padding: '20px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                                display: 'flex', alignItems: 'flex-start', gap: '16px', transition: 'all 0.2s',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', background: '#fff', padding: '8px', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>🔒</div>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Members Only</div>
                                <div className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>Exclusive content for paying subscribers.</div>
                            </div>
                            {visibility === 'members' && <div style={{ position: 'absolute', top: 12, right: 12, color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</div>}
                        </div>

                        <div
                            onClick={() => setVisibility('public')}
                            style={{
                                border: visibility === 'public' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                background: visibility === 'public' ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                                padding: '20px', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                                display: 'flex', alignItems: 'flex-start', gap: '16px', transition: 'all 0.2s',
                                position: 'relative', overflow: 'hidden'
                            }}
                        >
                            <div style={{ fontSize: '1.5rem', background: '#fff', padding: '8px', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>🌍</div>
                            <div>
                                <div style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>Public</div>
                                <div className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>Visible to everyone. Tease your content.</div>
                            </div>
                            {visibility === 'public' && <div style={{ position: 'absolute', top: 12, right: 12, color: 'var(--color-primary)', fontWeight: 'bold' }}>✓</div>}
                        </div>
                    </div>
                </Card>

                {/* 2. Access */}
                {visibility === 'members' && (
                    <Card padding="lg">
                        <h3 className="text-h3" style={{ marginBottom: '24px' }}>Access</h3>
                        <div style={{ maxWidth: '400px' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Minimum Tier Required</label>
                            <select
                                value={minTier}
                                onChange={(e) => setMinTier(Number(e.target.value))}
                                className="focus-ring"
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-bg-surface)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '1rem'
                                }}
                            >
                                <option value={0}>All Tiers (Basic Subscription)</option>
                                {creatorTiers.map((t: any, i: number) => (
                                    <option key={i} value={i + 1}>{t.name} ({t.price} MNT+)</option>
                                ))}
                            </select>
                            <p className="text-body-sm" style={{ marginTop: '8px', color: 'var(--color-text-tertiary)' }}>
                                Only members on this tier or higher will be able to unlock the post.
                            </p>
                        </div>
                    </Card>
                )}

                {/* 3. Teaser & Media */}
                <Card padding="lg">
                    <h3 className="text-h3" style={{ marginBottom: '24px' }}>Teaser & Media</h3>
                    <div style={{ display: 'grid', gap: '24px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Public Teaser</label>
                            <textarea
                                className="focus-ring"
                                placeholder="Hook your audience with a short preview..."
                                value={teaser}
                                onChange={(e) => setTeaser(e.target.value)}
                                style={{
                                    width: '100%', minHeight: '80px', padding: '16px', borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)', background: 'var(--color-bg-page)',
                                    color: 'var(--color-text-primary)', fontFamily: 'inherit', resize: 'vertical'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Cover Image</label>
                            {postImage ? (
                                <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                                    <img src={postImage} alt="Cover" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '8px' }}>
                                        <Button variant="secondary" size="sm" onClick={() => {
                                            const url = prompt('Enter new Image URL');
                                            if (url) setPostImage(url);
                                        }}>Replace</Button>
                                        <Button variant="danger" size="sm" onClick={() => setPostImage('')}>Remove</Button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => {
                                        const url = prompt('Enter Image URL manually (Mock Upload)');
                                        if (url) setPostImage(url);
                                    }}
                                    style={{
                                        border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '48px',
                                        textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--color-bg-page)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                                >
                                    <div style={{ fontSize: '2.5rem', marginBottom: '16px', opacity: 0.5 }}>🖼️</div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Click to upload cover image</div>
                                    <div className="text-body-sm" style={{ color: 'var(--color-text-tertiary)' }}>SVG, PNG, JPG or GIF (max. 10MB)</div>
                                </div>
                            )}
                        </div>
                    </div>
                </Card>

                {/* 4. Content */}
                <Card padding="lg">
                    <h3 className="text-h3" style={{ marginBottom: '24px' }}>Content</h3>
                    <div>
                        <textarea
                            className="focus-ring"
                            placeholder="Write your exclusive content here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                width: '100%', minHeight: '400px', padding: '24px', borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)', background: '#fff',
                                color: 'var(--color-text-primary)', fontSize: '1.1rem', lineHeight: '1.7',
                                fontFamily: 'inherit', resize: 'vertical'
                            }}
                        />
                    </div>
                </Card>

            </div>

            {/* STICKY BOTTOM BAR */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
                borderTop: '1px solid var(--color-border)',
                padding: '16px 24px', zIndex: 100,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: saving ? 'var(--color-warning)' : 'var(--color-success)' }}></span>
                    <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {saving ? 'Saving...' : 'Changes saved locally'}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="secondary" onClick={() => handleSave('draft')} disabled={saving}>Save Draft</Button>
                    <Button variant="primary" onClick={() => handleSave('published')} disabled={saving}>
                        {editingPostId ? 'Update Post' : 'Publish Post'}
                    </Button>
                </div>
            </div>

            {/* YOUR POSTS LIST */}
            <div style={{ marginTop: '80px' }}>
                <SectionHeader
                    title="Your Posts"
                    description="Assess performance and manage your content library."
                />

                <Card padding="none">
                    {/* Controls */}
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <Input
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ margin: 0 }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {['all', 'published', 'draft'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '20px', border: 'none',
                                        background: filterStatus === s ? 'var(--color-text-primary)' : 'var(--color-bg-page)',
                                        color: filterStatus === s ? '#fff' : 'var(--color-text-secondary)',
                                        cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem'
                                    }}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table Rows */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredPosts.length === 0 ? (
                            <div style={{ padding: '64px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
                                <div>No posts found matching your filters.</div>
                            </div>
                        ) : (
                            filteredPosts.map((post) => (
                                <div key={post.id} style={{
                                    padding: '20px 24px',
                                    borderBottom: '1px solid var(--color-border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    transition: 'background 0.1s',
                                    gap: '16px'
                                }} className="hover:bg-gray-50">
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{post.title}</span>
                                            {/* Status Badges */}
                                            {post.status === 'draft' && (
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'var(--color-bg-page)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>DRAFT</span>
                                            )}
                                        </div>
                                        <div className="text-caption" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span>{new Date(post.createdAt || 0).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span>{post.isPublic ? '🌍 Public' : `🔒 Members (Tier ${post.minTier}+)`}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Button variant="secondary" size="sm" onClick={() => handleEdit(post)}>Edit</Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>🗑️</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Mobile padding fix for sticky bar */}
            <div style={{ height: '80px' }}></div>
        </div>
    );
}
