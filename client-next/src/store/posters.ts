import { create } from "zustand";
import { getPosters } from "@/actions/movies";
import type { Poster } from "@/types/movies";

type PosterState = {
	list: Poster[];
	loading: boolean;
	error: string | null;
	fetch: () => Promise<void>;
};

export const usePosterStore = create<PosterState>((set) => ({
	list: [],
	loading: false,
	error: null,
	fetch: async () => {
		set({ loading: true, error: null });
		try {
			const data = await getPosters();
			set({ list: data, loading: false });
		} catch (error) {
			const err = error as { message?: string };
			set({ error: err.message || "Failed to load posters", loading: false });
		}
	},
}));
