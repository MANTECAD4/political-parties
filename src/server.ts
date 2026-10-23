import express, { Router } from "express";

interface Options {
  port: number;
  routes: Router;
}
export class Server {
  public readonly app = express();

  private serverListener?: any;
  private readonly port: number;
  private readonly routes: Router | undefined;

  // Provienen de envs
  constructor({ port }: Options) {
    this.port = port;
  }

  async start() {
    // Formatos de  Body admitidos en la petición - OBLIGATORIOS
    this.app.use(express.json());
    this.app.use(express.urlencoded());

    // Uso del router

    this.serverListener = this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}...`);
    });
  }

  public setRouter = (routes: Router) => {
    this.app.use(routes);
  };

  close = async () => {
    this.serverListener.close();
  };
}
