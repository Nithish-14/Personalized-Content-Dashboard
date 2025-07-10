
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  autoRefresh: boolean;
  notificationsEnabled: boolean;
}

interface UserState {
  preferences: UserPreferences;
  isSettingsOpen: boolean;
}

const defaultPreferences: UserPreferences = {
  categories: ['technology', 'business', 'entertainment'],
  darkMode: false,
  autoRefresh: true,
  notificationsEnabled: true,
};

// Load preferences from localStorage
const loadPreferences = (): UserPreferences => {
  try {
    const saved = localStorage.getItem('userPreferences');
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
};

const initialState: UserState = {
  preferences: loadPreferences(),
  isSettingsOpen: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const categories = [...state.preferences.categories];
      const index = categories.indexOf(category);
      
      if (index > -1) {
        categories.splice(index, 1);
      } else {
        categories.push(category);
      }
      
      state.preferences.categories = categories;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
    },
    toggleDarkMode: (state) => {
      state.preferences.darkMode = !state.preferences.darkMode;
      localStorage.setItem('userPreferences', JSON.stringify(state.preferences));
      
      // Apply dark mode to document
      if (state.preferences.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.isSettingsOpen = action.payload;
    },
  },
});

export const { updatePreferences, toggleCategory, toggleDarkMode, setSettingsOpen } = userSlice.actions;
export default userSlice.reducer;
