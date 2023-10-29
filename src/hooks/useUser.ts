import create from "zustand";
import { persist, devtools } from "zustand/middleware";
import { ICustomer } from "../interfaces/ICustomers";
import { axiosClient } from "../libraries/axiosClient";

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
        return set((state) => ({ users: users }), false, {
          type: "addUser",
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
      initialize: () => {
        const storedToken = localStorage.getItem("access_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        if (storedToken && storedRefreshToken) {
          set({ access_token: storedToken, refresh_token: storedRefreshToken });
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
