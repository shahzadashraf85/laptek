'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import {
    Save,
    X,
    Upload,
    Wand2,
    Loader2,
    ChevronLeft,
    Laptop,
    Monitor,
    Smartphone,
    HardDrive,
    Box,
    DollarSign,
    Cpu,
    MousePointer2,
    Sparkles,
    ImagePlus,
    TrendingUp,
    Search,
    Lightbulb,
    Zap,
    BarChart3,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import toast from 'react-hot-toast';

// ------------------------------------------------------------------
// 1. CONFIGURATION: Categories & Validations
// ------------------------------------------------------------------

type CategoryConfig = {
    id: string;
    name: string;
    code: string;
    icon: React.ReactNode;
    requiredFields: string[]; // Fields mandatory for this category
    allowedFields: string[]; // Fields visible for this category
};

const CATEGORIES: CategoryConfig[] = [
    {
        id: 'laptops',
        name: 'Laptops',
        code: 'Computers/Laptops',
        icon: <Laptop className="w-8 h-8" />,
        requiredFields: ['brand', 'model_number', 'processor', 'ram', 'storage', 'screen_size'],
        allowedFields: ['brand', 'model_number', 'processor', 'ram', 'storage', 'screen_size', 'graphics', 'color', 'os', 'convertible']
    },
    {
        id: 'desktops',
        name: 'Desktops',
        code: 'Computers/Desktop Computers',
        icon: <Monitor className="w-8 h-8" />,
        requiredFields: ['brand', 'model_number', 'processor', 'ram', 'storage'],
        allowedFields: ['brand', 'model_number', 'processor', 'ram', 'storage', 'graphics', 'os', 'form_factor']
    },
    {
        id: 'monitors',
        name: 'Monitors',
        code: 'Computers/Monitors',
        icon: <Monitor className="w-8 h-8 text-blue-500" />,
        requiredFields: ['brand', 'model_number', 'screen_size'],
        allowedFields: ['brand', 'model_number', 'screen_size', 'refresh_rate', 'resolution', 'panel_type']
    },
    {
        id: 'components',
        name: 'Components',
        code: 'Computers/Components',
        icon: <Cpu className="w-8 h-8" />,
        requiredFields: ['brand', 'model_number'],
        allowedFields: ['brand', 'model_number', 'processor_socket', 'chipset', 'memory_type']
    },
    {
        id: 'peripherals',
        name: 'Peripherals',
        code: 'Electronics/Accessories',
        icon: <MousePointer2 className="w-8 h-8" />,
        requiredFields: ['brand', 'model_number'],
        allowedFields: ['brand', 'model_number', 'connectivity', 'color']
    }
];

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // UI States
    const [categoryModalOpen, setCategoryModalOpen] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<CategoryConfig | null>(null);

    // AI States
    const [aiLoading, setAiLoading] = useState(false);
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiImageLoading, setAiImageLoading] = useState(false);
    const [aiPriceLoading, setAiPriceLoading] = useState(false);
    const [aiSeoLoading, setAiSeoLoading] = useState(false);
    const [suggestedPrice, setSuggestedPrice] = useState<{ min: number, max: number, optimal: number } | null>(null);
    const [marketInsights, setMarketInsights] = useState<{ avgPrice: number, competitors: number, demand: string } | null>(null);

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        short_description: '',
        brand: '',
        price: '',
        costPrice: '',
        compareAtPrice: '',
        sku: '',
        barcode: '',
        quantity: '1',
        min_quantity_alert: '5',
        status: 'active',
        condition: 'New',
        imageUrl: '',
        // Dynamic specs container
        specs: {} as Record<string, string>
    });

    // ------------------------------------------------------------------
    // 2. LOGIC: Field Management
    // ------------------------------------------------------------------

    const handleCategorySelect = (cat: CategoryConfig) => {
        setSelectedCategory(cat);
        setCategoryModalOpen(false);
    };

    const isFieldVisible = (field: string) => {
        if (!selectedCategory) return false;
        return selectedCategory.allowedFields.includes(field);
    };

    const isFieldRequired = (field: string) => {
        if (!selectedCategory) return false;
        return selectedCategory.requiredFields.includes(field);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('specs.')) {
            const specName = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                specs: { ...prev.specs, [specName]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const calculateMargin = () => {
        const price = parseFloat(formData.price) || 0;
        const cost = parseFloat(formData.costPrice) || 0;
        if (price === 0) return 0;
        return ((price - cost) / price * 100).toFixed(1);
    };

    // ------------------------------------------------------------------
    // 3. LOGIC: AI Integration
    // ------------------------------------------------------------------

    // AI Feature: Generate Product Image
    const handleAIImageGenerate = async () => {
        if (!formData.title) {
            toast.error('Please enter a product title first');
            return;
        }
        setAiImageLoading(true);
        try {
            // Mock AI image generation (in production, call DALL-E or Stable Diffusion API)
            await new Promise(resolve => setTimeout(resolve, 2000));
            const mockImageUrl = `https://placehold.co/800x600/4F46E5/white?text=${encodeURIComponent(formData.title.substring(0, 20))}`;
            setFormData(prev => ({ ...prev, imageUrl: mockImageUrl }));
            toast.success('Product image generated!');
        } catch (error) {
            toast.error('Image generation failed');
        } finally {
            setAiImageLoading(false);
        }
    };

    // AI Feature: Smart Price Suggestion
    const handleAIPriceSuggestion = async () => {
        if (!formData.brand || !selectedCategory) {
            toast.error('Please select category and enter brand first');
            return;
        }
        setAiPriceLoading(true);
        try {
            // Mock market analysis (in production, analyze competitor pricing)
            await new Promise(resolve => setTimeout(resolve, 1500));
            const basePrice = selectedCategory.id === 'laptops' ? 1200 : selectedCategory.id === 'monitors' ? 400 : 150;
            const variance = basePrice * 0.3;
            setSuggestedPrice({
                min: Math.round(basePrice - variance),
                max: Math.round(basePrice + variance),
                optimal: Math.round(basePrice)
            });
            setMarketInsights({
                avgPrice: basePrice,
                competitors: Math.floor(Math.random() * 50) + 10,
                demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)]
            });
            toast.success('Market analysis complete!');
        } catch (error) {
            toast.error('Price analysis failed');
        } finally {
            setAiPriceLoading(false);
        }
    };

    // AI Feature: SEO Optimizer
    const handleAISEOOptimize = async () => {
        if (!formData.title) {
            toast.error('Please enter a product title first');
            return;
        }
        setAiSeoLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const seoTitle = `${formData.title} | Best Price & Free Shipping | ${formData.brand || 'Premium'} Official`;
            const seoDesc = `Shop ${formData.title} at the best price. ${formData.brand ? formData.brand + ' certified.' : ''} Fast shipping, warranty included. ${selectedCategory?.name} on sale now!`;
            setFormData(prev => ({
                ...prev,
                title: seoTitle.substring(0, 100),
                short_description: seoDesc
            }));
            toast.success('SEO optimization applied!');
        } catch (error) {
            toast.error('SEO optimization failed');
        } finally {
            setAiSeoLoading(false);
        }
    };

    const handleAIGenerate = async () => {
        if (!aiPrompt) return;
        setAiLoading(true);

        try {
            // In a real app, this fetches from your API
            const response = await fetch('/api/ai/product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'smart_autofill',
                    currentData: aiPrompt,
                    category: selectedCategory?.code || 'General'
                })
            });
            const data = await response.json();

            // Fallback for mocked/demo environment if API fails or returns demo flag
            let result = data.data;
            if (!data.success && data.isDemo) {
                // Mock fallback
                result = JSON.stringify({
                    optimized_title: `Premium ${aiPrompt} - High Performance`,
                    short_description: `Generated description for ${aiPrompt}...`,
                    specs: {
                        brand: "GenAI Brand",
                        processor: "Intel i9",
                        ram: "32GB",
                        storage: "1TB SSD"
                    }
                });
            }

            // Parse result
            const jsonMatch = result.match(/\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : result;
            const parsed = JSON.parse(cleanJson);

            setFormData(prev => ({
                ...prev,
                title: parsed.optimized_title || prev.title,
                short_description: parsed.short_description || prev.short_description,
                brand: parsed.specs?.brand || prev.brand,
                specs: { ...prev.specs, ...parsed.specs }
            }));

            toast.success('AI Data Generated!');
            setAiModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('AI Generation failed');
        } finally {
            setAiLoading(false);
        }
    };

    // ------------------------------------------------------------------
    // 4. LOGIC: Form Submission
    // ------------------------------------------------------------------

    const validateForm = () => {
        if (!formData.title) return "Product Title is required";
        if (!formData.price) return "Price is required";
        if (!formData.imageUrl) return "Main Image is required";

        // Category specific validation
        if (selectedCategory) {
            for (const field of selectedCategory.requiredFields) {
                // Check top level first (like brand)
                if (field === 'brand' && !formData.brand) return "Brand is required for this category";
                if (field === 'model_number' && !formData.specs['model_number']) return "Model Number is required";

                // Then check spec fields
                if (field !== 'brand' && !formData.specs[field]) {
                    // Convert field name to readable text
                    const readable = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    return `${readable} is required for ${selectedCategory.name}`;
                }
            }
        }
        return null;
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        try {
            const productData = {
                title: { en: formData.title },
                short_description: { en: formData.short_description },
                category_code: selectedCategory?.code,
                brand: formData.brand,
                main_image_url: formData.imageUrl,

                // Map flat form data to structured Firestore schema
                offer: {
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity) || 0,
                    sku: formData.sku,
                    state: formData.condition,
                    min_quantity_alert: parseInt(formData.min_quantity_alert) || 5,
                },

                // Store all dynamic specs
                specifications: {
                    ...formData.specs,
                    condition: formData.condition // Ensure condition is also in specs if needed
                },

                status: formData.status,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'products'), productData);
            toast.success('Product created successfully!');
            router.push('/admin/products');
        } catch (error) {
            console.error(error);
            toast.error('Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const profitMargin = calculateMargin();

    // ------------------------------------------------------------------
    // UI RENDER
    // ------------------------------------------------------------------

    if (categoryModalOpen && !selectedCategory) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="max-w-4xl w-full p-8 space-y-8 animate-in fade-in zoom-in-95 duration-200">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Select Product Category</h2>
                        <p className="text-muted-foreground text-lg">Choose a category to load the correct specification fields.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat)}
                                className="flex flex-col items-center gap-4 p-6 rounded-xl border-2 border-transparent bg-slate-50 hover:bg-white hover:border-black/10 hover:shadow-lg transition-all duration-200 group"
                            >
                                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform text-slate-700">
                                    {cat.icon}
                                </div>
                                <span className="font-semibold text-lg">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-center pt-4">
                        <Button variant="ghost" onClick={() => router.back()}>Cancel Registration</Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-20">
            {/* STICKY HEADER */}
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/80 backdrop-blur-md z-40 py-4 border-b">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setCategoryModalOpen(true)} title="Change Category">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            New {selectedCategory?.name}
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Badge variant="outline" className="gap-1">
                                {selectedCategory?.code}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                                <Wand2 className="w-4 h-4 mr-2" />
                                AI Autofill
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>AI Assistant</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                                <Textarea
                                    placeholder="Paste raw specs here..."
                                    rows={5}
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                />
                                <Button onClick={handleAIGenerate} disabled={aiLoading} className="w-full">
                                    {aiLoading ? <Loader2 className="animate-spin" /> : 'Generate'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-black text-white px-8">
                        {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                        Publish
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT: MAIN CONTENT */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. BASIC INFO */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-1 bg-blue-600 rounded-full" />
                            <h3 className="text-lg font-semibold">Core Information</h3>
                        </div>

                        <div className="space-y-3">
                            <Label>Product Title <span className="text-red-500">*</span></Label>
                            <Input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="text-lg font-medium h-12"
                                placeholder={`e.g. ${selectedCategory?.name === 'Laptops' ? 'MacBook Pro M3 Max' : 'Product Name'}`}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label>Short Description</Label>
                            <Textarea
                                name="short_description"
                                value={formData.short_description}
                                onChange={handleInputChange}
                                className="min-h-[120px]"
                                placeholder="Key features and highlights..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Brand <span className="text-red-500">*</span></Label>
                                <Input name="brand" value={formData.brand} onChange={handleInputChange} placeholder="e.g. Apple" />
                            </div>
                            {isFieldVisible('model_number') && (
                                <div className="space-y-2">
                                    <Label>Model Number {isFieldRequired('model_number') && <span className="text-red-500">*</span>}</Label>
                                    <Input name="specs.model_number" value={formData.specs['model_number'] || ''} onChange={handleInputChange} />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* AI Quick Tools Panel */}
                    <Card className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">AI Power Tools</h3>
                                    <p className="text-xs text-gray-600">One-click automation</p>
                                </div>
                            </div>
                            <Badge className="bg-indigo-600 text-white">Beta</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <Button
                                variant="outline"
                                onClick={handleAISEOOptimize}
                                disabled={aiSeoLoading}
                                className="bg-white hover:bg-indigo-50 border-indigo-200 flex-col h-auto py-3"
                            >
                                {aiSeoLoading ? <Loader2 className="w-5 h-5 animate-spin mb-1" /> : <Search className="w-5 h-5 mb-1 text-indigo-600" />}
                                <span className="text-xs font-semibold">SEO Optimizer</span>
                                <span className="text-[10px] text-gray-500">Boost visibility</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleAIPriceSuggestion}
                                disabled={aiPriceLoading}
                                className="bg-white hover:bg-green-50 border-green-200 flex-col h-auto py-3"
                            >
                                {aiPriceLoading ? <Loader2 className="w-5 h-5 animate-spin mb-1" /> : <TrendingUp className="w-5 h-5 mb-1 text-green-600" />}
                                <span className="text-xs font-semibold">Smart Pricing</span>
                                <span className="text-[10px] text-gray-500">Market analysis</span>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleAIImageGenerate}
                                disabled={aiImageLoading}
                                className="bg-white hover:bg-purple-50 border-purple-200 flex-col h-auto py-3"
                            >
                                {aiImageLoading ? <Loader2 className="w-5 h-5 animate-spin mb-1" /> : <ImagePlus className="w-5 h-5 mb-1 text-purple-600" />}
                                <span className="text-xs font-semibold">Generate Image</span>
                                <span className="text-[10px] text-gray-500">AI visuals</span>
                            </Button>
                        </div>
                    </Card>

                    {/* 2. CATEGORY SPECIFIC SPECS */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-1 bg-purple-600 rounded-full" />
                            <h3 className="text-lg font-semibold">Technical Specifications</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Fields are customized for {selectedCategory?.name}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Render Allowed Fields Dynamically */}
                            {isFieldVisible('processor') && (
                                <div className="space-y-2">
                                    <Label>Processor {isFieldRequired('processor') && <span className="text-red-500">*</span>}</Label>
                                    <Input name="specs.processor" value={formData.specs['processor'] || ''} onChange={handleInputChange} placeholder="e.g. Intel Core i9 / M3" />
                                </div>
                            )}

                            {isFieldVisible('ram') && (
                                <div className="space-y-2">
                                    <Label>RAM {isFieldRequired('ram') && <span className="text-red-500">*</span>}</Label>
                                    <Input name="specs.ram" value={formData.specs['ram'] || ''} onChange={handleInputChange} placeholder="e.g. 32GB" />
                                </div>
                            )}

                            {isFieldVisible('storage') && (
                                <div className="space-y-2">
                                    <Label>Storage {isFieldRequired('storage') && <span className="text-red-500">*</span>}</Label>
                                    <Input name="specs.storage" value={formData.specs['storage'] || ''} onChange={handleInputChange} placeholder="e.g. 1TB SSD" />
                                </div>
                            )}

                            {isFieldVisible('screen_size') && (
                                <div className="space-y-2">
                                    <Label>Screen Size {isFieldRequired('screen_size') && <span className="text-red-500">*</span>}</Label>
                                    <Input name="specs.screen_size" value={formData.specs['screen_size'] || ''} onChange={handleInputChange} placeholder="e.g. 16 inch" />
                                </div>
                            )}

                            {isFieldVisible('graphics') && (
                                <div className="space-y-2">
                                    <Label>Graphics Card {isFieldRequired('graphics') && <span className="text-red-500">*</span>}</Label>
                                    <Input name="specs.graphics" value={formData.specs['graphics'] || ''} onChange={handleInputChange} placeholder="e.g. RTX 4090" />
                                </div>
                            )}

                            {isFieldVisible('color') && (
                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <Input name="specs.color" value={formData.specs['color'] || ''} onChange={handleInputChange} />
                                </div>
                            )}

                            {isFieldVisible('os') && (
                                <div className="space-y-2">
                                    <Label>Operating System</Label>
                                    <Select
                                        value={formData.specs['os'] || ''}
                                        onValueChange={(v) => handleInputChange({ target: { name: 'specs.os', value: v } } as any)}
                                    >
                                        <SelectTrigger><SelectValue placeholder="Select OS" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="macOS">macOS</SelectItem>
                                            <SelectItem value="Windows 11">Windows 11</SelectItem>
                                            <SelectItem value="Windows 10">Windows 10</SelectItem>
                                            <SelectItem value="ChromeOS">ChromeOS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* 3. MEDIA */}
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-8 w-1 bg-green-600 rounded-full" />
                            <h3 className="text-lg font-semibold">Media</h3>
                        </div>
                        <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                            {formData.imageUrl ? (
                                <div className="relative aspect-video w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-sm">
                                    <img src={formData.imageUrl} className="object-cover w-full h-full" alt="Preview" />
                                    <button
                                        onClick={() => setFormData(p => ({ ...p, imageUrl: '' }))}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full text-red-500 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Click to upload image</p>
                                        <p className="text-sm text-gray-500">or paste URL below</p>
                                    </div>
                                    <Input
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="max-w-md mx-auto"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* RIGHT: SIDEBAR */}
                <div className="space-y-8">
                    {/* STATUS */}
                    <Card className="p-6 space-y-6">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Visibility</Label>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="font-medium">Status</span>
                                <span className="text-xs text-gray-500">{formData.status === 'active' ? 'Visible online' : 'Hidden from store'}</span>
                            </div>
                            <Switch
                                checked={formData.status === 'active'}
                                onCheckedChange={(c) => setFormData(p => ({ ...p, status: c ? 'active' : 'draft' }))}
                            />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Condition</Label>
                            <Select
                                value={formData.condition}
                                onValueChange={(v) => setFormData(p => ({ ...p, condition: v }))}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="New">Brand New</SelectItem>
                                    <SelectItem value="Open Box">Open Box</SelectItem>
                                    <SelectItem value="Refurbished">Refurbished</SelectItem>
                                    <SelectItem value="Used">Used</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>

                    {/* PRICING */}
                    <Card className="p-6 space-y-6">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Pricing</Label>

                        <div className="space-y-2">
                            <Label>Sale Price</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input name="price" type="number" value={formData.price} onChange={handleInputChange} className="pl-9 text-lg font-bold" placeholder="0.00" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Cost</Label>
                                <Input name="costPrice" type="number" value={formData.costPrice} onChange={handleInputChange} placeholder="0.00" />
                            </div>
                            <div className="space-y-2">
                                <Label>Compare At</Label>
                                <Input name="compareAtPrice" type="number" value={formData.compareAtPrice} onChange={handleInputChange} placeholder="0.00" />
                            </div>
                        </div>

                        {formData.price && formData.costPrice && (
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm">
                                <span className="text-gray-600">Profit Margin</span>
                                <span className={`font-bold ${Number(profitMargin) > 20 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {profitMargin}%
                                </span>
                            </div>
                        )}
                    </Card>

                    {/* AI MARKET INSIGHTS */}
                    {(suggestedPrice || marketInsights) && (
                        <Card className="p-6 space-y-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <div className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5 text-green-600" />
                                <Label className="text-xs font-bold text-green-900 uppercase">AI Market Insights</Label>
                            </div>

                            {suggestedPrice && (
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-700">Suggested Range</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            ${suggestedPrice.min} - ${suggestedPrice.max}
                                        </span>
                                    </div>
                                    <div className="p-3 bg-white rounded-lg border-2 border-green-300">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-600">Optimal Price</span>
                                            <button
                                                onClick={() => setFormData(p => ({ ...p, price: suggestedPrice.optimal.toString() }))}
                                                className="text-xs text-green-600 hover:text-green-700 font-semibold underline"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                        <div className="text-2xl font-bold text-green-600 mt-1">
                                            ${suggestedPrice.optimal}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {marketInsights && (
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                                    <div className="text-center">
                                        <div className="text-xs text-gray-600">Avg Market</div>
                                        <div className="text-sm font-bold">${marketInsights.avgPrice}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-600">Competitors</div>
                                        <div className="text-sm font-bold">{marketInsights.competitors}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-gray-600">Demand</div>
                                        <div className={`text-sm font-bold ${marketInsights.demand === 'High' ? 'text-green-600' :
                                                marketInsights.demand === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {marketInsights.demand}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* INVENTORY */}
                    <Card className="p-6 space-y-6">
                        <Label className="text-xs font-bold text-gray-500 uppercase">Inventory</Label>

                        <div className="space-y-2">
                            <Label>SKU</Label>
                            <Input name="sku" value={formData.sku} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-2">
                            <Label>Barcode (UPC/GTIN)</Label>
                            <Input name="barcode" value={formData.barcode} onChange={handleInputChange} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Stock Qty</Label>
                                <Input name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} />
                            </div>
                            <div className="space-y-2">
                                <Label>Alert Limit</Label>
                                <Input name="min_quantity_alert" type="number" value={formData.min_quantity_alert} onChange={handleInputChange} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
