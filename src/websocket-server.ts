import { WebSocketServer as WsServer, WebSocket } from "ws";
import { WebSocketResponseType } from "./interfaces/responses.interface";
import { PartiesController } from "./handlers/parties-controller";

export interface OptionsWss {
  path: string;
  port: number;
  defaultChannel: string;
}

export class WebSocketServer {
  private wss: WsServer;
  private partiesController = new PartiesController();
  // private channels:Record<string,Set<WebSocket>> = {}
  public defaultChannel: string;
  public port: number;

  public constructor(options: OptionsWss) {
    const { path, port, defaultChannel } = options;
    this.port = port;
    this.defaultChannel = defaultChannel;
    this.wss = new WsServer({ path, port });
  }

  public sendEvent = (type: string, payload: any) => {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type, payload }));
      }
    });
  };

  public start = () => {
    console.log(`Server is running on port ${this.port}`);
    const channels: Map<string, Set<WebSocket>> = new Map();

    this.wss.on("connection", (ws: WebSocket, req) => {
      const clientId = crypto.randomUUID();
      ws.id = clientId;

      const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
      const channelId =
        new URL(reqUrl).searchParams.get("channelId") || this.defaultChannel;

      if (!channels.get(channelId)) {
        channels.set(channelId, new Set());
      }
      channels.get(channelId)?.add(ws);
      console.log(`Client ${clientId} connected to ${channelId} channel.`);
      ws.on("close", () => {
        console.log(`client ${ws.id} disconnected`);
      });
      ws.on("message", (rawRequestMessage: string) => {
        const response =
          this.partiesController.handleMessage(rawRequestMessage);

        const responseStringify = JSON.stringify(response);
        console.log({ responseStringify });
        if (
          response.type === WebSocketResponseType.ERROR ||
          response.type === WebSocketResponseType.PARTIES_LIST
        ) {
          return ws.send(responseStringify);
        }
        const clientsInChannel = channels.get(channelId);
        clientsInChannel!.forEach((client) => {
          // if (ws.id !== client.id) {
          client.send(responseStringify);
          // }
        });
      });
    });
  };
}
