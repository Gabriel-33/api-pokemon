export interface Pokemon {
  id: number;
  name: string;
  codigo: string;
  imageUrl: string;
  types: string[];
  isFav: boolean;
  isTeamBattle: boolean;
}

export interface PokemonGeneration {
  geracao: {
    id: number;
    name: string;
    regiao_principal: string;
    total_pokemons: number;
  };
  pokemons: Pokemon[];
}

export interface User {
  id?: number;
  email: string;
  nome?: string;
  login?: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  login: string;
  email: string;
  senha: string;
}