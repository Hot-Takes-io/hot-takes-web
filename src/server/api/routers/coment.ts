import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ takeId: z.number(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          take: { connect: { id: input.takeId } },
          body: input.body,
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
  getTakeComments: publicProcedure
    .input(z.object({ takeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { takeId: input.takeId },
        include: {
          createdBy: {
            select: { id: true, name: true, handle: true, image: true },
          },
        },
        orderBy: { createdAt: "asc" },
      });
    }),
  getCommentsByUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: { createdById: input.userId },
        include: {
          take: {
            select: { id: true, content: true, createdBy: true },
          },
        },
      });
    }),
});
