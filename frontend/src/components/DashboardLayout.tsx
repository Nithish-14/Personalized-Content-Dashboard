
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Settings, TrendingUp, Heart, Home, Search as SearchIcon } from 'lucide-react';
import { RootState } from '../store/store';
import { setSettingsOpen } from '../store/slices/userSlice';
import { SearchBar } from './SearchBar';
import { SettingsPanel } from './SettingsPanel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DashboardLayoutProps {
  children: React.ReactNode;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentSection: 'feed' | 'trending' | 'favorites';
  onSectionChange: (section: 'feed' | 'trending' | 'favorites') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  searchQuery,
  onSearchChange,
  currentSection,
  onSectionChange,
}) => {
  const dispatch = useDispatch();
  const { preferences } = useSelector((state: RootState) => state.user);

  // Apply dark mode on component mount
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  const sectionConfig = {
    feed: { icon: Home, label: 'Feed', description: 'Your personalized content' },
    trending: { icon: TrendingUp, label: 'Trending', description: 'What\'s popular now' },
    favorites: { icon: Heart, label: 'Favorites', description: 'Your saved content' },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <SearchIcon className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Content Hub
                </h1>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search across all content..."
              />
            </div>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(setSettingsOpen(true))}
              className="dark:text-white dark:hover:bg-gray-700"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <Card className="mb-8 p-1 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex space-x-1">
            {Object.entries(sectionConfig).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = currentSection === key;
              
              return (
                <Button
                  key={key}
                  variant={isActive ? "default" : "ghost"}
                  className={`flex-1 justify-start gap-2 ${
                    isActive 
                      ? "bg-blue-500 hover:bg-blue-600 text-white" 
                      : "dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onSectionChange(key as 'feed' | 'trending' | 'favorites')}
                >
                  <Icon className="w-4 h-4" />
                  <div className="text-left">
                    <div className="font-medium">{config.label}</div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {config.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Content Area */}
        <main>{children}</main>
      </div>

      {/* Settings Panel */}
      <SettingsPanel />
    </div>
  );
};
