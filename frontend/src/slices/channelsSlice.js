import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { actions as modalActions } from './modalSlice.js';

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState({ currentChannel: 1, actionChannelId: null });
const { closeModal } = modalActions;

const channelsSlice = createSlice({
  name: 'channelsSlice',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    removeChannel: channelsAdapter.removeOne,
    renameChannel: channelsAdapter.updateOne,
    changeCurrentChannel(state, { payload }) {
      console.log(payload);
      // eslint-disable-next-line no-param-reassign
      state.currentChannel = payload;
    },
    changeActionChannelId(state, { payload }) {
      // eslint-disable-next-line no-param-reassign
      state.actionChannelId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(closeModal, (state) => {
      // eslint-disable-next-line no-param-reassign
      state.actionChannelId = null;
    });
  },
});

export default channelsSlice.reducer;
export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
