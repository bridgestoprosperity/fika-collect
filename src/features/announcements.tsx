import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from '../data/store';
import {MMKVLoader} from 'react-native-mmkv-storage';

const announcementsStorage = new MMKVLoader()
  .withInstanceID('announcements')
  .initialize();

interface Announcement {
  id: string;
  title: string;
  body: string;
  url?: string;
}

interface AnnouncementsState {
  announcements: Announcement[];
  dismissedIds: string[];
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AnnouncementsState = {
  announcements: [],
  dismissedIds: announcementsStorage.getArray('dismissedIds') || [],
  status: 'idle',
};

export const fetchAnnouncements = createAsyncThunk<
  Announcement[],
  void,
  {state: RootState}
>('announcements/fetchAnnouncements', async _ => {
  const response = await fetch(
    'https://fika-collect.s3.us-west-1.amazonaws.com/announcements/announcements.json',
  );
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const result = await response.json();
  console.log('Fetched announcements:', result);
  return result.announcements;
});

export const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    dismissAnnouncement: (state, action) => {
      if (state.dismissedIds.includes(action.payload)) return;
      state.dismissedIds.push(action.payload);
      announcementsStorage.setArray('dismissedIds', state.dismissedIds);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAnnouncements.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchAnnouncements.rejected, state => {
        state.status = 'failed';
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        const existingIds = new Set(state.announcements.map(({id}) => id));
        for (const announcement of action.payload) {
          if (existingIds.has(announcement.id)) continue;
          state.announcements.push(announcement);
        }
        state.status = 'idle';
      });
  },
});

export const {dismissAnnouncement} = announcementsSlice.actions;

export const selectAnnouncements = (state: RootState) => {
  return state.announcements.announcements;
};
export const selectDismissedIds = (state: RootState) => {
  return state.announcements.dismissedIds;
};

export default announcementsSlice.reducer;
