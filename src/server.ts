import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.ts";
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/movies", movieRoutes);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}🚀`);
});

// GET,POST,PUT,PATCH,DELETE (RestApi)
// all are the main methods for the fecthing and making api request from client and server side
