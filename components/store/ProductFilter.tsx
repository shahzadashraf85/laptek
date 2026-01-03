import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';


interface FilterState {
    priceRange: [number, number];
    categories: string[];
    brands: string[];
    // dynamic specs could go here
}

interface ProductFilterProps {
    minPrice: number;
    maxPrice: number;
    categories: string[];
    brands: string[];
    currFilters: FilterState;
    setFilters: (filters: FilterState) => void;
}

export function ProductFilter({
    minPrice,
    maxPrice,
    categories,
    brands,
    currFilters,
    setFilters
}: ProductFilterProps) {

    const handleCategoryToggle = (cat: string) => {
        const newCats = currFilters.categories.includes(cat)
            ? currFilters.categories.filter(c => c !== cat)
            : [...currFilters.categories, cat];
        setFilters({ ...currFilters, categories: newCats });
    };

    const handleBrandToggle = (brand: string) => {
        const newBrands = currFilters.brands.includes(brand)
            ? currFilters.brands.filter(b => b !== brand)
            : [...currFilters.brands, brand];
        setFilters({ ...currFilters, brands: newBrands });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple distinct max price slider for now
        const val = parseInt(e.target.value);
        setFilters({ ...currFilters, priceRange: [currFilters.priceRange[0], val] });
    };

    return (
        <div className="w-full space-y-6 pt-1">
            <div>
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <Separator className="mb-4" />

                <div className="mb-6">
                    <Label className="text-base font-medium mb-3 block">Price Range</Label>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>${currFilters.priceRange[0]}</span>
                        <span>${currFilters.priceRange[1]}</span>
                    </div>
                    <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={currFilters.priceRange[1]}
                        onChange={handlePriceChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div className="mb-6">
                    <Label className="text-base font-medium mb-3 block">Categories</Label>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div key={cat} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`cat-${cat}`}
                                    checked={currFilters.categories.includes(cat)}
                                    onChange={() => handleCategoryToggle(cat)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`cat-${cat}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer"
                                >
                                    {cat}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <Label className="text-base font-medium mb-3 block">Brands</Label>
                    <div className="space-y-2">
                        {brands.map((brand) => (
                            <div key={brand} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`brand-${brand}`}
                                    checked={currFilters.brands.includes(brand)}
                                    onChange={() => handleBrandToggle(brand)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label
                                    htmlFor={`brand-${brand}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {brand}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
