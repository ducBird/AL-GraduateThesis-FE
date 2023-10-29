import { devtools } from "zustand/middleware";
import { persist } from "zustand/middleware";
import { create } from "zustand";
import { IProduct } from "../interfaces/IProducts";

export interface WishlistItem {
  product: IProduct;
}
const persistOptions = {
  name: "wishlist-storage",
  getStorage: () => localStorage,
};

export const useProductWishlist = create(
  persist(
    devtools((set: any, get: any) => ({
      wishlist_items: [],
      addWishlist: ({ product }) => {
        const wishlist_items = get().wishlist_items;
        // console.log(items);
        if (wishlist_items || wishlist_items?.length !== 0) {
          const found = wishlist_items.find(
            (itemWishlist) => itemWishlist.product._id === product._id
          );
          if (!found) {
            wishlist_items.push({ product });
          }
        } else {
          wishlist_items.push({ product });
        }
        return set({ wishlist_items: wishlist_items }, false, {
          type: "wishlist/addToWishlist",
        });
      },

      removeWishlist: (id) => {
        const wishlist_items = get().wishlist_items;
        const newItemsWishlist = wishlist_items.filter(
          (itemWishlist) => itemWishlist.product._id !== id
        );
        return set({ wishlist_items: newItemsWishlist }, false, {
          type: "wishlist/removeWishlist",
        });
      },
      removeWishlistAll: () => {
        return set({ wishlist_items: [] }, false, {
          type: "wishlist/removeWishlistAll",
        });
      },
    })),

    persistOptions
  )
);
