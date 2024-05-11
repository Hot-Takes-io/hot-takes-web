"use client";
import React from "react";
import { type ContextModalProps } from "@mantine/modals";
import {
  Box,
  Button,
  Flex,
  ScrollAreaAutosize,
  Text,
  Textarea,
} from "@mantine/core";
import { api } from "~/trpc/react";
import TakeCard from "../Takes/TakeCard";
import { type Content } from "@tiptap/react";
import { IconSend } from "@tabler/icons-react";

import { useForm } from "@mantine/form";

import CommentCard from "../Comment/CommentCard";
import { useRouter } from "next/navigation";
import { SessionProvider } from "next-auth/react";

type Props = ContextModalProps<{ takeId: number }>;

const TakeModalView = ({ innerProps }: Props) => {
  const utils = api.useUtils();
  const router = useRouter();
  const { data: comments } = api.comment.getTakeComments.useQuery({
    takeId: innerProps.takeId,
  });

  const { data: take, isLoading: isTakeLoading } =
    api.take.fetchOneTakeWithComments.useQuery({
      takeId: innerProps.takeId,
    });

  const { mutate: postComment } = api.comment.create.useMutation({
    onSettled: () => {
      void utils.comment.getTakeComments.invalidate({
        takeId: innerProps.takeId,
      });
      void utils.take.fetchOneTakeWithComments.invalidate({
        takeId: innerProps.takeId,
      });
      void utils.take.fetch.invalidate();
      void utils.take.getTakeReactions.invalidate();
      // invalidate the take list from server
      router.refresh();
    },
  });

  const form = useForm({
    mode: "controlled",
    initialValues: {
      comment: "",
    },

    validate: {
      comment: (value) =>
        !!value.trim() ? null : "Do you think empty comments are cool?",
    },
  });

  const handlePostComment = (comment: string) => {
    postComment({ takeId: innerProps.takeId, body: comment });
    form.reset();
  };

  return (
    <Box>
      <SessionProvider>
        <TakeCard
          isTakeLoading={isTakeLoading}
          content={take?.content as Content}
          takeId={innerProps.takeId}
          createdAt={take?.createdAt ?? new Date()}
          commentsCount={take?._count.comments ?? 0}
          by={{
            name: take?.createdBy.name ?? "",
            handle: take?.createdBy.handle ?? "",
            image: take?.createdBy.image ?? "",
            id: take?.createdBy.id ?? "",
          }}
          noCommentLink
        />
      </SessionProvider>
      <ScrollAreaAutosize mah="35vh">
        {comments?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </ScrollAreaAutosize>
      <form
        onSubmit={form.onSubmit((values) => handlePostComment(values.comment))}
      >
        <Textarea
          mt="sm"
          rows={4}
          key={form.key("comment")}
          {...form.getInputProps("comment")}
        />

        <Flex justify="end" mt="sm">
          <Button type="submit" leftSection={<IconSend />}>
            <Text>Send</Text>
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default TakeModalView;