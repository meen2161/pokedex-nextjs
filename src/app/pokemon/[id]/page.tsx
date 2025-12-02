"use client";

import { FC, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { usePokemonDetail } from "@/src/hooks/usePokemon";

const PokemonDetail: FC = () => {
  const params = useParams();
  const router = useRouter();
  const pokemonId = parseInt(params.id as string);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: pokemon, isLoading, error } = usePokemonDetail(pokemonId);

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
      ice: 'bg-blue-300',
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

  const getTypeBgGradient = (type: string): string => {
    const gradients: { [key: string]: string } = {
      normal: 'from-gray-400 to-gray-500',
      fire: 'from-red-500 to-orange-500',
      water: 'from-blue-500 to-blue-600',
      electric: 'from-yellow-400 to-yellow-500',
      grass: 'from-green-500 to-green-600',
      ice: 'from-blue-300 to-blue-400',
      fighting: 'from-red-700 to-red-800',
      poison: 'from-purple-500 to-purple-600',
      ground: 'from-yellow-600 to-yellow-700',
      flying: 'from-indigo-400 to-indigo-500',
      psychic: 'from-pink-500 to-pink-600',
      bug: 'from-green-400 to-green-500',
      rock: 'from-yellow-800 to-yellow-900',
      ghost: 'from-purple-700 to-purple-800',
      dragon: 'from-indigo-700 to-indigo-800',
      dark: 'from-gray-800 to-gray-900',
      steel: 'from-gray-500 to-gray-600',
      fairy: 'from-pink-300 to-pink-400',
    };
    return gradients[type] || 'from-gray-400 to-gray-500';
  };

  const getStatColor = (statValue: number): string => {
    if (statValue >= 100) return 'bg-green-500';
    if (statValue >= 80) return 'bg-yellow-500';
    if (statValue >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatWidth = (statValue: number): string => {
    const percentage = Math.min((statValue / 150) * 100, 100);
    return `${percentage}%`;
  };

  const handlePlaySound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Pokémon details...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Failed to load Pokémon details</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const bgGradient = getTypeBgGradient(mainType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {formatPokemonName(pokemon.name)}
            </h1>
            <span className="text-lg text-gray-500" style={{ fontSize: '22px' }}>
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">

          <div className={`bg-gradient-to-br ${bgGradient} rounded-3xl p-8 text-white shadow-2xl`}>
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <Image
                  src={pokemon.sprites.front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  fill
                  sizes="256px"
                  className="object-contain drop-shadow-2xl"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {pokemon.types.map((typeInfo) => (
                    <span
                      key={typeInfo.type.name}
                      className={`px-4 py-2 ${getTypeColor(typeInfo.type.name)} rounded-full 
                        text-white font-medium shadow-lg border-2 border-white border-opacity-50`}
                    >
                      {typeInfo.type.name.toUpperCase()}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
                    <p className="text-gray-900 text-opacity-80 text-sm">Height</p>
                    <p className="text-gray-700 text-2xl">{(pokemon.height / 10).toFixed(1)} m</p>
                  </div>
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
                    <p className="text-gray-900 text-opacity-80 text-sm">Weight</p>
                    <p className="text-gray-700 text-2xl">{(pokemon.weight / 10).toFixed(1)} kg</p>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
                  <p className="text-gray-900 text-opacity-80 text-sm">Base Experience</p>
                  <p className="text-gray-700 text-2xl">{pokemon.base_experience}</p>
                </div>

                {pokemon.cries && pokemon.cries.latest && (
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
                    <p className="text-gray-900 text-opacity-80 text-sm mb-3">Pokémon Sound</p>
                    <button
                      onClick={handlePlaySound}
                      className="w-full bg-white bg-opacity-30 hover:bg-opacity-40 backdrop-blur-sm 
                        rounded-lg p-3 transition-all duration-200 flex items-center justify-center gap-2
                        border border-white border-opacity-50"
                    >
                      {isPlaying ? (
                        <>
                          <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                          <span className="text-gray-900 font-medium">Stop</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span className="text-gray-900 font-medium">Play Sound</span>
                        </>
                      )}
                    </button>
                    <audio
                      ref={audioRef}
                      src={pokemon.cries.latest}
                      onEnded={handleAudioEnded}
                      preload="metadata"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Base Stats
              </h2>
              <div className="space-y-4">
                {pokemon.stats.map((stat) => (
                  <div key={stat.stat.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 capitalize"
                        style={{ fontSize: '18px' }}>
                        {stat.stat.name.replace('-', ' ')}
                      </span>
                      <span className="text-sm text-gray-800"
                        style={{ fontSize: '18px' }}>
                        {stat.base_stat}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-none h-3">
                      <div
                        className={`h-3 rounded-none transition-all duration-500 ${getStatColor(stat.base_stat)}`}
                        style={{ width: getStatWidth(stat.base_stat) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Abilities</h2>
              <div className="space-y-3">
                {pokemon.abilities.map((abilityInfo) => (
                  <div
                    key={abilityInfo.ability.name}
                    className={`p-4 rounded-xl border-2 ${abilityInfo.is_hidden
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-blue-300 bg-blue-50'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800 capitalize">
                        {abilityInfo.ability.name.replace('-', ' ')}
                      </span>
                      {abilityInfo.is_hidden && (
                        <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded-full font-medium">
                          Hidden
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Sprites</h2>
              <div className="grid grid-cols-2 gap-4">
                {pokemon.sprites.front_default && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Image
                      src={pokemon.sprites.front_default}
                      alt={`${pokemon.name} front`}
                      width={96}
                      height={96}
                      className="mx-auto"
                    />
                    <p className="text-sm text-gray-600 mt-2">Front</p>
                  </div>
                )}
                {pokemon.sprites.back_default && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Image
                      src={pokemon.sprites.back_default}
                      alt={`${pokemon.name} back`}
                      width={96}
                      height={96}
                      className="mx-auto"
                    />
                    <p className="text-sm text-gray-600 mt-2">Back</p>
                  </div>
                )}
                {pokemon.sprites.front_shiny && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-yellow-300">
                    <Image
                      src={pokemon.sprites.front_shiny}
                      alt={`${pokemon.name} shiny front`}
                      width={96}
                      height={96}
                      className="mx-auto"
                    />
                    <p className="text-sm text-yellow-800 mt-2 font-medium">Shiny Front ✨</p>
                  </div>
                )}
                {pokemon.sprites.back_shiny && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-yellow-300">
                    <Image
                      src={pokemon.sprites.back_shiny}
                      alt={`${pokemon.name} shiny back`}
                      width={96}
                      height={96}
                      className="mx-auto"
                    />
                    <p className="text-sm text-yellow-800 mt-2 font-medium">Shiny Back ✨</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;