import express, { Application, Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import routes from "./src/routes/route";
import { initDB } from "./src/database/database";

// Load environment variables from .env file
require('dotenv').config();

const CONFIG = {
  PORT: process.env.PORT || 3000,
  PUBLIC_DIR: 'public',
  BASE_ROUTE: '/api',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  DATABASE_DIR: path.join(__dirname, 'database'),
  WELCOME_MESSAGE: 'Welcome to the Plants API. Use /api/health to check status.'
} as const;

class Server {
  private app: Application;

  constructor() {
    this.app = express();
    this.ensureDirectories();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private ensureDirectories(): void {
    // Ensure public directory exists
    if (!fs.existsSync(CONFIG.PUBLIC_DIR)) {
      fs.mkdirSync(CONFIG.PUBLIC_DIR, { recursive: true });
    }

    // Ensure database directory exists
    if (!fs.existsSync(CONFIG.DATABASE_DIR)) {
      fs.mkdirSync(CONFIG.DATABASE_DIR, { recursive: true });
    }
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cors({
      origin: CONFIG.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));
    this.app.use(express.static(path.join(__dirname, CONFIG.PUBLIC_DIR)));
  }

  private setupRoutes(): void {
    // API routes
    this.app.use(CONFIG.BASE_ROUTE, routes);

    // Root route
    this.app.get("/", (req: Request, res: Response) => {
      res.send(CONFIG.WELCOME_MESSAGE);
    });

    // Health check route
    this.app.get(`${CONFIG.BASE_ROUTE}/health`, (req: Request, res: Response) => {
      res.status(200).json({
        status: 'OK',
        message: 'Plants API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // Catch-all route for SPA frontend
    this.app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, CONFIG.PUBLIC_DIR, 'index.html'));
    });
  }

  public async start(): Promise<void> {
    try {
      // Initialize the database
      await initDB();

      // Start the server
      this.app.listen(CONFIG.PORT, () => {
        this.logServerStart();
      });
    } catch (error) {
      console.error('Error starting server:', error);
      process.exit(1);
    }
  }

  private logServerStart(): void {
    const baseUrl = `http://localhost:${CONFIG.PORT}`;
    console.log(`
╔════════════════════════════════════════════╗
║           🌿 PLANTS API STARTED 🌿         ║
╠════════════════════════════════════════════╣
║ 🚀 Server running on port: ${CONFIG.PORT.toString().padEnd(14)}║
║ 🌐 Environment: ${(process.env.NODE_ENV || 'development').padEnd(21)}║
║ 🔗 API Base URL: ${CONFIG.BASE_ROUTE.padEnd(20)}║
║ 🏥 Health check: ${`${CONFIG.BASE_ROUTE}/health`.padEnd(19)}║
╚════════════════════════════════════════════╝
    `);
  }
}

// Create and start server
const server = new Server();
server.start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});