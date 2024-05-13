"use client";

import { Anchor, Avatar, Box, Flex, Title } from "@mantine/core";
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
          <Title order={4}>{name}</Title>
          <Title order={5}>@{handle}</Title>
        </Box>
        <Box>
          <Title order={5}>
            {user?._count.followers} follower
            {user?._count.followers === 1 ? "" : "s"}
          </Title>
          <Title order={5}>· {formatDistanceToNow(createdAt)} ago</Title>
        </Box>
        <FollowUserButton userId={userId} size="xs" />
      </Flex>
    </Flex>
  );
};

export default CardUserHeader;
