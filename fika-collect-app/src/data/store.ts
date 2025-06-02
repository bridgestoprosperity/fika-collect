import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import announcementsReducer from '../features/announcements';
import localizationReducer from '../features/localization';
import userInfoReducer from '../features/userInfo';

export const store = configureStore({
  reducer: {
    announcements: announcementsReducer,
    localization: localizationReducer,
    userInfo: userInfoReducer,
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
