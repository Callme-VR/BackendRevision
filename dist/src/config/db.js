import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const adapter = new PrismaPg(pg);
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "Development" ? ["query", "info", "warn"] : ["error"],
    errorFormat: "pretty"
});
const connectDb = async () => {
    try {
        await prisma.$connect();
        console.log("Database Connected");
    }
    catch (error) {
        console.log("Database Connection Error", error);
    }
};
const disconnectDb = async () => {
    try {
        await prisma.$disconnect();
        console.log("Database Disconnected");
    }
    catch (error) {
        console.log("Database Disconnection Error", error);
    }
};
export { prisma, connectDb, disconnectDb };
//# sourceMappingURL=db.js.map