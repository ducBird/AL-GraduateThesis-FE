import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import { ICustomer } from "../interfaces/ICustomers";
import { axiosClient } from "../libraries/axiosClient";
import { ICustomerCart } from "../interfaces/ICustomerCart";
import { IProduct } from "../interfaces/IProducts";

const persistOptions = {
  name: "user-storage",
  getStorage: () => localStorage,
};

export const useUser = create(
  persist(
    devtools((set, get: any) => ({
      access_token: null,
      refresh_token: null,
      users: {},
      addUser: (customer: ICustomer) => {
        const users = get().users;
        Object.assign(users, customer);
        return set(() => ({ users: users }), false, {
          type: "addUser",
        });
      },
      updateUserAvatar: (url: string) => {
        const users = get().users;
        users.user.avatar = url;
        return set(() => ({ users: users }), false, {
          type: "updateUserAvatar",
        });
      },
      updateUserProfile: async () => {
        // Gửi request đến endpoint để lấy thông tin chi tiết của cart
        const users = { ...get().users };
        const customerId = users.user._id;
        const response = await axiosClient.get(`customers/${customerId}`);
        Object.assign(users.user, response.data);
        return set(() => ({ users: users }), false, {
          type: "updateProfileUser",
        });
      },
      updateUser: (customer: ICustomer) => {
        const users = { ...get().users }; // Tạo một bản sao của đối tượng users
        const found = users?.user; // Truy cập trường user từ đối tượng users

        if (found) {
          found.points = customer.points;
          return set({ users }, false, { type: "updateUser" });
        }

        return null; // Hoặc xử lý trường hợp không tìm thấy người dùng
      },

      // cập nhật customer_cart
      updateUserCart: async (cart: ICustomerCart) => {
        try {
          // Gửi request đến endpoint để lấy thông tin chi tiết của cart
          const users = { ...get().users };
          const customerId = users.user._id;
          const response = await axiosClient.get(`customers/${customerId}`);
          const detailedCart = response.data.customer_cart;
          if (customerId) {
            set((state) => ({
              users: {
                ...state.users,
                user: {
                  ...state.users.user,
                  customer_cart: detailedCart,
                },
              },
            }));
          }
        } catch (error) {
          console.error(error);
        }
      },

      // xóa customer_cart
      removeCartItem: (productId: string, variantId: string) => {
        set((state) => {
          const updatedCustomerCart = state?.users?.user?.customer_cart.filter(
            (item) =>
              item?.product_id?.toString() !== productId ||
              item?.variants_id?.toString() !== variantId
          );
          return {
            users: {
              ...state.users,
              user: {
                ...state.users.user,
                customer_cart: updatedCustomerCart,
              },
            },
          };
        });
      },

      removeAllUserCart: async () => {
        try {
          set((state) => ({
            users: {
              ...state.users,
              user: {
                ...state.users.user,
                customer_cart: [],
              },
            },
          }));
        } catch (error) {
          console.error(error);
        }
      },
      initialize: () => {
        const storedToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        const users = { ...get().users };
        const customerId = users.user._id;
        if (storedToken && storedRefreshToken && customerId) {
          axiosClient
            .get(`customers/${customerId}`)
            .then((response) => {
              const detailedCart = response.data.customer_cart;
              set((state) => ({
                access_token: storedToken,
                refresh_token: storedRefreshToken,
                users: {
                  ...state.users,
                  user: {
                    ...state.users.user,
                    customer_cart: detailedCart,
                  },
                },
              }));
            })
            .catch((error) => {
              console.error(
                "Lỗi khi lấy thông tin chi tiết người dùng từ server",
                error
              );
            });
        }
      },
      refreshToken: async () => {
        const refresh_token = localStorage.getItem("refresh_token");
        if (refresh_token) {
          try {
            const response = await axiosClient.post("customers/refresh-token", {
              refresh_token,
            });
            const { access_token } = response.data;
            set({ access_token });
            // Lưu trữ token mới vào localStorage hoặc cookie
            localStorage.setItem("access_token", access_token);
          } catch (error) {
            console.error("Làm mới token thất bại", error);
            // Xóa token và refreshToken từ localStorage hoặc cookie
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        }
      },
    })),
    persistOptions
  )
);
