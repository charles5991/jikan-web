const BASE_URL = 'https://api.jikan.moe/v4';

export interface AnimeSearchResult {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  approved: boolean;
  titles: {
    type: string;
    title: string;
  }[];
  title: string;
  title_english: string;
  title_japanese: string;
  title_synonyms: string[];
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
    prop: {
      from: {
        day: number;
        month: number;
        year: number;
      };
      to: {
        day: number;
        month: number;
        year: number;
      };
    };
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string;
  season: string;
  year: number;
  genres: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
  studios: {
    mal_id: number;
    type: string;
    name: string;
    url: string;
  }[];
}

export interface AnimeDetailsResult {
  data: Anime;
}

export const searchAnime = async (query: string, page: number = 1): Promise<AnimeSearchResult> => {
  const url = `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${page}&sfw=true`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return searchAnime(query, page);
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};

// Function to get anime details by ID
export const getAnimeDetails = async (id: number): Promise<AnimeDetailsResult> => {
  const url = `${BASE_URL}/anime/${id}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getAnimeDetails(id);
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting anime details:', error);
    throw error;
  }
};

export const getPopularAnime = async (page: number = 1): Promise<AnimeSearchResult> => {
  const url = `${BASE_URL}/top/anime?page=${page}&filter=bypopularity&limit=24`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getPopularAnime(page);
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting popular anime:', error);
    throw error;
  }
};

export const getSearchSuggestions = async (query: string): Promise<AnimeSearchResult> => {
  if (!query.trim()) {
    return {
      data: [],
      pagination: {
        last_visible_page: 0,
        has_next_page: false,
        current_page: 0,
        items: {
          count: 0,
          total: 0,
          per_page: 0,
        },
      },
    };
  }
  
  const url = `${BASE_URL}/anime?q=${encodeURIComponent(query)}&page=1&limit=10&sfw=true`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getSearchSuggestions(query);
      }
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    throw error;
  }
};

export const getTrendingSearchTerms = (): string[] => {
  return [
    "One Piece",
    "Attack on Titan",
    "Demon Slayer",
    "My Hero Academia",
    "Jujutsu Kaisen",
    "Naruto",
    "Dragon Ball",
    "Bleach",
    "Chainsaw Man",
    "Death Note"
  ];
}; 