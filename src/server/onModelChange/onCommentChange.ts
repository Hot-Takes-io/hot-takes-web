import {
  type PrismaClient,
  type Prisma,
  UserNotificationType,
} from "@prisma/client";
import sendEmail, {
  EmailGroupID,
  EmailSender,
  EmailTemplate,
} from "../utils/sendEmail";
import { env } from "~/env";

import truncate from "lodash/truncate";

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
        include: { createdBy: true },
      });
      const commentingUser = await prisma.user.findUnique({
        where: {
          id: commentByUserId,
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
        console.log("DEBUG: Sending email to", take.createdBy.email);
        if (take.createdBy.email) {
          await sendEmail({
            sender: EmailSender.NOTIFICATIONS,
            recipient: take.createdBy.email,
            template: EmailTemplate.GENERAL,
            emailGroupId: EmailGroupID.NEW_COMMENT,
            data: {
              Email_Subject: "New Comment on Your Take",
              Email_Preheader: "Someone commented on your take",
              Email_Title: "New Comment on Your Take",
              Email_Salutation: `Hey ${take.createdBy.name}`,
              Button_Body: "View Take",
              Email_Body: `Just to let you know that @${
                commentingUser?.handle ?? "someone"
              } commented on your take, "${truncate(data.body, {
                length: 20,
              })}". Click the button below to view the comment.`,
              Button_URL: `${env.CLIENT_URL}?takeId=${takeId}`,
              Email_Signature: "The Hot Takes Team",
            },
          });
        }
      }
    }
  }
};
