import { createSlice } from '@reduxjs/toolkit';
import { MMKVLoader } from 'react-native-mmkv-storage';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

const userInfoStorage = new MMKVLoader()
  .withInstanceID('userInfo')
  .initialize();

interface UserInfoState {
  userId: string;
  consentAccepted: boolean;
}

let storedUserId = userInfoStorage.getString('userId');
if (!storedUserId) {
  storedUserId = nanoid(8);
  userInfoStorage.setString('userId', storedUserId);
}

const initialState: UserInfoState = {
  userId: storedUserId,
  consentAccepted: userInfoStorage.getBool('contentAccepted') || false,
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      userInfoStorage.setString('userId', state.userId || '');
    },
    assignRandomUserId: (state) => {
      if (!state.userId) {
        const newUserId = nanoid(8);
        state.userId = newUserId;
        userInfoStorage.setString('userId', newUserId);
      }
      state.consentAccepted = true;
      userInfoStorage.setBool('contentAccepted', true);
    }
  },
});

export const { setUserId, assignRandomUserId } = userInfoSlice.actions;

export default userInfoSlice.reducer;
