import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { notifications } from '@mantine/notifications';
import { RootState } from './root';

// eslint-disable-next-line no-shadow
export enum ConnectionStates {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
}

// eslint-disable-next-line no-shadow
export enum LogColors {
  Error = 'red',
  Warn = 'orange',
  Info = 'blue',
  Debug = 'grey',
}

interface ConnectionState {
  state: ConnectionStates;
  subscriptions: string[];
  error: any;
}

const initialState = {
  state: ConnectionStates.Disconnected,
  subscriptions: [],
  error: null,
} as ConnectionState;

const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    addSubscription(state, action: PayloadAction<string>) {
      if (state.subscriptions.indexOf(action.payload) === -1) {
        state.subscriptions.push(action.payload);
        notifications.show({
          color: LogColors.Info,
          title: `Subscribed to ${action.payload}`,
          message: '',
        });
      }
    },
    removeSubscription(state, action: PayloadAction<string>) {
      const index = state.subscriptions.indexOf(action.payload);
      if (index !== -1) {
        state.subscriptions.splice(index, 1);
        notifications.show({
          color: LogColors.Info,
          title: `Unsubscribed from ${action.payload}`,
          message: '',
        });
      }
    },
    setError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      notifications.show({
        color: LogColors.Error,
        title: `Nats error`,
        message: action.payload,
      });
    },
    changeState(state, action: PayloadAction<ConnectionStates>) {
      state.state = action.payload;
      switch (action.payload as ConnectionStates) {
        case ConnectionStates.Connected:
          notifications.show({
            color: LogColors.Info,
            title: 'Nats connected',
            message: '',
          });
          break;

        case ConnectionStates.Disconnected:
          notifications.show({
            color: LogColors.Info,
            title: 'Nats disconnected',
            message: '',
          });
          break;

        default:
      }
    },
  },
  extraReducers: (builder) => {},
});

export const { changeState, setError, addSubscription, removeSubscription } =
  connectionSlice.actions;

export const connectionSelector = (state: RootState) => state.connection;

export default connectionSlice;
