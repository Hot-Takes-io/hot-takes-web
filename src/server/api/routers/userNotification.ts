import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const userNotificationRouter = createTRPCRouter({
  getUserNotifications: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.userNotification.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        take: {
          select: {
            id: true,
          },
        },
        follower: {
          select: {
            follower: {
              select: {
                handle: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),
  getUnreadUserNotificationsCount: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.userNotification.count({
      where: {
        userId: ctx.session.user.id,
        readAt: null,
      },
    });
  }),
  markUserNotificationAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.userNotification.updateMany({
        where: {
          userId: ctx.session.user.id,
          id: input.notificationId,
          readAt: null,
        },
        data: {
          readAt: new Date(),
        },
      });
    }),
});
