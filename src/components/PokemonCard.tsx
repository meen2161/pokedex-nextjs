import Image from "next/image";
import { FC, useState } from "react";
import { usePokemonDetail } from "@/src/hooks/usePokemon";
import { PokemonResult } from "@/src/types/pokemon";
import { useFavoriteStore } from "@/src/store/useFavoriteStore";

interface PokemonCardProps {
  pokemon: PokemonResult;
  pokemonId: number;
  onClick: () => void;
}

const PokemonCard: FC<PokemonCardProps> = ({ pokemon, pokemonId, onClick }) => {
  const { data: pokemonDetail, isLoading, error } = usePokemonDetail(pokemonId);
  const [imageError, setImageError] = useState(false);
  const { favorites, toggleFavorite } = useFavoriteStore();
  const isFavorite = favorites.includes(pokemonId);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(pokemonId);
  };

  const formatPokemonName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
  };

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

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-100 relative group"
    >
      <button
        onClick={handleFavoriteClick}
        className="absolute top-2 right-2 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isFavorite ? "#fbbf24" : "none"}
          stroke={isFavorite ? "#fbbf24" : "#9ca3af"}
          strokeWidth="2"
          className={`w-6 h-6 transition-transform duration-200 ${isFavorite ? 'scale-110' : 'hover:scale-110'}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>

      </button>

      <div className="p-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            {isLoading ? (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : error ? (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl text-red-500">!</span>
              </div>
            ) : pokemonDetail && !imageError ? (
              <Image
                src={pokemonDetail.sprites.front_default || ''}
                alt={pokemon.name}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-2xl">?</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 mb-1">
            #{pokemonId.toString().padStart(3, '0')}
          </div>

          <h3 className="font-semibold text-gray-800 mb-2"
            style={{ fontSize: '18px' }}>
            {formatPokemonName(pokemon.name)}
          </h3>

          {pokemonDetail && !error && (
            <div className="flex flex-wrap gap-1 justify-center">
              {pokemonDetail.types.map((typeInfo) => (
                <span
                  key={typeInfo.type.name}
                  className={`px-2 py-1 rounded-full text-white ${getTypeColor(typeInfo.type.name)}`}
                  style={{ fontSize: '14px' }}
                >
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;