import { notifications } from '@mantine/notifications';

// eslint-disable-next-line no-shadow
export enum ChannelTypes {
  IPCExample = 'ipc - example',
  NatsConnectHost = 'nats-connect-host',
  NatsSubscribe = 'nats-subscribe',
  NatsSubscribed = 'nats-subscribed',
  NatsUnsubscribe = 'nats-unsubscribe',
  NatsUnsubscribed = 'nats-unsubscribed',
  NatsAllUnsubscribed = 'nats-all-unsubscribed',
  NatsConnected = 'nats-connected',
  NatsEvent = 'nats-event',
}

export default () => {
  window.electron.ipcRenderer.once(ChannelTypes.IPCExample, (arg) => {});

  window.electron.ipcRenderer.on(ChannelTypes.NatsEvent, (arg) => {});

  window.electron.ipcRenderer.on(ChannelTypes.NatsConnected, (arg) => {
    notifications.show({
      variant: 'info',
      title: 'Nats connected',
      message: '',
    });
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsSubscribed, (arg) => {
    notifications.show({
      variant: 'info',
      title: `Subscribed to ${(arg as string[])[0]}`,
      message: '',
    });
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsUnsubscribed, (arg) => {
    notifications.show({
      variant: 'info',
      title: `Unsubscribed from ${(arg as string[])[0]}`,
      message: '',
    });
  });

  window.electron.ipcRenderer.on(ChannelTypes.NatsAllUnsubscribed, (arg) => {
    notifications.show({
      variant: 'info',
      title: 'All subscriptions cleared',
      message: '',
    });
  });
};

export const connectNats = (host: string) => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsConnectHost, [host]);
};

export const subscribeNats = (event: string) => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsSubscribe, [event]);
};

export const unsubscribeNats = () => {
  window.electron.ipcRenderer.sendMessage(ChannelTypes.NatsUnsubscribe, []);
};
