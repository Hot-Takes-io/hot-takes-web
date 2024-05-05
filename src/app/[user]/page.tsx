"use client";
import { Box, Flex, Title, Image, Avatar } from "@mantine/core";

import NextImage from "next/image";
import React from "react";
import { api } from "~/trpc/react";

import RichEditor from "../_components/RichEditor/RichEditor";
import { SessionProvider, useSession } from "next-auth/react";
import { type Content } from "@tiptap/react";

const UserView = ({ params }: { params: { user: string } }) => {
  const userHandle = params.user;
  const session = useSession();
  const { data: userData } = api.user.getUser.useQuery({ handle: userHandle });
  const { mutate: updateUser } = api.user.updateUser.useMutation();
  const user = userData?.user;

  console.log(user);

  return (
    <>
      {!user ? (
        <Flex flex="1" justify="center" align="center">
          <Title>{userData?.error}</Title>
        </Flex>
      ) : (
        <Flex p="xl" flex="1" gap="md">
          <Box>
            <Image
              radius="xl"
              component={NextImage}
              src={user.image ?? ""}
              width={256}
              height={256}
              alt="User image"
            />
            <Flex>{user.name && <Title order={1}>{user.name}</Title>}</Flex>
            <Title order={2}>@{user.handle}</Title>
            <Title order={2}>{user.email}</Title>
            <Title mt="sm" order={5}>
              Badges
            </Title>
            <Flex p="sm" gap="sm">
              {user.userBadges.map((userBadge) => (
                <Avatar size="lg" key={userBadge.id} src={userBadge.imageURL} />
              ))}
            </Flex>
          </Box>

          <Flex direction="column" flex="1" p="xl">
            <Title order={3}>Bio</Title>
            <RichEditor
              content={user.bio as Content}
              readonly={user.id !== session.data?.user.id}
              onSubmit={(content) => {
                updateUser({ bio: content });
              }}
              submitLabel="Update Bio"
              mah="80vh"
            />
          </Flex>
        </Flex>
      )}
    </>
  );
};

const UserViewWithSession = ({ params }: { params: { user: string } }) => (
  <SessionProvider>
    <UserView params={params} />
  </SessionProvider>
);
export default UserViewWithSession;
