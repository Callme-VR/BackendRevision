declare const prisma: import("../generated/prisma/internal/class.js").PrismaClient<"error" | "info" | "query" | "warn", import("../generated/prisma/internal/prismaNamespace.js").GlobalOmitConfig | undefined, import("@prisma/client/runtime/client").DefaultArgs>;
declare const connectDb: () => Promise<void>;
declare const disconnectDb: () => Promise<void>;
export { prisma, connectDb, disconnectDb };
//# sourceMappingURL=db.d.ts.map