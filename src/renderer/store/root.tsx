import { combineReducers } from '@reduxjs/toolkit';
import connectionSlice from './connection';
import eventsSlice from './events';

const rootReducer = combineReducers({
  [connectionSlice.name]: connectionSlice.reducer,
  [eventsSlice.name]: eventsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
