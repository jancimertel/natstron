import { IpcMain, IpcMainEvent, WebContents } from 'electron';
import {
  Codec,
  connect as libConnect,
  NatsConnection,
  StringCodec,
  Subscription,
} from 'nats';
import { ChannelTypes } from '../renderer/ipc';

function logMsg(event: ChannelTypes, data: any) {
  console.log(`[IPC] '${event}': ${JSON.stringify(data)}`);
}

export default class NatsClient {
  nc: NatsConnection | undefined;

  codec: Codec<string> = StringCodec();

  sendToBrowser: (channel: ChannelTypes, ...args: any[]) => void;

  subs: Subscription[] = [];

  constructor(ipc: IpcMain, webContents: WebContents) {
    this.sendToBrowser = webContents.send.bind(webContents);
    this.registerEvents(ipc);
  }

  registerEvents(ipc: IpcMain) {
    ipc.on(ChannelTypes.IPCExample, async (event, arg) => {
      logMsg(ChannelTypes.IPCExample, arg);
      event.reply(ChannelTypes.IPCExample, 'pong');
    });

    ipc.on(ChannelTypes.NatsConnectHost, async (event, arg) => {
      logMsg(ChannelTypes.NatsConnectHost, arg);
      await this.connect(arg[0]);
    });

    ipc.on(ChannelTypes.NatsSubscribe, async (event, arg) => {
      logMsg(ChannelTypes.NatsSubscribe, arg);
      await this.subscribe(arg[0], (natsEvent, natsData) => {
        this.sendToBrowser(ChannelTypes.NatsEvent, [
          natsEvent,
          {
            time: new Date().toISOString(),
            data: natsData,
          },
        ]);
      });
    });

    ipc.on(ChannelTypes.NatsUnsubscribe, async (event, arg) => {
      logMsg(ChannelTypes.NatsUnsubscribe, arg);
      let natsEvent = '';
      if (arg.length) {
        [natsEvent] = arg;
      }

      // eslint-disable-next-line no-restricted-syntax
      for (const sub of this.subs) {
        if (!natsEvent || sub.getSubject() === natsEvent) {
          sub.unsubscribe();
          this.sendToBrowser(ChannelTypes.NatsUnsubscribed, [sub.getSubject()]);
        }
      }
      this.sendToBrowser(ChannelTypes.NatsAllUnsubscribed, []);
    });

    ipc.on(ChannelTypes.NatsDisconnect, async (event, arg) => {
      await this.nc?.close();
      this.sendToBrowser(ChannelTypes.NatsDisconnected, []);
    });
  }

  async connect(host: string): Promise<void> {
    try {
      this.nc = await libConnect({ servers: [host] });

      console.log(`connected to ${this.nc.getServer()}`);
      this.codec = StringCodec();
      this.sendToBrowser(ChannelTypes.NatsConnected, []);
    } catch (err) {
      console.log(err);
      console.log(`error connecting to ${JSON.stringify(err)}`);
      this.sendToBrowser(ChannelTypes.NatsError, [(err as any).toString()]);
    }
  }

  subscribe(event: string, cb: (natsEvent: string, natsData: any) => void) {
    const sub = this.nc?.subscribe(event);
    (async () => {
      this.sendToBrowser(ChannelTypes.NatsSubscribed, [event]);
      // eslint-disable-next-line no-restricted-syntax
      for await (const m of sub || []) {
        cb(m.subject, this.codec.decode(m.data));
      }
      console.log('subscription closed');
      this.sendToBrowser(ChannelTypes.NatsUnsubscribed, [event]);
    })();
    this.subs.push(sub as Subscription);
  }
}
