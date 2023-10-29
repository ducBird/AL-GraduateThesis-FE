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
            return (
              // every dùng để kiểm tra tất cả các phần tử trong mảng có thõa mãn điều kiện so sánh không
              // some dùng để kiểm tra xem có ít nhất một phần tử trong mảng thõa mãn điều kiện so sánh
              itemCart.product?._id === product?._id &&
              itemCart.product.variants.every((variant) =>
                product.variants.some(
                  (newVariant) =>
                    newVariant._id === variant._id &&
                    newVariant?.options?.every((newOption) =>
                      variant?.options?.some(
                        (option) => option._id === newOption._id
                      )
                    )
                )
              )
            );
          });
          if (found) {
            found.quantity += quantity;
          } else {
            items.push({ product, quantity });
          }

          return set({ items: [...items] }, false, { type: "cart/addToCart" });
        } catch (error) {
          console.error(error);
        }
      },

      updateQuantity: ({ product, quantity }: CartItem) => {
        const items = get().items;
        const found = items.find((itemCart: CartItem) => {
          return (
            // every dùng để kiểm tra tất cả các phần tử trong mảng có thõa mãn điều kiện so sánh không
            // some dùng để kiểm tra xem có ít nhất một phần tử trong mảng thõa mãn điều kiện so sánh
            itemCart.product?._id === product?._id &&
            itemCart.product.variants.every((variant) =>
              product.variants.some(
                (newVariant) =>
                  newVariant._id === variant._id &&
                  newVariant?.options?.every((newOption) =>
                    variant?.options?.some(
                      (option) => option._id === newOption._id
                    )
                  )
              )
            )
          );
        });
        // console.log(found);
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
            // dùng toán tử !itemCart.product.variants.every để giữ lại đơn hàng nếu như có một variant hoặc option không khớp
            itemCart.product?._id !== product?._id ||
            !itemCart.product.variants.every((variant) =>
              product.variants.some(
                (newVariant) =>
                  newVariant._id === variant._id &&
                  newVariant.options?.every((newOption) =>
                    variant.options?.some(
                      (option) => option._id === newOption._id
                    )
                  )
              )
            )
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
