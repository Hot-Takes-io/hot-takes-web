import { type Content } from "@tiptap/react";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
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
      const data = { ...input };

      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data,
      });
      return { success: true, user };
    }),
});
