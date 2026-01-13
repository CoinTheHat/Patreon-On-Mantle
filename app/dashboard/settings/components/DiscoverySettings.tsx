'use client';

import { useState, useEffect } from 'react';
import Card from '@/app/components/Card';
import { supabase } from '@/utils/supabase';

interface DiscoverySettingsProps {
    address: string;
}

export default function DiscoverySettings({ address }: DiscoverySettingsProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [hashtags, setHashtags] = useState<any[]>([]);
    const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
    const [selectedHashtagIds, setSelectedHashtagIds] = useState<string[]>([]);

    // UI State
    const [hashtagSearch, setHashtagSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (!address) return;

        const fetchAll = async () => {
            const [catsRes, tagsRes, myRes] = await Promise.all([
                fetch('/api/taxonomy/categories').then(r => r.json()),
                fetch('/api/taxonomy/hashtags').then(r => r.json()),
                fetch(`/api/creators/${address}/taxonomy`).then(r => r.json())
            ]);

            if (Array.isArray(catsRes)) setCategories(catsRes);
            if (Array.isArray(tagsRes)) setHashtags(tagsRes);

            if (myRes) {
                setSelectedCatIds(myRes.categoryIds || []);
                setSelectedHashtagIds(myRes.hashtagIds || []);
            }
        };

        fetchAll();
    }, [address]);

    const toggleCategory = (id: string) => {
        if (selectedCatIds.includes(id)) {
            setSelectedCatIds(prev => prev.filter(c => c !== id));
        } else {
            if (selectedCatIds.length >= 3) return alert('Max 3 categories allowed.');
            setSelectedCatIds(prev => [...prev, id]);
        }
    };

    const addHashtag = (tag: any) => {
        if (selectedHashtagIds.includes(tag.id)) return;
        if (selectedHashtagIds.length >= 10) return alert('Max 10 hashtags allowed.');
        setSelectedHashtagIds(prev => [...prev, tag.id]);
        setHashtagSearch('');
        setShowSuggestions(false);
    };

    const removeHashtag = (id: string) => {
        setSelectedHashtagIds(prev => prev.filter(h => h !== id));
    };

    const filteredHashtags = hashtags
        .filter(h => h.label.toLowerCase().includes(hashtagSearch.toLowerCase()))
        .filter(h => !selectedHashtagIds.includes(h.id))
        .slice(0, 5);

    const handleSave = async () => {
        try {
            const res = await fetch(`/api/creators/${address}/taxonomy`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryIds: selectedCatIds, hashtagIds: selectedHashtagIds })
            });
            if (res.ok) alert('Discovery settings saved!');
            else alert('Failed to save.');
        } catch (e) {
            console.error(e);
            alert('Error saving.');
        }
    };

    return (
        <Card variant="surface" padding="lg">
            <h3 className="text-h3 mb-6">Discovery</h3>
            <p className="text-gray-500 mb-6 text-sm">Help fans find you on the Explore page.</p>

            {/* Categories */}
            <div className="mb-8">
                <label className="block text-sm font-semibold uppercase mb-3">Categories (Max 3)</label>
                <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c.isActive).map(cat => {
                        const isSelected = selectedCatIds.includes(cat.id);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => toggleCategory(cat.id)}
                                className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${isSelected
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hashtags */}
            <div className="mb-8">
                <label className="block text-sm font-semibold uppercase mb-3">Hashtags (Max 10)</label>

                {/* Selected Chips */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedHashtagIds.map(id => {
                        const tag = hashtags.find(h => h.id === id);
                        return (
                            <span key={id} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-800">
                                #{tag?.label || id}
                                <button onClick={() => removeHashtag(id)} className="hover:text-red-500 ml-1">×</button>
                            </span>
                        );
                    })}
                </div>

                {/* Search Input */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search hashtags..."
                        value={hashtagSearch}
                        onChange={(e) => { setHashtagSearch(e.target.value); setShowSuggestions(true); }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && hashtagSearch && (
                        <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                            {filteredHashtags.length > 0 ? (
                                filteredHashtags.map(tag => (
                                    <button
                                        key={tag.id}
                                        onClick={() => addHashtag(tag)}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm flex justify-between"
                                    >
                                        <span>#{tag.label}</span>
                                        {tag.isTrending && <span className="text-xs text-orange-500">🔥 Trending</span>}
                                    </button>
                                ))
                            ) : (
                                <div className="p-3 text-sm text-gray-500">
                                    No tags found. <button className="text-blue-600 hover:underline">Create "{hashtagSearch}"?</button>
                                </div>
                            )}
                        </div>
                    )}
                    {/* Close suggestions on click outside logic would be here, skipping for simple implementation */}
                </div>
            </div>

            <button
                onClick={handleSave}
                className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
                Save Discovery Settings
            </button>
        </Card>
    );
}
