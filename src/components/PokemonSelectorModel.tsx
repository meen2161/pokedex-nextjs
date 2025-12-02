import { FC, useState, useMemo, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePokemonList } from "@/src/hooks/usePokemon";
import { PokemonResult } from "@/src/types/pokemon";
import PokemonCard from "./PokemonCard";

interface PokemonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemon: PokemonResult) => void;
}

const PokemonSelectorModal: FC<PokemonSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCount, setDisplayedCount] = useState(20);
  const { data: pokemonList = [] } = usePokemonList();

  const getPokemonId = (url: string): number => {
    const segments = url.split('/');
    return parseInt(segments[segments.length - 2]);
  };

  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return pokemonList;
    return pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm]);

  useEffect(() => {
    setDisplayedCount(20);
  }, [searchTerm]);

  const displayedPokemon = filteredPokemon.slice(0, displayedCount);
  const hasMore = displayedPokemon.length < filteredPokemon.length;

  const loadMore = () => {
    setDisplayedCount((prev) => prev + 20);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">

        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">Select Pokémon</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div id="scrollableDiv" className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {displayedPokemon.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No Pokémon found
            </div>
          ) : (
            <InfiniteScroll
              dataLength={displayedPokemon.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="col-span-full text-center py-4 overflow-hidden">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              }
              scrollableTarget="scrollableDiv"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {displayedPokemon.map((pokemon) => {
                const id = getPokemonId(pokemon.url);
                return (
                  <div key={pokemon.name} className="transform scale-90 hover:scale-100 transition-transform">
                    <PokemonCard
                      pokemon={pokemon}
                      pokemonId={id}
                      onClick={() => onSelect(pokemon)}
                    />
                  </div>
                );
              })}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonSelectorModal;