
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Bell, BellOff, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleCategory, toggleDarkMode, updatePreferences, setSettingsOpen } from '../store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const availableCategories = [
  'technology',
  'business', 
  'entertainment',
  'sports',
  'science',
  'health',
  'politics'
];

export const SettingsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { preferences, isSettingsOpen } = useSelector((state: RootState) => state.user);

  const handleCategoryToggle = (category: string) => {
    dispatch(toggleCategory(category));
  };

  const handleToggleSwitch = (key: keyof typeof preferences, value: boolean) => {
    if (key === 'darkMode') {
      dispatch(toggleDarkMode());
    } else {
      dispatch(updatePreferences({ [key]: value }));
    }
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => dispatch(setSettingsOpen(false))}
          />
          
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto"
          >
            <Card className="h-full border-0 rounded-none">
              <CardHeader className="border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl dark:text-white">Settings</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(setSettingsOpen(false))}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                {/* Content Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">Content Preferences</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select categories you're interested in
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {availableCategories.map((category) => (
                      <Badge
                        key={category}
                        variant={preferences.categories.includes(category) ? "default" : "outline"}
                        className={`cursor-pointer capitalize transition-colors ${
                          preferences.categories.includes(category)
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Appearance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">Appearance</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {preferences.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      <span className="dark:text-white">Dark Mode</span>
                    </div>
                    <Switch
                      checked={preferences.darkMode}
                      onCheckedChange={() => handleToggleSwitch('darkMode', !preferences.darkMode)}
                    />
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {preferences.notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      <span className="dark:text-white">Enable Notifications</span>
                    </div>
                    <Switch
                      checked={preferences.notificationsEnabled}
                      onCheckedChange={(checked) => handleToggleSwitch('notificationsEnabled', checked)}
                    />
                  </div>
                </div>

                {/* Auto Refresh */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold dark:text-white">Content Updates</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      <span className="dark:text-white">Auto Refresh</span>
                    </div>
                    <Switch
                      checked={preferences.autoRefresh}
                      onCheckedChange={(checked) => handleToggleSwitch('autoRefresh', checked)}
                    />
                  </div>
                </div>

                {/* Applied Categories Display */}
                <div className="pt-4 border-t dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Currently tracking: {preferences.categories.length} categories
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {preferences.categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs capitalize">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
