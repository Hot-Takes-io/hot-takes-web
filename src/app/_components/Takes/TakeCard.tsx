"use client";

import { useEffect, useState } from "react";

import { type Content } from "@tiptap/react";

import {
  Card,
  Flex,
  ActionIcon,
  Badge,
  Loader,
  Button,
  Text,
  Skeleton,
} from "@mantine/core";

import { IconDotsVertical } from "@tabler/icons-react";

import { api } from "~/trpc/react";
import { TakeReactionType } from "@prisma/client";
import RichEditor from "../RichEditor/RichEditor";
import { modals } from "@mantine/modals";
import { ModalNames } from "../Modals";
import { SessionProvider, useSession } from "next-auth/react";
import CardUserHeader from "../CardUserHeader";

type Props = {
  content: Content;
  by: { id: string; name?: string; handle?: string; image?: string };
  createdAt: Date;
  commentsCount: number;
  takeId: number;
  noCommentLink?: boolean;
  isTakeLoading?: boolean;
};

const TakeCard = ({
  by,
  content,
  createdAt,
  commentsCount,
  takeId,
  noCommentLink,
  isTakeLoading,
}: Props) => {
  const [currentReaction, setCurrentReaction] = useState<TakeReactionType>();
  const { data: reactions, isLoading } = api.take.getTakeReactions.useQuery({
    takeId,
  });

  const session = useSession();

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
    <Card mb="sm" miw="350px">
      {isTakeLoading ? (
        <Skeleton height="150px" />
      ) : (
        <>
          <Flex justify="space-between" mb="sm">
            <CardUserHeader
              userImage={by.image ?? ""}
              userName={by.name ?? ""}
              userHandle={by.handle ?? ""}
              createdAt={createdAt}
              userId={by.id}
            />
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
                  currentReaction === TakeReactionType.Hot_Take
                    ? "cyan"
                    : "gray"
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
                  currentReaction === TakeReactionType.Hot_Shit
                    ? "cyan"
                    : "gray"
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
              {noCommentLink ? (
                <Text>
                  {commentsCount} comment{commentsCount === 1 ? "" : "s"}{" "}
                </Text>
              ) : (
                <Button
                  variant="transparent"
                  onClick={() => {
                    modals.openContextModal(
                      session.data?.user.id
                        ? {
                            modal: ModalNames.TakeModalView,
                            innerProps: {
                              takeId,
                            },
                            size: "xl",
                          }
                        : {
                            modal: ModalNames.NeedToSignIn,
                            title: "Are you serious?",
                            innerProps: {
                              action: "comment",
                            },
                            size: "md",
                          }
                    );
                  }}
                >
                  {commentsCount} comment{commentsCount === 1 ? "" : "s"}
                </Button>
              )}
            </Flex>
          </Flex>
        </>
      )}
    </Card>
  );
};

const TakeCardWithSessionProvider = (props: Props) => {
  const {
    by,
    content,
    createdAt,
    commentsCount,
    takeId,
    noCommentLink,
    isTakeLoading,
  } = props;
  return (
    <SessionProvider>
      <TakeCard
        by={by}
        content={content}
        createdAt={createdAt}
        commentsCount={commentsCount}
        takeId={takeId}
        noCommentLink={noCommentLink}
        isTakeLoading={isTakeLoading}
      />
    </SessionProvider>
  );
};

export default TakeCardWithSessionProvider;
