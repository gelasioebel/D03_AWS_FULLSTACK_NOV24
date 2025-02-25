import express, { Application } from "express";
import cors from "cors";
import routes from "./src/routes/route";
import path from "path";

const CONFIG = {
  PORT: process.env.PORT || 3000,
  PUBLIC_DIR: 'public',
  BASE_ROUTE: '/api',
  WELCOME_MESSAGE: 'Welcome to the Plants API. Use /api/health to check status.'
} as const;

class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(express.static(path.join(__dirname, CONFIG.PUBLIC_DIR)));
  }

  private setupRoutes(): void {
    this.app.use(CONFIG.BASE_ROUTE, routes);
    this.app.get("/", (req, res) => {
      res.send(CONFIG.WELCOME_MESSAGE);
    });
  }

  public start(): void {
    try {
      this.app.listen(CONFIG.PORT, () => {
        this.logServerStart();
      });
    } catch (error) {
      console.error('Erro ao iniciar o servidor:', error);
      process.exit(1);
    }
  }

  private logServerStart(): void {
    const baseUrl = `http://localhost:${CONFIG.PORT}`;
    console.log(`🚀 Servidor rodando na porta ${CONFIG.PORT}`);
    console.log('✅ API iniciada com sucesso!');
    console.log(`🏥 Health check disponível em: ${baseUrl}${CONFIG.BASE_ROUTE}/health`);
  }
}

const server = new Server();
server.start();