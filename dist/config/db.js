const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "Development" ? ["query", "info", "warn"] : ["error"]
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