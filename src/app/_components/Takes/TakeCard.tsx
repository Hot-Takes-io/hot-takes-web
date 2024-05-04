"use client";

import React, { useEffect, useState } from "react";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { type Content, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import {
  Avatar,
  Card,
  Flex,
  Title,
  ActionIcon,
  Badge,
  Loader,
  Button,
} from "@mantine/core";

import { IconDotsVertical } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import { api } from "~/trpc/react";
import { TakeReactionType } from "@prisma/client";

type Props = {
  content: Content;
  by: { name?: string; handle?: string; image?: string };
  createdAt: Date;
  commentsCount: number;
  takeId: number;
};

const TakeCard = ({ by, content, createdAt, commentsCount, takeId }: Props) => {
  const [currentReaction, setCurrentReaction] = useState<TakeReactionType>();
  const { data: reactions, isLoading } = api.take.getTakeReactions.useQuery({
    takeId,
  });

  useEffect(() => {
    setCurrentReaction(reactions?.userReactionType);
  }, [reactions]);

  const utils = api.useUtils();
  const { mutate: setReaction } = api.take.setReaction.useMutation({
    onSettled() {
      void utils.take.getTakeReactions.invalidate({ takeId });
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
    ],
    content,
    editable: false,
  });

  const handleReaction = (reactionType: TakeReactionType) => {
    if (reactionType === currentReaction) {
      return;
    }
    setCurrentReaction(reactionType);
    setReaction({ takeId, reactionType });
  };

  const reactionDiff = (reactions?.Hot_Take ?? 0) - (reactions?.Hot_Shit ?? 0);
  const reactionBadgeContent = () => {
    if (reactionDiff === 0) {
      return (
        <Badge variant="outline" color="gray">
          ¯\_(ツ)_/¯
        </Badge>
      );
    }
    if (reactionDiff > 0) {
      return (
        <Badge
          variant="gradient"
          gradient={{ from: "red", to: "yellow", deg: 30 }}
        >
          Hot Take
        </Badge>
      );
    }
    return (
      <Badge
        variant="gradient"
        gradient={{ from: "brown", to: "gray", deg: 30 }}
      >
        Hot Shit
      </Badge>
    );
  };

  return (
    <Card mb="sm">
      <Flex justify="space-between" mb="sm">
        <Flex align="center" gap="sm">
          <Avatar src={by.image ?? ""} />
          <Title order={4}>{by.name}</Title>
          <Title order={5}>@{by.handle}</Title>
          <Title order={5}>· {formatDistanceToNow(createdAt)}</Title>
        </Flex>
        <Flex align="center" gap="sm">
          {reactionBadgeContent()}

          <ActionIcon color="gray" variant="subtle" size="lg" radius="lg">
            <IconDotsVertical />
          </ActionIcon>
        </Flex>
      </Flex>
      <RichTextEditor editor={editor}>
        <RichTextEditor.Content />
      </RichTextEditor>
      <Flex justify="space-between" mt="sm">
        <Flex align="center" gap="xs">
          <ActionIcon
            onClick={() => handleReaction(TakeReactionType.Hot_Take)}
            variant={
              currentReaction === TakeReactionType.Hot_Take
                ? "filled"
                : "subtle"
            }
            color={
              currentReaction === TakeReactionType.Hot_Take ? "cyan" : "gray"
            }
            size="lg"
            radius="lg"
          >
            🔥
          </ActionIcon>
          <Badge variant="default" size="xl">
            {isLoading ? (
              <Loader color="orange" size="xs" type="bars" />
            ) : (
              reactions?.Hot_Take
            )}
          </Badge>
          <ActionIcon
            onClick={() => handleReaction(TakeReactionType.Hot_Shit)}
            variant={
              currentReaction === TakeReactionType.Hot_Shit
                ? "filled"
                : "subtle"
            }
            color={
              currentReaction === TakeReactionType.Hot_Shit ? "cyan" : "gray"
            }
            size="lg"
            radius="lg"
          >
            💩
          </ActionIcon>
          <Badge variant="default" size="xl">
            {isLoading ? (
              <Loader color="brown" size="xs" type="bars" />
            ) : (
              reactions?.Hot_Shit
            )}
          </Badge>
        </Flex>
        <Flex align="center">
          <Button variant="transparent">
            {commentsCount} comment{commentsCount === 1 ? "" : "s"}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TakeCard;
