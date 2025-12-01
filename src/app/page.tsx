"use client";

import Image from "next/image";
import { FC } from "react";
import { useRouter } from "next/navigation";

const Home: FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            PokéDex
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Discover and explore the world of Pokémon
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto border border-gray-100">
          <div className="flex justify-center mb-1">
            <Image
              src="/pokeball.png"
              alt="Pokeball"
              width={160}
              height={160}
              priority
            />
          </div>

          <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold 
          py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg 
          hover:shadow-xl transform hover:scale-105 cursor-pointer"
            onClick={() => router.push('/pokedex')}
          >
            Start Exploring
          </button>
        </div>

        <div className="p-2 text-gray-600 font-medium">
          By REDLION01
        </div>
      </div>
    </div>
  );
}

export default Home;