
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Provider } from 'react-redux';
import { RootState, store, AppDispatch } from '../store/store';
import { useDispatch } from 'react-redux';
import { fetchContent, fetchTrending, setSearchQuery, toggleFavorite, reorderContent } from '../store/slices/contentSlice';
import { DashboardLayout } from '../components/DashboardLayout';
import { ContentGrid } from '../components/ContentGrid';
import { useDebounce } from '../hooks/useDebounce';
import { toast } from '@/hooks/use-toast';

const DashboardContent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentSection, setCurrentSection] = useState<'feed' | 'trending' | 'favorites'>('feed');
  const [searchInput, setSearchInput] = useState('');
  
  const debouncedSearchQuery = useDebounce(searchInput, 300);
  
  const { 
    items, 
    filteredItems, 
    favorites, 
    trending, 
    loading, 
    error, 
    searchQuery,
    hasMore 
  } = useSelector((state: RootState) => state.content);
  
  const { preferences } = useSelector((state: RootState) => state.user);

  // Update search query in store when debounced value changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, searchQuery, dispatch]);

  // Fetch initial content
  useEffect(() => {
    console.log('Fetching initial content with preferences:', preferences.categories);
    dispatch(fetchContent({ categories: preferences.categories, page: 1 }));
    dispatch(fetchTrending());
  }, [dispatch, preferences.categories]);

  // Show success toast when preferences change
  useEffect(() => {
    if (preferences.categories.length > 0) {
      toast({
        title: "Preferences Updated",
        description: `Now showing content for: ${preferences.categories.join(', ')}`,
      });
    }
  }, [preferences.categories]);

  const handleToggleFavorite = useCallback((id: string) => {
    dispatch(toggleFavorite(id));
    const item = items.find(item => item.id === id);
    if (item) {
      toast({
        title: item.isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: item.title,
      });
    }
  }, [dispatch, items]);

  const handleReorder = useCallback((startIndex: number, endIndex: number) => {
    dispatch(reorderContent({ startIndex, endIndex }));
    toast({
      title: "Content Reordered",
      description: "Your content has been reorganized",
    });
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchContent({ categories: preferences.categories, page: 2 }));
    }
  }, [dispatch, loading, hasMore, preferences.categories]);

  const getCurrentItems = () => {
    switch (currentSection) {
      case 'trending':
        return trending;
      case 'favorites':
        return favorites;
      default:
        return searchQuery ? filteredItems : items;
    }
  };

  const getCurrentTitle = () => {
    switch (currentSection) {
      case 'trending':
        return 'Trending Content';
      case 'favorites':
        return 'Your Favorites';
      default:
        return searchQuery ? `Search Results for "${searchQuery}"` : 'Your Personalized Feed';
    }
  };

  const getEmptyMessage = () => {
    switch (currentSection) {
      case 'trending':
        return 'No trending content available';
      case 'favorites':
        return 'No favorites yet. Heart some content to see it here!';
      default:
        return searchQuery 
          ? `No results found for "${searchQuery}"`
          : 'No content available. Try adjusting your preferences.';
    }
  };

  const currentItems = getCurrentItems();

  return (
    <DashboardLayout
      searchQuery={searchInput}
      onSearchChange={setSearchInput}
      currentSection={currentSection}
      onSectionChange={setCurrentSection}
    >
      <ContentGrid
        items={currentItems}
        loading={loading}
        error={error}
        onToggleFavorite={handleToggleFavorite}
        onReorder={handleReorder}
        onLoadMore={currentSection === 'feed' ? handleLoadMore : undefined}
        hasMore={currentSection === 'feed' ? hasMore : false}
        title={getCurrentTitle()}
        emptyMessage={getEmptyMessage()}
      />
    </DashboardLayout>
  );
};

const Index = () => {
  return (
    <Provider store={store}>
      <DashboardContent />
    </Provider>
  );
};

export default Index;
