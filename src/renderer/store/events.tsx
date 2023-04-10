import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { notifications } from '@mantine/notifications';

interface EventsState {
  eventDetail: string;
  events: Record<string, any[]>;
}

const initialState = {
  eventDetail: '',
  events: {},
} as EventsState;
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEventDetail(state, action: PayloadAction<string>) {
      state.eventDetail = action.payload;
    },
    addEvent(state, action: PayloadAction<[string, any]>) {
      if (!state.events[action.payload[0]]) {
        state.events[action.payload[0]] = [];
      }
      state.events[action.payload[0]].push(action.payload[1]);
    },
  },
  extraReducers: (builder) => {},
});

export const { setEventDetail, addEvent } = eventsSlice.actions;

export const eventsSelector = (state: { events: EventsState }) => state.events;

export const eventTypesSelector = (state: { events: EventsState }) => {
  return Object.keys(state.events.events).map((eType) => ({
    type: eType,
    count: state.events.events[eType].length,
  }));
};

export default eventsSlice;
