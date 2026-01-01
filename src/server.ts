import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import { connectDb, disconnectDb, prisma } from "./config/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/movies", movieRoutes);















let server: any;
const startServer = async () => {
  try {
    await connectDb();
    server = app.listen(port, () => {
      console.log(`[server]: Server is running at http://localhost:${port}🚀`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (server) {
    server.close(async () => {
      await disconnectDb();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  if (server) {
    server.close(async () => {
      await disconnectDb();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  console.log("Server is closing");
  await disconnectDb();
  process.exit(0);
});

startServer();

// GET,POST,PUT,PATCH,DELETE (RestApi)
// all are the main methods for the fecthing and making api request from client and server side
