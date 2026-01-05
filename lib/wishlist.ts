import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WishlistItem = {
    id: string;
    name: string;
    price: number;
    image: string;
};

type WishlistStore = {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string) => void;
    isInWishlist: (id: string) => boolean;
    clearWishlist: () => void;
};

export const useWishlist = create<WishlistStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => set((state) => {
                const exists = state.items.find(item => item.id === product.id);
                if (exists) return state;
                return { items: [...state.items, product] };
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter(item => item.id !== id)
            })),
            isInWishlist: (id) => get().items.some(item => item.id === id),
            clearWishlist: () => set({ items: [] }),
        }),
        {
            name: 'laptek-wishlist',
        }
    )
);
