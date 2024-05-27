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
  Text,
} from "@mantine/core";

import NextImage from "next/image";
import { api } from "~/trpc/react";

import RichEditor from "../../_components/RichEditor/RichEditor";

import { type Content } from "@tiptap/react";
import ProfileBadge, {
  ProfileBadgeSize,
} from "../../_components/ProfileBadge/ProfileBadge";

import { useState } from "react";

import TakeCard from "~/app/_components/Takes/TakeCard";
import { useSession } from "next-auth/react";
import { modals } from "@mantine/modals";
import { ModalNames } from "~/app/_components/Modals";
import { useRouter } from "next/navigation";

const UserView = ({ params }: { params: { user: string } }) => {
  const session = useSession();
  const router = useRouter();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const userHandle = params.user;

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
            <Flex gap="md" wrap="wrap">
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
                <Flex>{user.name && <Title order={1}>{user.name}</Title>}</Flex>
                <Title order={2}>@{user.handle}</Title>
              </Box>
              <Flex flex="1" direction="column" miw="300px">
                <Flex justify="center">
                  <Title mt="sm" order={5}>
                    Badges
                  </Title>
                </Flex>
                <Flex p="sm" gap="sm" wrap="wrap">
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
              </Flex>
            </Flex>

            <Flex
              direction="column"
              flex="1"
              h="400px"
              mt="sm"
              align="space-between"
            >
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
            <Flex wrap="wrap" flex="1" gap="sm">
              <Box flex="3">
                <Title order={4}>Takes</Title>
                {userTakes?.map((take) => (
                  <TakeCard
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
              <Flex direction="column" flex="3" gap="sm" miw="300px">
                <Title order={4}>Comments</Title>
                {userComments?.map((comment) => (
                  <Card
                    style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
                    key={comment.id}
                    onClick={() => {
                      modals.openContextModal({
                        modal: ModalNames.TakeModalView,
                        innerProps: {
                          takeId: comment.takeId,
                        },
                        size: "xl",
                      });
                    }}
                  >
                    {comment.body}
                  </Card>
                ))}
              </Flex>
              <Box flex="1">
                <Title order={4}>Followers</Title>
                {userFollowers?.map((follower) => (
                  <Flex key={follower.id} align="center" gap="sm" py="sm">
                    <Avatar
                      src={follower.follower.image}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        router.push(`/user/${follower.follower.handle}`)
                      }
                    />
                    <Text>@{follower.follower.handle}</Text>
                  </Flex>
                ))}
              </Box>
              <Box flex="1">
                <Title order={4}>Following</Title>
                {userFollowing?.map((following) => (
                  <Flex key={following.id} align="center" gap="sm" py="sm">
                    <Avatar
                      src={following.user.image}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        router.push(`/user/${following.user.handle}`)
                      }
                    />
                    <Text>@{following.user.handle}</Text>
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

export default UserView;
