import { Card, Text } from "@mantine/core";
import { type RouterOutput } from "~/server/api/root";
import CardUserHeader from "../CardUserHeader";

type Props = { comment: RouterOutput["comment"]["getTakeComments"][0] };

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
      <Text>{comment.body}</Text>
    </Card>
  );
};

export default CommentCard;
