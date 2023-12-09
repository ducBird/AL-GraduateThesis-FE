import create from "zustand";
import { persist } from "zustand/middleware";

const persistOptions = {
  name: "notification-storage",
  getStorage: () => localStorage,
};

export const useNotification = create(
  persist(
    (set, get) => ({
      unreadNotificationCount: 0,
      updateUnreadCount: () => {
        set((state) => ({
          unreadNotificationCount: Math.max(
            0,
            state.unreadNotificationCount - 1
          ),
        }));
      },
    }),
    persistOptions
  )
);
