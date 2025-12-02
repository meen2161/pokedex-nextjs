"use client";

import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/navigation";

const Home: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-2">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            PokéDex
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Discover and explore the world of Pokémon
          </p>
        </div>

        <div className="p-0 max-w-md mx-auto">
          <div className="flex justify-center mb-1">
            <Image
              src="/pokeball.png"
              alt="Pokeball"
              width={160}
              height={160}
              priority
            />
          </div>

          <div className="flex gap-4 w-full">
            <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold 
            py-4 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg 
            hover:shadow-xl transform hover:scale-105 cursor-pointer whitespace-nowrap"
              onClick={() => router.push('/pokedex')}
            >
              Start Exploring
            </button>

            <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold 
            py-4 px-4 rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-300 shadow-lg 
            hover:shadow-xl transform hover:scale-105 cursor-pointer whitespace-nowrap"
              onClick={() => router.push('/teambuilder')}
            >
              Team building
            </button>
          </div>

          <div className="p-2 text-gray-600 font-medium">
            By REDLION01
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;