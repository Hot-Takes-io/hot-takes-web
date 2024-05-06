"use client";

import React, { useEffect, useState } from "react";

import { type Content } from "@tiptap/react";

import {
  Avatar,
  Card,
  Flex,
  Title,
  ActionIcon,
  Badge,
  Loader,
  Button,
  Anchor,
} from "@mantine/core";

import { IconDotsVertical } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

import { api } from "~/trpc/react";
import { TakeReactionType } from "@prisma/client";
import RichEditor from "../RichEditor/RichEditor";
import Link from "next/link";
import { modals } from "@mantine/modals";

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
          <Anchor component={Link} href={`/${by.handle}`}>
            <Avatar src={by.image ?? ""} />
          </Anchor>
          <Flex wrap="wrap">
            <Title order={4}>{by.name}</Title>
            <Title order={5}>@{by.handle}</Title>
            <Title order={5}>· {formatDistanceToNow(createdAt)}</Title>
          </Flex>
        </Flex>
        <Flex align="center" gap="sm">
          {reactionBadgeContent()}

          <ActionIcon color="gray" variant="subtle" size="lg" radius="lg">
            <IconDotsVertical />
          </ActionIcon>
        </Flex>
      </Flex>

      <RichEditor content={content} readonly mah="20vh" />

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
          <Button
            variant="transparent"
            onClick={() => {
              modals.openContextModal({
                modal: "demonstration",
                title: "Luis",
                innerProps: {
                  takeId,
                },
              });
            }}
          >
            {commentsCount} comment{commentsCount === 1 ? "" : "s"}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TakeCard;
