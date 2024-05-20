import {
  type PrismaClient,
  type Prisma,
  UserNotificationType,
} from "@prisma/client";

export const onCommentChange = async (
  params: Prisma.MiddlewareParams,
  prisma: PrismaClient
) => {
  if (params.action === "create") {
    const args = params.args as { data: Prisma.CommentCreateInput };
    const data = args.data;
    const commentByUserId = data?.createdBy?.connect?.id;
    const takeId = data?.take?.connect?.id;

    if (takeId && commentByUserId) {
      const take = await prisma.take.findUnique({
        where: {
          id: takeId,
        },
      });
      if (take?.createdById && take?.createdById !== commentByUserId) {
        await prisma.userNotification.create({
          data: {
            user: { connect: { id: take?.createdById } },
            take: { connect: { id: takeId } },
            notificationType: UserNotificationType.NewComment,
            commentBody: data.body,
          },
        });
      }
    }
  }
};
