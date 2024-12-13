import { create } from 'zustand';

const useAuthStore = create((set) => ({
    genreDurations: null,
    setGenreDurations: (data) => set({ genreDurations: data }),
    clearAuth: () => set({genreDurations: null }),
}));

export default useAuthStore;