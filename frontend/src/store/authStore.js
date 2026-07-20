import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (userData) =>
        set({
          user: { _id: userData._id, name: userData.name, email: userData.email },
          token: userData.token,
          isAuthenticated: true,
        }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "trailmark-auth" } // stored in THIS device's localStorage only (just the token/session,
    // not the actual workout data — that always lives on the server)
  )
);
