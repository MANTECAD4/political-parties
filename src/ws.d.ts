// ws.d.ts
import "ws";

declare module "ws" {
  interface WebSocket {
    id: string;
  }
}
