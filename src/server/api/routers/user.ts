import { UserNotificationType } from "@prisma/client";
import { type Content } from "@tiptap/react";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        handle: true,
        image: true,
        _count: {
          select: {
            followers: { where: { deletedAt: null } },
            following: { where: { deletedAt: null } },
            takes: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }),
  getUserById: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.user.findFirst({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          handle: true,
          image: true,
          _count: {
            select: {
              followers: { where: { deletedAt: null } },
              following: { where: { deletedAt: null } },
              comments: true,
            },
          },
        },
      });
    }),
  getUser: publicProcedure
    .input(z.object({ handle: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { handle: { equals: input.handle, mode: "insensitive" } },
        include: { userBadges: true },
      });

      if (!user) {
        return { user: null, success: false, error: "User not found" };
      }

      const isAccountOwner = ctx.session?.user?.id === user.id;

      if (!isAccountOwner) {
        user.emailVerified = null;
        user.email = null;
      }
      return { user, success: true, error: null };
    }),
  updateUser: protectedProcedure
    .input(
      z.object({
        handle: z.string().optional(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        bio: z.custom<Content | undefined>().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data:
        | { handle: string }
        | { name: string }
        | { email: string }
        | { bio: JSON }
        | object = { ...input };

      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data,
      });
      return { success: true, user };
    }),
  followUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.follow.upsert({
        where: {
          followerId_userId: {
            followerId: ctx.session.user.id,
            userId: input.userId,
          },
        },
        create: {
          follower: { connect: { id: ctx.session.user.id } },
          user: { connect: { id: input.userId } },
        },
        update: { deletedAt: null },
      });
      await ctx.db.userNotification.create({
        data: {
          user: { connect: { id: input.userId } },
          follower: { connect: { id: result.id } },
          notificationType: UserNotificationType.NewFollower,
        },
      });
      return result;
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.follow.update({
        where: {
          followerId_userId: {
            followerId: ctx.session.user.id,
            userId: input.userId,
          },
        },
        data: {
          deletedAt: new Date(),
        },
      });
    }),
  isFollowingUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const follow = await ctx.db.follow.findUnique({
        where: {
          followerId_userId: {
            followerId: ctx.session.user.id,
            userId: input.userId,
          },
          deletedAt: null,
        },
      });
      return { isFollowing: !!follow };
    }),
  getUserFollowers: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.follow.findMany({
        where: { userId: input.userId, deletedAt: null },
        include: { follower: true },
      });
    }),
  getUserFollowing: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.follow.findMany({
        where: { followerId: input.userId, deletedAt: null },
        include: { user: true },
      });
    }),
});
