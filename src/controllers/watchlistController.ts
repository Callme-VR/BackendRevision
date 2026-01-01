import { prisma } from "../config/db.js";

export const addToWatchlist=async(req:any,res:any)=>{
    try {
        const{movieId,status,rating,notes}=req.body;
        const movies=await prisma.movie.findUnique({
            where:{id:movieId}
        })
        if(!movies){
            return res.status(404).json({error:"Movie not found"});
        }
        const watchlistItem=await prisma.watchlistItem.findUnique({
            where:{userId_movieId:{userId:req.user.id,movieId:movieId}}
        })
        if(watchlistItem){
            return res.status(400).json({error:"Movie already in watchlist"});
        }
        const newWatchlistItem=await prisma.watchlistItem.create({
            data:{userId:req.user.id,movieId:movieId,status,rating,notes}
        })
        return res.status(201).json({message:"Movie added to watchlist",watchlistItem:newWatchlistItem});
    } catch (error) {
        console.error("Error adding movie to watchlist:", error);
        return res.status(500).json({error:"Internal server error"});
    }
}

export const getWatchlist=async(req:any,res:any)=>{
    try {
        const watchlistItems=await prisma.watchlistItem.findMany({
            where:{userId:req.user.id}
        })
        return res.status(200).json({watchlistItems});
    } catch (error) {
        console.error("Error getting watchlist:", error);
        return res.status(500).json({error:"Internal server error"});
    }
}