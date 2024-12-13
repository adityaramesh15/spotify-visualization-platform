import { create } from 'zustand';

const useAuthStore = create((set) => ({
    genreDurations: null,
    genreMap: null,
    setGenreMap: (data) => set({genreMap: data}),
    setGenreDurations: (data) => set({ genreDurations: data }),
    clearAuth: () => set({genreDurations: null, genreMap: null }),
}));

export default useAuthStore;