import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import { IProduct } from "../interfaces/IProducts";
import { IRemoveCartItem } from "../interfaces/IRemoveCartItem";

export interface CartItem {
  product: IProduct;
  quantity: number;
}
const persistOptions = {
  name: "cart-storage",
  getStorage: () => localStorage,
};

export const useCarts = create(
  persist(
    devtools((set: any, get: any) => ({
      items: [],
      add: ({ product, quantity }: CartItem) => {
        try {
          const items = get().items;
          const found = items.find((itemCart: CartItem) => {
            if (
              itemCart.product?._id === product?._id &&
              itemCart.product.variants.length === product.variants.length
            ) {
              return itemCart.product.variants.every((cartVariant) => {
                return product.variants.some((newVariant) => {
                  return newVariant.title === cartVariant.title;
                });
              });
            }
            return false;
          });

          if (found) {
            found.quantity += quantity;
          } else {
            items.push({ product, quantity });
          }
          console.log("items", items);

          return set({ items: [...items] }, false, { type: "cart/addToCart" });
        } catch (error) {
          console.error(error);
        }
      },

      updateQuantity: ({ product, quantity }: CartItem) => {
        const items = get().items;
        const found = items.find((itemCart: CartItem) => {
          if (
            itemCart.product?._id === product?._id &&
            itemCart.product.variants.length === product.variants.length
          ) {
            return itemCart.product.variants.every((cartVariant) => {
              return product.variants.some((newVariant) => {
                return newVariant.title === cartVariant.title;
              });
            });
          }
          return false;
        });
        if (found) {
          found.quantity = quantity;
        }
        return set({ items: [...items] }, false, {
          type: "cart/updateQuantity",
        });
      },
      remove: ({ product }: IRemoveCartItem) => {
        const items = get().items;

        const newItemsProductId = items.filter((itemCart: CartItem) => {
          const differentProductId = itemCart.product?._id !== product._id;
          return differentProductId;
        });
        const newItemsVariants = items.filter((itemCart: CartItem) => {
          const noMatchingVariants =
            !product.variants || // Thêm điều kiện kiểm tra xem sản phẩm có biến thể không
            !itemCart.product?.variants.some((cartVariant) =>
              product.variants.some(
                (newVariant) =>
                  newVariant.title === cartVariant.title &&
                  newVariant._id === cartVariant._id
              )
            );

          return noMatchingVariants;
        });
        if (product.variants && product.variants.length > 0) {
          return set({ items: newItemsVariants }, false, {
            type: "cart/removeCart",
          });
        } else {
          return set({ items: newItemsProductId }, false, {
            type: "cart/removeCart",
          });
        }
      },

      removeAll: () => {
        return set({ items: [] }, false, { type: "cart/removeCartAll" });
      },
    })),
    persistOptions
  )
);
