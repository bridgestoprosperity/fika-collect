import { createSlice } from '@reduxjs/toolkit';
import { MMKVLoader } from 'react-native-mmkv-storage';
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

const userInfoStorage = new MMKVLoader()
  .withInstanceID('userInfo')
  .initialize();

interface UserInfoState {
  userId: string;
}

let storedUserId = userInfoStorage.getString('userId');
if (!storedUserId) {
  storedUserId = nanoid(8);
  userInfoStorage.setString('userId', storedUserId);
}

const initialState: UserInfoState = {
  userId: storedUserId,
};

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
      userInfoStorage.setString('userId', state.userId || '');
    },
  },
});

export const { setUserId } = userInfoSlice.actions;

export default userInfoSlice.reducer;
