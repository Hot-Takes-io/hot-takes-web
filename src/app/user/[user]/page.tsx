"use client";
import {
  Box,
  Flex,
  Title,
  Image,
  ScrollAreaAutosize,
  Button,
  Avatar,
  Card,
} from "@mantine/core";

import NextImage from "next/image";
import { api } from "~/trpc/react";

import RichEditor from "../../_components/RichEditor/RichEditor";
import { SessionProvider, useSession } from "next-auth/react";
import { type Content } from "@tiptap/react";
import ProfileBadge, {
  ProfileBadgeSize,
} from "../../_components/ProfileBadge/ProfileBadge";
import TakeCardWithSessionProvider from "~/app/_components/Takes/TakeCard";
import { useState } from "react";

const UserView = ({ params }: { params: { user: string } }) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const userHandle = params.user;
  const session = useSession();
  const { data: userData } = api.user.getUser.useQuery(
    { handle: userHandle },
    { enabled: !!userHandle }
  );
  const { data: userTakes } = api.take.getUserTakes.useQuery(
    {
      userId: userData?.user?.id ?? "",
    },
    { enabled: !!userData?.user?.id }
  );

  const { data: userComments } = api.comment.getCommentsByUser.useQuery(
    { userId: userData?.user?.id ?? "" },
    { enabled: !!userData?.user?.id }
  );

  const { data: userFollowers } = api.user.getUserFollowers.useQuery(
    { userId: userData?.user?.id ?? "" },
    { enabled: !!userData?.user?.id }
  );

  const { data: userFollowing } = api.user.getUserFollowing.useQuery(
    { userId: userData?.user?.id ?? "" },
    { enabled: !!userData?.user?.id }
  );

  const { mutate: updateUser } = api.user.updateUser.useMutation();
  const user = userData?.user;
  console.log("debug", userTakes);
  const isAccountOwner = session.data?.user?.handle === userHandle;
  return (
    <>
      {!user ? (
        <Flex flex="1" justify="center" align="center">
          <Title>{userData?.error}</Title>
        </Flex>
      ) : (
        <ScrollAreaAutosize
          // pr="xl"
          flex="1"
          mah="calc(100vh - 70px)"
          offsetScrollbars
        >
          <Box px="xl" flex="1">
            <Flex gap="md">
              <Box>
                <Box>
                  <Image
                    radius="xl"
                    component={NextImage}
                    src={user.image ?? ""}
                    width={256}
                    height={256}
                    alt="User image"
                    maw={256}
                  />
                </Box>
                <Box>
                  <Flex>
                    {user.name && <Title order={1}>{user.name}</Title>}
                  </Flex>
                  <Title order={2}>@{user.handle}</Title>
                  <Title order={2}>{user.email}</Title>
                </Box>
                <Box>
                  <Title mt="sm" order={5}>
                    Badges
                  </Title>
                  <Flex p="sm" gap="sm">
                    {user.userBadges.map((userBadge) => (
                      <ProfileBadge
                        key={userBadge.id}
                        size={ProfileBadgeSize.xl}
                        image={userBadge.imageURL}
                        name={userBadge.name}
                        withLink
                      />
                    ))}
                  </Flex>
                </Box>
              </Box>

              <Flex direction="column" flex="1" h="400px">
                <RichEditor
                  content={user.bio as Content}
                  readonly={!isAccountOwner || !isEditingBio}
                  onSubmit={(content) => {
                    updateUser({ bio: content });
                  }}
                  submitLabel="Update Bio"
                  cancelLabel="Cancel"
                  keepContentOnCancel
                  onCancel={() => setIsEditingBio(false)}
                  mah={337}
                />
                {!isEditingBio && (
                  <Flex py="sm" justify="flex-end">
                    <Button onClick={() => setIsEditingBio(true)}>
                      Edit Bio
                    </Button>
                  </Flex>
                )}
              </Flex>
            </Flex>

            <Flex wrap="wrap" flex="1" gap="sm">
              <Box flex="2">
                <Title order={4}>Takes</Title>
                {userTakes?.map((take) => (
                  <TakeCardWithSessionProvider
                    key={take.id}
                    by={{
                      name: take.createdBy.name ?? "",
                      image: take.createdBy.image ?? "",
                      handle: take.createdBy.handle ?? "",
                      id: take.createdBy.id,
                    }}
                    content={take.content as Content}
                    createdAt={take.createdAt}
                    commentsCount={take._count.comments}
                    takeId={take.id}
                  />
                ))}
              </Box>
              <Flex direction="column" flex="1" gap="sm">
                <Title order={4}>Comments</Title>
                {userComments?.map((comment) => (
                  <Card key={comment.id}>{comment.body}</Card>
                ))}
              </Flex>
              <Box flex="1">
                <Title order={4}>Followers</Title>
                {userFollowers?.map((follower) => (
                  <Flex key={follower.id} align="center" gap="sm" py="sm">
                    <Avatar src={follower.follower.image} />@
                    {follower.follower.handle}
                  </Flex>
                ))}
              </Box>
              <Box flex="1">
                <Title order={4}>Following</Title>
                {userFollowing?.map((following) => (
                  <Flex key={following.id} align="center" gap="sm" py="sm">
                    <Avatar src={following.user.image} />@
                    {following.user.handle}
                  </Flex>
                ))}
              </Box>
            </Flex>
          </Box>
        </ScrollAreaAutosize>
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
