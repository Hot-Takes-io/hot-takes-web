import {
  UserNotificationType,
  type Prisma,
  type PrismaClient,
} from "@prisma/client";

export const onTakeReactionChange = async (
  params: Prisma.MiddlewareParams,
  prisma: PrismaClient
) => {
  if (params.action === "upsert") {
    const args = params.args as Prisma.TakeReactionUpsertArgs;
    const create = args.create;
    const reactionByUserId = create?.createdBy?.connect?.id;
    const takeId = create?.take?.connect?.id;
    if (takeId && reactionByUserId) {
      const take = await prisma.take.findUnique({
        where: {
          id: takeId,
        },
      });
      if (take?.createdById && take?.createdById !== reactionByUserId) {
        await prisma.userNotification.create({
          data: {
            user: { connect: { id: take?.createdById } },
            take: { connect: { id: takeId } },
            notificationType: UserNotificationType.NewReaction,
          },
        });
      }
    }
  }
};
