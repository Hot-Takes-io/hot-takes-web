import { Card, Text } from "@mantine/core";

import CardUserHeader from "../CardUserHeader";
import type { RouterOutputs } from "~/trpc/react";

type Props = { comment: RouterOutputs["comment"]["getTakeComments"][0] };

const CommentCard = ({ comment }: Props) => {
  return (
    <Card mb="sm" mx="sm">
      <CardUserHeader
        userImage={comment.createdBy.image ?? ""}
        userName={comment.createdBy.name ?? ""}
        userHandle={comment.createdBy.handle ?? ""}
        createdAt={comment.createdAt}
        userId={comment.createdBy.id}
      />
      <Text style={{ whiteSpace: "pre-wrap" }}>{comment.body}</Text>
    </Card>
  );
};

export default CommentCard;
