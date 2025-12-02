import { FC, useState, useMemo, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePokemonList } from "@/src/hooks/usePokemon";
import { PokemonResult } from "@/src/types/pokemon";
import PokemonCard from "./PokemonCard";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";

interface PokemonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemon: PokemonResult) => void;
}

const PokemonSelectorModal: FC<PokemonSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCount, setDisplayedCount] = useState(20);
  const { data: pokemonList = [] } = usePokemonList();
  const { favorites } = useFavoriteStore();

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

  const favoriteList = useMemo(() => {
    return filteredPokemon.filter(p => favorites.includes(getPokemonId(p.url)));
  }, [filteredPokemon, favorites]);

  const nonFavoriteList = useMemo(() => {
    return filteredPokemon.filter(p => !favorites.includes(getPokemonId(p.url)));
  }, [filteredPokemon, favorites]);

  useEffect(() => {
    setDisplayedCount(20);
  }, [searchTerm]);

  const displayedPokemon = nonFavoriteList.slice(0, displayedCount);
  const hasMore = displayedPokemon.length < nonFavoriteList.length;

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
          {filteredPokemon.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No Pokémon found
            </div>
          ) : (
            <>
              {favoriteList.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" className="w-6 h-6">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    Favorites
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {favoriteList.map((pokemon) => {
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
                  </div>
                  <div className="border-b border-gray-200 mt-6 mb-6"></div>
                </div>
              )}

              {nonFavoriteList.length > 0 && (
                <div>
                  {favoriteList.length > 0 && (
                    <h3 className="text-xl font-bold text-gray-800 mb-4">All Pokémon</h3>
                  )}
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonSelectorModal;