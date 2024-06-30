export interface MovieData {
  adult: boolean;
  backdrop_path: string;
  genre_ids: Array<number>;
  genre_names: Array<string>;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ApiData {
  page: number;
  total_pages: number;
  total_results: number;
  results: MovieData[];
}

export interface Genres {
  id: number;
  name: string;
}

export interface MovieSections {
  year: number;
  data: MovieData[];
}
