"use client";

import { Anchor, Avatar, Box, Flex, Title, Text, Tooltip } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";
import FollowUserButton from "./FollowUserButton";
import { api } from "~/trpc/react";
import Image from "next/image";

type Props = {
  userHandle: string;
  userImage: string;
  userName: string;
  createdAt: Date;
  userId: string;
};

const CardUserHeader = ({ createdAt, userId }: Props) => {
  const { data: user } = api.user.getUserById.useQuery({ userId });
  const { name, handle, image } = user ?? {};

  return (
    <Flex align="center" gap="sm">
      <Anchor component={Link} href={`/user/${handle}`}>
        <Avatar src={image} />
      </Anchor>
      <Flex wrap="wrap" gap="sm">
        <Box>
          <Flex gap="xs">
            <Title order={5}>{name}</Title>
            <Anchor href={`/profile-badges`}>
              {user?.userBadges.map((badge) => (
                <Tooltip key={`${badge.id}-${user.id}`} label={badge.name}>
                  <Image
                    src={badge.imageURL}
                    width={24}
                    height={24}
                    alt={badge.name}
                  />
                </Tooltip>
              ))}
            </Anchor>
          </Flex>
          <Text size="xs">@{handle}</Text>
        </Box>
        <Flex wrap={"wrap"} justify="flex-end" direction="column">
          <Text size="xs">
            {user?._count.followers} follower
            {user?._count.followers === 1 ? "" : "s"}
          </Text>
          <Text size="xs">{formatDistanceToNow(createdAt)} ago</Text>
        </Flex>
        <FollowUserButton userId={userId} size="xs" />
      </Flex>
    </Flex>
  );
};

export default CardUserHeader;
