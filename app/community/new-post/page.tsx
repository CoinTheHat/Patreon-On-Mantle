'use client';

import { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Youtube, Globe, Lock, X } from 'lucide-react';
import Button from '../../components/Button';
import { useAccount } from 'wagmi';

export default function NewPostPage() {
    const { tiers, isDeployed, isLoading, refreshData } = useCommunity();
    const router = useRouter();
    const { address } = useAccount();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState(''); // For YouTube/Embeds

    // minTier: 0 means Public. 1 means Tier 1 (index 0). 2 means Tier 2 (index 1).
    // "All Members" usually means the lowest tier (Tier 1) and above.
    const [minTier, setMinTier] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Toggle for media inputs
    const [showImageInput, setShowImageInput] = useState(false);
    const [showVideoInput, setShowVideoInput] = useState(false);

    if (isLoading) return <div className="min-h-screen bg-brand-light flex items-center justify-center text-brand-muted">Loading studio...</div>;

    if (!isDeployed) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-studio p-8 shadow-studio text-center border border-gray-100">
                    <div className="text-5xl mb-6">🔒</div>
                    <h2 className="text-2xl font-serif font-bold text-brand-dark mb-3">Deployment Required</h2>
                    <p className="text-brand-muted mb-8 leading-relaxed">
                        You need a deployed contract to publish exclusive content to your members.
                    </p>
                    <Button
                        onClick={() => router.push('/dashboard/settings')}
                        variant="primary"
                        className="w-full justify-center py-3 shadow-lg shadow-brand-primary/20"
                    >
                        Deploy Contract
                    </Button>
                    <button onClick={() => router.back()} className="mt-4 text-sm text-brand-muted hover:text-brand-dark underline decoration-gray-300 underline-offset-4">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const handlePost = async () => {
        if (!title.trim() || !content.trim()) return alert('Please add a title and some content.');
        if (!address) return alert('Wallet not connected.');

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creatorAddress: address,
                    title,
                    content,
                    image: imageUrl,
                    videoUrl, // assuming API/DB supports checking this
                    minTier, // 0 = Public, 1 = Tier 1+, etc.
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    isPublic: minTier === 0
                })
            });

            if (res.ok) {
                await refreshData();
                router.push('/community');
            } else {
                throw new Error('Failed to create post');
            }
        } catch (e) {
            console.error(e);
            alert('Failed to publish post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-4 md:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <header className="mb-8 flex items-center justify-between">
                    <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-2 font-medium group transition-colors px-3 py-2 rounded-lg hover:bg-gray-200/50">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 hidden md:block">Create Post</h1>
                    <div className="w-10"></div> {/* Spacer */}
                </header>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                    {/* Main Editor Area */}
                    <div className="p-8">
                        {/* Title */}
                        <input
                            type="text"
                            placeholder="Post Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full text-4xl font-bold placeholder-gray-300 border-none focus:ring-0 p-0 mb-6 text-gray-900"
                            autoFocus
                        />

                        {/* Content */}
                        <textarea
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="w-full min-h-[180px] text-lg text-gray-700 leading-relaxed placeholder-gray-300 border-none focus:ring-0 p-0 resize-y mb-8"
                            placeholder="Share your latest update, exclusive content, or behind-the-scenes story..."
                        />

                        {/* Media Inputs (Conditional) */}
                        {(showImageInput || imageUrl) && (
                            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                        <ImageIcon size={14} /> Image URL
                                    </label>
                                    <button onClick={() => { setImageUrl(''); setShowImageInput(false); }} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                </div>
                                <input
                                    type="text"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                                {imageUrl && (
                                    <div className="mt-3 rounded-lg overflow-hidden h-40 bg-gray-200 relative group">
                                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    </div>
                                )}
                            </div>
                        )}

                        {(showVideoInput || videoUrl) && (
                            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold uppercase text-gray-500 tracking-wider flex items-center gap-2">
                                        <Youtube size={14} /> Video / Embed URL
                                    </label>
                                    <button onClick={() => { setVideoUrl(''); setShowVideoInput(false); }} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
                                </div>
                                <input
                                    type="text"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="YouTube, Vimeo, or Embed Link"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black transition-colors"
                                />
                            </div>
                        )}

                        {/* Toolbar */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowImageInput(!showImageInput)}
                                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${showImageInput ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <ImageIcon size={18} /> Add Image
                            </button>
                            <button
                                onClick={() => setShowVideoInput(!showVideoInput)}
                                className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${showVideoInput ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                <Youtube size={18} /> Embed Video
                            </button>
                        </div>
                    </div>

                    {/* Bottom Settings Bar */}
                    <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                            {/* Access Control */}
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Who can see this?</label>
                                <div className="flex flex-col gap-2">
                                    <div className="relative">
                                        <select
                                            value={minTier}
                                            onChange={(e) => setMinTier(Number(e.target.value))}
                                            className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-xl pl-10 pr-10 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-black/5 cursor-pointer shadow-sm"
                                        >
                                            <option value={0}>Public (Everyone)</option>
                                            {tiers.map((tier, index) => (
                                                <option key={tier.id} value={index + 1}>
                                                    {tier.name} ($ {tier.price}) & Higher
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            {minTier === 0 ? <Globe size={18} /> : <Lock size={18} />}
                                        </div>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            ▼
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 pl-1">
                                        {minTier === 0
                                            ? "Visible to everyone on the internet."
                                            : `Visible to members in ${tiers[minTier - 1]?.name} and higher tiers.`}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-end gap-3 self-end">
                                <Button onClick={() => router.back()} variant="ghost" className="text-gray-500 hover:text-gray-900 font-bold">Cancel</Button>
                                <Button
                                    onClick={handlePost}
                                    disabled={isSubmitting || !title || !content}
                                    className="px-8 py-3 rounded-xl shadow-lg shadow-brand-primary/20 flex items-center gap-2"
                                    variant="primary"
                                >
                                    {isSubmitting ? 'Publishing...' : 'Publish Post'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
