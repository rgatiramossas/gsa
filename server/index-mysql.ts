import express, { NextFunction, Request, Response } from "express";
import { Server } from "http";
import { setupVite, serveStatic, log } from "./vite";
import { checkDatabaseConnection, setupDatabase } from "./db-mysql";
import { mySQLStorage } from "./mysql-storage";
import { registerRoutes } from "./routes";

async function main() {
  // Configurar o servidor express
  const app = express();
  app.use(express.json());
  serveStatic(app);

  // Verificar e configurar o banco de dados MySQL
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error("Não foi possível conectar ao banco de dados MySQL");
    }
    
    log("Conexão com o banco de dados MySQL bem-sucedida");
    
    // Configurar as tabelas do banco de dados
    await setupDatabase();
    
    // Inserir dados de exemplo, se necessário
    await mySQLStorage.seedSampleData();
    
    // Registrar rotas da API
    const server = await registerRoutes(app);
    
    // Configurar o servidor Vite para o frontend
    await setupVite(app, server);
    
    // Manipulador de erros global
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Erro na aplicação:", err);
      res.status(500).json({
        error: "Erro interno do servidor",
        message: err.message
      });
    });
    
    log("Servidor configurado com banco de dados MySQL");
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

main();