import { createSlice } from '@reduxjs/toolkit';
import { MMKVLoader } from 'react-native-mmkv-storage';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
import apiFetch from '../util/fetch';
import { createAsyncThunk } from '@reduxjs/toolkit';

const userInfoStorage = new MMKVLoader()
  .withInstanceID('userInfo')
  .initialize();

interface UserInfoState {
  userId: string;
  terms: string;
  termsAccepted: boolean;
  termAcceptanceSubmitted?: boolean;
}

let storedUserId = userInfoStorage.getString('userId');
if (!storedUserId) {
  storedUserId = nanoid(8);
  userInfoStorage.setString('userId', storedUserId);
}

const initialState: UserInfoState = {
  userId: storedUserId,
  terms: userInfoStorage.getString('terms') || '',
  termsAccepted: userInfoStorage.getBool('termsAccepted') || false,
  termAcceptanceSubmitted: userInfoStorage.getBool('termAcceptanceSubmitted') || false,
};

const postConsent = createAsyncThunk('postConsent', async ({ consentText }: { consentText: string }, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { userInfo: UserInfoState };
    const { userId } = state.userInfo;
    userInfoStorage.setString('terms', consentText);
    const response = await apiFetch('consent', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        consent_text: consentText,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return rejectWithValue(response.statusText);
    }
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : String(error));
  }
});

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postConsent.pending, (state, { meta: { arg: { consentText } } }) => {
      if (!state.userId) {
        const newUserId = nanoid(8);
        state.userId = newUserId;
        userInfoStorage.setString('userId', newUserId);
      }

      state.terms = consentText;
      userInfoStorage.setString('terms', consentText);

      state.termsAccepted = true;
      userInfoStorage.setBool('termsAccepted', true);

      state.termAcceptanceSubmitted = false;
      userInfoStorage.setBool('termAcceptanceSubmitted', false);
    });
    builder.addCase(postConsent.fulfilled, (state) => {
      state.termAcceptanceSubmitted = true;
      userInfoStorage.setBool('termAcceptanceSubmitted', true);
    });
    builder.addCase(postConsent.rejected, (state, action) => {
      console.error('Failed to submit consent:', action);
    });
  },
});

export { postConsent };

export default userInfoSlice.reducer;
