import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import * as dotenv from "dotenv";

import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers, type Context } from "./graphql/resolvers.js";

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 4000;

// Apollo Server setup
const server = new ApolloServer<Context>({
  typeDefs,
  resolvers,
});

async function startServer() {
  // Start Apollo Server
  await server.start();

  // CORS configuration - allow requests from frontend development server
  app.use(
    cors({
      origin: [
        "http://localhost:5173" // Vite default port
      ],
      credentials: true,
    })
  );

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // GraphQL endpoint
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async (): Promise<Context> => ({ prisma }),
    })
  );

  // Health check endpoint
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

// Start the server
startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
