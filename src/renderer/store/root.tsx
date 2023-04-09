import { combineReducers } from '@reduxjs/toolkit';
import connectionReducer from './connection';

const rootReducer = combineReducers({
  [connectionReducer.name]: connectionReducer.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
