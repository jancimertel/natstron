import { notifications } from '@mantine/notifications';
import { AppDispatch } from './store';
import {
  addSubscription,
  changeState,
  ConnectionStates,
  removeSubscription,
  setError,
} from './store/connection';
import { addEvent } from './store/events';

// eslint-disable-next-line no-shadow
export enum ChannelTypes {
  IPCExample = 'ipc - example',
  NatsConnectHost = 'nats-connect-host',
  NatsDisconnect = 'nats-disconnect',
  NatsDisconnected = 'nats-disconnected',
  NatsSubscribe = 'nats-subscribe',
  NatsSubscribed = 'nats-subscribed',
  NatsUnsubscribe = 'nats-unsubscribe',
  NatsUnsubscribed = 'nats-unsubscribed',
  NatsAllUnsubscribed = 'nats-all-unsubscribed',
  NatsConnected = 'nats-connected',
  NatsError = 'nats-error',
  NatsEvent = 'nats-event',
}

export default (dispatch: AppDispatch) => {
  window.electron.ipcRenderer.once(ChannelTypes.IPCExample, (arg) => {});

  window.electron.ipcRenderer.on(ChannelTypes.NatsEvent, (arg) => {
    let event;
    let data;
    if ((arg as any).length === 2) {
      [event, data] = arg as any;
    }

    console.log(event);

    dispatch(addEvent(arg as [string, any]));
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsConnected, (arg) => {
    dispatch(changeState(ConnectionStates.Connected));
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsDisconnected, (arg) => {
    dispatch(changeState(ConnectionStates.Disconnected));
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsError, (arg) => {
    dispatch(setError(arg));
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsSubscribed, (arg) => {
    dispatch(addSubscription((arg as any)[0]));
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsUnsubscribed, (arg) => {
    dispatch(removeSubscription((arg as any)[0]));
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsAllUnsubscribed, (arg) => {});
};

export const connectNats = (host: string) => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsConnectHost, [host]);
};

export const disconnectNats = () => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsDisconnect, []);
};

export const subscribeNats = (event: string) => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsSubscribe, [event]);
};

export const unsubscribeNats = (event: string) => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsUnsubscribe, [
    event,
  ]);
};

export const unsubscribeNatsAll = () => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsUnsubscribe, []);
};
