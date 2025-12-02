"use client";

import { FC, useState } from "react";
import Header from "@/src/components/Header";
import { useTeamStore } from "@/src/store/useTeamStore";
import PokemonCard from "@/src/components/PokemonCard";
import PokemonSelectorModal from "@/src/components/PokemonSelectorModel";
import { PokemonResult } from "@/src/types/pokemon";

const TeamBuildPage: FC = () => {
  const { team, setSlot, removeSlot, clearTeam } = useTeamStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);

  const handleSlotClick = (index: number) => {
    setSelectedSlotIndex(index);
    setIsModalOpen(true);
  };

  const handleSelectPokemon = (pokemon: PokemonResult) => {
    if (selectedSlotIndex !== null) {
      setSlot(selectedSlotIndex, pokemon);
      setIsModalOpen(false);
      setSelectedSlotIndex(null);
    }
  };

  const getPokemonId = (url: string): number => {
    const segments = url.split('/');
    return parseInt(segments[segments.length - 2]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Dream Team</h1>
            <p className="text-gray-600 mt-2">Select up to 6 Pokémon for your team</p>
          </div>
          <button
            onClick={clearTeam}
            className="px-4 py-2 text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-sm"
          >
            Clear Team
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((pokemon, index) => (
            <div key={index} className="relative group h-full">
              {pokemon ? (
                <div className="relative h-full">
                  <PokemonCard
                    pokemon={pokemon}
                    pokemonId={getPokemonId(pokemon.url)}
                    onClick={() => handleSlotClick(index)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlot(index);
                    }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110 z-10"
                    title="Remove from team"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSlotClick(index)}
                  className="w-full h-64 border-4 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center bg-white/50 hover:bg-white hover:border-blue-400 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-blue-500 group-hover:text-blue-600">
                    Add Pokémon
                  </span>
                  <span className="text-sm text-gray-400 mt-1">Slot {index + 1}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <PokemonSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleSelectPokemon}
      />
    </div>
  );
};

export default TeamBuildPage;