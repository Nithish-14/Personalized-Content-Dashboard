import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  category: string;
  publishedAt: string;
  isFavorite: boolean;
  author?: string;
  rating?: number;
}

interface ContentState {
  items: ContentItem[];
  filteredItems: ContentItem[];
  favorites: ContentItem[];
  trending: ContentItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  hasMore: boolean;
}

const initialState: ContentState = {
  items: [],
  filteredItems: [],
  favorites: [],
  trending: [],
  loading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  hasMore: true,
};

// const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (params: { categories: string[]; page: number }) => {
    const newsData: ContentItem[] = [];
    const movieData: ContentItem[] = [];
    const socialData: ContentItem[] = [];

    for (const category of params.categories) {
      // const res = await axios.get(
      //   `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${NEWS_API_KEY}&pageSize=5&page=${params.page}&country=us`
      // );
      const res = await axios.get(
        `${import.meta.env.VITE_NEWS_PROXY_URL}?category=${category}&page=${params.page}`
      );

      const articles = res.data.articles.map((article: any, i: number) => ({
        id: `news-${category}-${params.page}-${i}`,
        type: 'news',
        title: article.title,
        description: article.description || '',
        imageUrl: article.urlToImage,
        url: article.url,
        category,
        publishedAt: article.publishedAt,
        isFavorite: false,
        author: article.author,
      }));
      newsData.push(...articles);
    }

    const omdbSearchTerms = ['Batman', 'Avengers', 'Matrix'];
    const movieSearchTerm = omdbSearchTerms[Math.floor(Math.random() * omdbSearchTerms.length)];
    const movieRes = await axios.get(
      `https://www.omdbapi.com/?s=${movieSearchTerm}&apikey=${OMDB_API_KEY}&page=${params.page}`
    );
    if (movieRes.data.Search) {
      movieData.push(
        ...movieRes.data.Search.map((movie: any, i: number) => ({
          id: `movie-${movie.imdbID}`,
          type: 'movie',
          title: movie.Title,
          description: `Year: ${movie.Year}`,
          imageUrl: movie.Poster !== 'N/A' ? movie.Poster : '',
          category: 'entertainment',
          publishedAt: new Date().toISOString(),
          isFavorite: false,
          rating: undefined,
        }))
      );
    }

    for (let i = 0; i < 5; i++) {
      socialData.push({
        id: `social-${params.page}-${i}`,
        type: 'social',
        title: `#update - Social Post ${i + 1}`,
        description: `Social media content update #${i + 1}`,
        imageUrl: `https://picsum.photos/400/300?random=${params.page * 10 + i + 200}`,
        category: 'social',
        publishedAt: new Date().toISOString(),
        isFavorite: false,
        author: `@user${i + 1}`,
      });
    }

    const allContent = [...newsData, ...movieData, ...socialData];
    return allContent.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
);

export const fetchTrending = createAsyncThunk(
  'content/fetchTrending',
  async () => {
    const trendingData: ContentItem[] = [];

    // const newsRes = await axios.get(
    //   `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&country=us&pageSize=15`
    // );
    const newsRes = await axios.get(
      `${import.meta.env.VITE_NEWS_PROXY_URL}`
    );

    const trendingNews = newsRes.data.articles.map((article: any, i: number) => ({
      id: `trending-news-${i}`,
      type: 'news',
      title: article.title,
      description: article.description || '',
      imageUrl: article.urlToImage,
      url: article.url,
      category: 'news',
      publishedAt: article.publishedAt,
      isFavorite: false,
      author: article.author,
    }));
    trendingData.push(...trendingNews);

    const movieRes = await axios.get(
      `https://www.omdbapi.com/?s=trending&apikey=${OMDB_API_KEY}&page=1`
    );
    if (movieRes.data.Search) {
      trendingData.push(
        ...movieRes.data.Search.slice(0, 3).map((movie: any, i: number) => ({
          id: `trending-movie-${movie.imdbID}`,
          type: 'movie',
          title: movie.Title,
          description: `Year: ${movie.Year}`,
          imageUrl: movie.Poster !== 'N/A' ? movie.Poster : '',
          category: 'entertainment',
          publishedAt: new Date().toISOString(),
          isFavorite: false,
          rating: undefined,
        }))
      );
    }

    return trendingData;
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredItems = action.payload
        ? state.items.filter(item =>
            item.title.toLowerCase().includes(action.payload.toLowerCase()) ||
            item.description.toLowerCase().includes(action.payload.toLowerCase()) ||
            item.category.toLowerCase().includes(action.payload.toLowerCase())
          )
        : state.items;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.isFavorite = !item.isFavorite;
        if (item.isFavorite) {
          if (!state.favorites.find(fav => fav.id === item.id)) {
            state.favorites.push(item);
          }
        } else {
          state.favorites = state.favorites.filter(fav => fav.id !== item.id);
        }
      }
    },
    reorderContent: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const { startIndex, endIndex } = action.payload;
      const items = state.searchQuery ? state.filteredItems : state.items;
      const [reorderedItem] = items.splice(startIndex, 1);
      items.splice(endIndex, 0, reorderedItem);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentPage === 1) {
          state.items = action.payload;
        } else {
          state.items = [...state.items, ...action.payload];
        }
        state.filteredItems = state.searchQuery
          ? state.items.filter(item =>
              item.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
              item.category.toLowerCase().includes(state.searchQuery.toLowerCase())
            )
          : state.items;
        state.hasMore = action.payload.length > 0;
        state.currentPage += 1;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content';
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trending = action.payload;
      });
  },
});

export const { setSearchQuery, toggleFavorite, reorderContent, clearError } = contentSlice.actions;
export default contentSlice.reducer;
