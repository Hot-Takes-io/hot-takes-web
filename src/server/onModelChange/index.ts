import { Prisma, type PrismaClient } from "@prisma/client";
import { onCommentChange } from "./onCommentChange";
import { onTakeReactionChange } from "./onTakeReactionChange";

export const onModelChange = async (
  params: Prisma.MiddlewareParams,
  prisma: PrismaClient
) => {
  const model = params.model;
  if (!model) return;
  switch (model) {
    case Prisma.ModelName.Comment:
      await onCommentChange(params, prisma);
      break;
    case Prisma.ModelName.TakeReaction:
      await onTakeReactionChange(params, prisma);
      break;
  }
};
