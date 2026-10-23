import { Request, Response, Router } from "express";
import { Server } from "./server";
import { createServer } from "node:http";
import { WebSocketServer } from "./websocket-server";
import { getEnvs } from "./config/envs";

const main = () => {
  const { PORT: port, DEFAULT_CHANNEL: defaultChannel } = getEnvs();

  const wsServer = new WebSocketServer({ path: "/ws", port, defaultChannel });
  // console.log(
  //   JSON.stringify({
  //     type: "ADD_PARTY",
  //     payload: { a: 1, b: 2 },
  //   }),
  // );
  wsServer.start();
};

(() => {
  main();
})();
