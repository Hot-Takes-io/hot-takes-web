import { PrismaClient } from "@prisma/client";

import { env } from "~/env";
import { onModelChange } from "./onModelChange";

const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? [
            // "query",
            "error",
            // "warn"
          ]
        : ["error"],
  });
  prisma.$use(async (params, next) => {
    await onModelChange(params, prisma);
    return next(params);
  });
  return prisma;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
