import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import announcementsReducer from '../features/announcements';
import localizationReducer from '../features/localization';

export const store = configureStore({
  reducer: {
    announcements: announcementsReducer,
    localization: localizationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
