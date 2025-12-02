"use client";

import { FC, useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import InfiniteScroll from "react-infinite-scroll-component";
import { usePokemonList } from "@/src/hooks/usePokemon";
import { PokemonResult } from "@/src/types/pokemon";
import PokemonCard from "@/src/components/PokemonCard";
import { useFilterStore } from "@/src/store/useFilterStore";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";
import Header from "@/src/components/Header";

const Pokedex: FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonResult[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [pokemonTypesCache, setPokemonTypesCache] = useState<Map<number, string[]>>(new Map());
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const itemsPerPage = 20;
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const { selectedTypes, toggleType, clearFilters } = useFilterStore();
  const { favorites } = useFavoriteStore();
  const { data: pokemonList = [], isLoading, error } = usePokemonList();

  const pokemonTypes = [
    "normal", "fire", "water", "electric", "grass", "ice",
    "fighting", "poison", "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon", "dark", "steel", "fairy"
  ];

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-green-400',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return colors[type] || 'bg-gray-400';
  };

  const getPokemonId = (url: string): number => {
    const segments = url.split('/');
    return parseInt(segments[segments.length - 2]);
  };

  useEffect(() => {
    const fetchPokemonTypes = async () => {
      if (pokemonList.length === 0 || pokemonTypesCache.size > 0) return;

      setIsLoadingTypes(true);
      const typesMap = new Map<number, string[]>();

      try {
        const batchSize = 50;
        for (let i = 0; i < pokemonList.length; i += batchSize) {
          const batch = pokemonList.slice(i, i + batchSize);
          const promises = batch.map(async (pokemon) => {
            const id = getPokemonId(pokemon.url);
            try {
              const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
              const data = await response.json();
              const types = data.types.map((t: any) => t.type.name);
              typesMap.set(id, types);
            } catch (error) {
              console.error(`Error fetching types for ${pokemon.name}:`, error);
            }
          });
          await Promise.all(promises);

          setPokemonTypesCache(new Map(typesMap));
        }
      } catch (error) {
        console.error('Error fetching pokemon types:', error);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchPokemonTypes();
  }, [pokemonList.length]);

  const filteredPokemon = useMemo(() => {
    let filtered = pokemonList;

    if (searchTerm) {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTypes.length > 0 && pokemonTypesCache.size > 0) {
      filtered = filtered.filter((pokemon) => {
        const pokemonId = getPokemonId(pokemon.url);
        const pokemonTypes = pokemonTypesCache.get(pokemonId) || [];
        return selectedTypes.some(selectedType =>
          pokemonTypes.includes(selectedType)
        );
      });
    }

    return filtered;
  }, [pokemonList, searchTerm, selectedTypes, pokemonTypesCache]);

  const favoriteList = useMemo(() => {
    return filteredPokemon.filter(p => favorites.includes(getPokemonId(p.url)));
  }, [filteredPokemon, favorites]);

  const nonFavoriteList = useMemo(() => {
    return filteredPokemon.filter(p => !favorites.includes(getPokemonId(p.url)));
  }, [filteredPokemon, favorites]);

  useEffect(() => {
    setDisplayedPokemon(nonFavoriteList.slice(0, itemsPerPage));
    setCurrentPage(0);
  }, [nonFavoriteList, itemsPerPage]);

  const loadMorePokemon = () => {
    const nextPage = currentPage + 1;
    const startIndex = nextPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const newPokemon = nonFavoriteList.slice(startIndex, endIndex);

    setDisplayedPokemon(prev => [...prev, ...newPokemon]);
    setCurrentPage(nextPage);
  };

  const hasMore = displayedPokemon.length < nonFavoriteList.length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowTypeFilter(false);
      }
    };

    if (showTypeFilter) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTypeFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Pokédex...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Failed to load Pokédex</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4">
        <div className="mt-6 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="relative" ref={filterDropdownRef}>
            <button
              onClick={() => setShowTypeFilter(!showTypeFilter)}
              disabled={pokemonTypesCache.size === 0}
              className={`px-4 py-3 rounded-xl font-medium transition-all cursor-pointer duration-200 flex items-center gap-2 ${selectedTypes.length > 0
                ? 'bg-blue-500 text-white shadow-md'
                : pokemonTypesCache.size === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
              </svg>
              <span>Filter</span>
              {selectedTypes.length > 0 && (
                <span className="bg-white text-blue-500 rounded-full px-2 py-0.5 text-xs font-bold">
                  {selectedTypes.length}
                </span>
              )}
            </button>

            {showTypeFilter && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-80 z-20">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Filter by Type</h3>
                  {selectedTypes.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {pokemonTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTypes.includes(type)
                        ? `${getTypeColor(type)} text-white shadow-md transform scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedTypes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedTypes.map((type) => (
              <span
                key={type}
                className={`${getTypeColor(type)} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                <button
                  onClick={() => toggleType(type)}
                  className="hover:bg-white/20 rounded-full p-0.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredPokemon.length === 0 && (searchTerm || selectedTypes.length > 0) ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">
              No Pokémon found matching your filters
            </p>
          </div>
        ) : (
          <>
            {favoriteList.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" className="w-8 h-8">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  Favorites
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {favoriteList.map((pokemon) => {
                    const pokemonId = getPokemonId(pokemon.url);
                    return (
                      <PokemonCard
                        key={pokemon.name}
                        pokemon={pokemon}
                        pokemonId={pokemonId}
                        onClick={() => router.push(`/pokemon/${pokemonId}`)}
                      />
                    );
                  })}
                </div>
                <div className="border-b border-gray-200 mt-8"></div>
              </div>
            )}

            {nonFavoriteList.length > 0 && (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">All Pokémon</h2>
                <InfiniteScroll
                  dataLength={displayedPokemon.length}
                  next={loadMorePokemon}
                  hasMore={hasMore}
                  loader={
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-gray-600">Loading more Pokémon...</p>
                    </div>
                  }
                  endMessage={
                    <div className="text-center py-8">
                      <p className="text-gray-500 font-medium">That's all folks! 🎬</p>
                    </div>
                  }
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {displayedPokemon.map((pokemon) => {
                      const pokemonId = getPokemonId(pokemon.url);
                      return (
                        <PokemonCard
                          key={pokemon.name}
                          pokemon={pokemon}
                          pokemonId={pokemonId}
                          onClick={() => router.push(`/pokemon/${pokemonId}`)}
                        />
                      );
                    })}
                  </div>
                </InfiniteScroll>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Pokedex;