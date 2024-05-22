"use client";

import { Anchor, Avatar, Box, Flex, Title, Text } from "@mantine/core";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import React from "react";
import FollowUserButton from "./FollowUserButton";
import { api } from "~/trpc/react";

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
          <Title order={5}>{name}</Title>
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
