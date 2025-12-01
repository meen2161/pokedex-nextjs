import { create } from 'zustand';

interface FilterState {
  selectedTypes: string[];
  toggleType: (type: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedTypes: [],
  toggleType: (type) =>
    set((state) => {
      const isSelected = state.selectedTypes.includes(type);
      return {
        selectedTypes: isSelected
          ? state.selectedTypes.filter((t) => t !== type)
          : [...state.selectedTypes, type],
      };
    }),
  clearFilters: () => set({ selectedTypes: [] }),
}));