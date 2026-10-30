import { WebSocketServer } from "./websocket-server";
import { getEnvs } from "./config/envs";

const main = () => {
  const { PORT: port, DEFAULT_CHANNEL: defaultChannel } = getEnvs();

  const wsServer = new WebSocketServer({ path: "/", port, defaultChannel });
  wsServer.start();
};

(() => {
  main();
})();
