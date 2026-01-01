import express from "express";
import { addToWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// here we will use the authMiddleware to authenticate the user
router.use(authMiddleware);


router.post("/", addToWatchlist)

export default router;