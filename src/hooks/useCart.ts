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

        const newItems = items.filter((itemCart: CartItem) => {
          return (
            itemCart.product &&
            (itemCart.product._id !== product._id ||
              !itemCart.product.variants.some((cartVariant) => {
                return product.variants.some(
                  (newVariant) =>
                    newVariant.title === cartVariant.title &&
                    newVariant._id === cartVariant._id
                );
              }))
          );
        });

        return set({ items: newItems }, false, { type: "cart/removeCart" });
      },

      removeAll: () => {
        return set({ items: [] }, false, { type: "cart/removeCartAll" });
      },
      // increase: (id: string) => {
      //   const items = get().items;
      //   const found = items.find(
      //     (itemCart: CartItem) => itemCart.product?._id === id
      //   );
      //   if (found) {
      //     found.quantity++;
      //   }
      //   return set({ items: [...items] }, false, { type: "cart/increase" });
      // },
      // decrease: (id: string) => {
      //   const items = get().items;
      //   const found = items.find(
      //     (itemCart: CartItem) => itemCart.product?._id === id
      //   );
      //   if (found && found.quantity === 1) {
      //     const newItems = items.filter(
      //       (itemCart: CartItem) => itemCart.product?._id !== found.product?._id
      //     );
      //     return set({ items: [...newItems] }, false, {
      //       type: "cart/decrease",
      //     });
      //   } else if (found) {
      //     found.quantity--;
      //     return set({ items: [...items] }, false, { type: "cart/decrease" });
      //   }
      // },
    })),
    persistOptions
  )
);
