import { TakeReactionType } from "@prisma/client";
import { type Content } from "@tiptap/react";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export enum TakeFetchTarget {
  All = "all",
  Following = "following",
}

export const takeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ content: z.custom<Content>() }))
    .mutation(async ({ ctx, input }) => {
      if (input.content) {
        return {
          success: true,
          ...(await ctx.db.take.create({
            data: {
              content: input.content,
              createdBy: { connect: { id: ctx.session.user.id } },
            },
            include: {
              createdBy: { select: { name: true, handle: true, image: true } },
            },
          })),
        };
      }
      return { success: false, error: "No content provided" };
    }),
  fetch: publicProcedure
    .input(z.object({ fetchTarget: z.nativeEnum(TakeFetchTarget) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.take.findMany({
        where:
          input.fetchTarget === TakeFetchTarget.All
            ? {}
            : {
                createdBy: {
                  followers: {
                    some: {
                      followerId: ctx.session?.user.id,
                      deletedAt: null,
                    },
                  },
                },
              },
        select: {
          id: true,
          createdBy: true,
          createdAt: true,
          content: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: [{ createdAt: "desc" }, { takeReactions: { _count: "desc" } }],
      });
    }),
  getTakeReactions: publicProcedure
    .input(z.object({ takeId: z.number() }))
    .query(async ({ ctx, input }) => {
      const hotTakes = await ctx.db.takeReaction.count({
        where: { takeId: input.takeId, type: TakeReactionType.Hot_Take },
      });
      const hotShits = await ctx.db.takeReaction.count({
        where: { takeId: input.takeId, type: TakeReactionType.Hot_Shit },
      });

      const userReaction = await ctx.db.takeReaction.findUnique({
        where: {
          userTake: {
            takeId: input.takeId,
            createdById: ctx.session?.user.id ?? "",
          },
        },
      });
      return {
        [TakeReactionType.Hot_Take]: hotTakes,
        [TakeReactionType.Hot_Shit]: hotShits,
        userReactionType: userReaction?.type,
      };
    }),
  setReaction: protectedProcedure
    .input(
      z.object({
        takeId: z.number(),
        reactionType: z.nativeEnum(TakeReactionType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { takeId, reactionType } = input;
      const userId = ctx.session.user.id;
      const result = ctx.db.takeReaction.upsert({
        where: { userTake: { createdById: userId, takeId } },
        create: {
          take: { connect: { id: takeId } },
          createdBy: { connect: { id: userId } },
          type: reactionType,
        },
        update: {
          type: reactionType,
        },
      });
      return result;
    }),
  fetchOneTakeWithComments: protectedProcedure
    .input(z.object({ takeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.take.findUnique({
        where: { id: input.takeId },
        select: {
          id: true,
          createdBy: true,
          createdAt: true,
          content: true,
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });
    }),
});
