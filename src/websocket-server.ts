import { WebSocketServer as WsServer, WebSocket } from "ws";
import { WebSocketResponseType } from "./interfaces/responses.interface";
import { PartiesController } from "./handlers/parties-controller";
import { IncomingMessage } from "http";

export interface OptionsWss {
  path: string;
  port: number;
  defaultChannel: string;
}

export class WebSocketServer {
  private wss: WsServer;
  private partiesController = new PartiesController();
  private channels: Map<string, Set<WebSocket>> = new Map();
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

  private registerUser = (ws: WebSocket, req: IncomingMessage): string => {
    const clientId = crypto.randomUUID();
    ws.id = clientId;

    const reqUrl = new URL(req.url!, `http://${req.headers.host}`);
    const channelId =
      new URL(reqUrl).searchParams.get("channelId") || this.defaultChannel;

    if (!this.channels.get(channelId)) {
      this.channels.set(channelId, new Set());
    }
    this.channels.get(channelId)?.add(ws);
    console.log(`Client ${clientId} connected to ${channelId} channel.`);

    return channelId;
  };

  public start = () => {
    console.log(`Server is running on port ${this.port}`);

    this.wss.on("connection", (ws: WebSocket, req) => {
      const channelId = this.registerUser(ws, req);

      // Send current parties on connection opening
      const parties = JSON.stringify(this.partiesController.handleGetParties());
      ws.send(parties);

      ws.on("close", () => {
        console.log(`client ${ws.id} disconnected`);
      });

      ws.on("message", (rawRequestMessage: string) => {
        const response =
          this.partiesController.handleMessage(rawRequestMessage);

        const responseStringify = JSON.stringify(response);
        if (
          response.type === WebSocketResponseType.ERROR ||
          response.type === WebSocketResponseType.PARTIES_LIST
        ) {
          return ws.send(responseStringify);
        }
        const clientsInChannel = this.channels.get(channelId);
        clientsInChannel!.forEach((client) => {
          // if (ws.id !== client.id) {
          client.send(responseStringify);
          // }
        });
      });
    });
  };
}
