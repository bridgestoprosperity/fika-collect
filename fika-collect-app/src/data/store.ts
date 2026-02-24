import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import announcementsReducer from '../features/announcements';
import localizationReducer from '../features/localization';
import userInfoReducer from '../features/userInfo';

export const store = configureStore({
  reducer: {
    announcements: announcementsReducer,
    localization: localizationReducer,
    userInfo: userInfoReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const wares = getDefaultMiddleware();
    if (__DEV__) {
      wares.push(logger);
    }
    return wares;
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
