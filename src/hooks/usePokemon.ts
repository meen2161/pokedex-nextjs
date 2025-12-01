import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  PokemonResult,
  PokemonListResponse,
  PokemonDetail
} from '@/src/types/pokemon';

const api = axios.create({
  baseURL: 'https://pokeapi.co/api/v2',
  timeout: 10000,
});

export const usePokemonList = () => {
  return useQuery({
    queryKey: ['pokemon', 'list'],
    queryFn: async (): Promise<PokemonResult[]> => {
      const { data } = await api.get<PokemonListResponse>('/pokemon?offset=0&limit=1025');
      return data.results;
    },
    staleTime: 10 * 60 * 1000, //10 min
    gcTime: 30 * 60 * 1000, //30 min
  });
};

export const usePokemonDetail = (pokemonId: number) => {
  return useQuery({
    queryKey: ['pokemon', 'detail', pokemonId],
    queryFn: async (): Promise<PokemonDetail> => {
      const { data } = await api.get<PokemonDetail>(`/pokemon/${pokemonId}`);
      return data;
    },
    enabled: !!pokemonId,
    staleTime: 30 * 60 * 1000, //30 min
    gcTime: 60 * 60 * 1000, //1 hour
  });
};

export const usePokemonInfinite = (itemsPerPage: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['pokemon', 'infinite', itemsPerPage],
    queryFn: async ({ pageParam }: { pageParam: number }): Promise<{
      results: PokemonResult[];
      nextPage: number | undefined;
    }> => {
      const offset = pageParam * itemsPerPage;
      const { data } = await api.get<PokemonListResponse>(`/pokemon?offset=${offset}&limit=${itemsPerPage}`);

      return {
        results: data.results,
        nextPage: data.next ? pageParam + 1 : undefined,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 10 * 60 * 1000, //10 min
  });
};

api.interceptors.request.use((config) => {
  console.log('Request sent:', config.url);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);