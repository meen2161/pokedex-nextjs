import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PokemonResult } from '../types/pokemon';

interface TeamState {
  team: (PokemonResult | null)[];
  setSlot: (index: number, pokemon: PokemonResult) => void;
  removeSlot: (index: number) => void;
  clearTeam: () => void;
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      // เริ่มต้นด้วย Array ว่าง 6 ช่อง
      team: Array(6).fill(null),

      setSlot: (index, pokemon) =>
        set((state) => {
          const newTeam = [...state.team];
          newTeam[index] = pokemon;
          return { team: newTeam };
        }),

      removeSlot: (index) =>
        set((state) => {
          const newTeam = [...state.team];
          newTeam[index] = null;
          return { team: newTeam };
        }),

      clearTeam: () => set({ team: Array(6).fill(null) }),
    }),
    {
      name: 'pokemon-team-storage',
    }
  )
);