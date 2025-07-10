
import { configureStore } from '@reduxjs/toolkit';
import contentReducer from './slices/contentSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
