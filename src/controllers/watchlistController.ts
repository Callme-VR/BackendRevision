import { prisma } from "../config/db.js";
import type { Response } from "express";
import type { AuthenticatedRequest } from "../types/express.js";

export const addToWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const { movieId, status, rating, notes } = req.body;
        const movie = await prisma.movie.findUnique({
            where: { id: movieId }
        });
        
        if (!movie) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }
        
        const watchlistItem = await prisma.watchlistItem.findUnique({
            where: { userId_movieId: { userId: req.user.id, movieId: movieId } }
        });
        
        if (watchlistItem) {
            res.status(400).json({ error: "Movie already in watchlist" });
            return;
        }
        
        const newWatchlistItem = await prisma.watchlistItem.create({
            data: { userId: req.user.id, movieId: movieId, status, rating, notes }
        });
        
        res.status(201).json({ message: "Movie added to watchlist", watchlistItem: newWatchlistItem });
    } catch (error) {
        console.error("Error adding movie to watchlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const watchlistItems = await prisma.watchlistItem.findMany({
            where: { userId: req.user.id }
        });
        
        res.status(200).json({ watchlistItems });
    } catch (error) {
        console.error("Error getting watchlist:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}