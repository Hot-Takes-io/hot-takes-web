"use client";
import { Button, type MantineSize } from "@mantine/core";
import { SessionProvider, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { api } from "~/trpc/react";

type Props = {
  size:
    | MantineSize
    | "compact-sm"
    | "compact-xs"
    | "compact-md"
    | "compact-lg"
    | "compact-xl";
  userId: string;
};

const FollowUserButton = ({ size, userId }: Props) => {
  const [isFollowing, setIsFollowing] = React.useState(false);
  const { data: followData, isLoading } = api.user.isFollowingUser.useQuery({
    userId: userId ?? "",
  });

  useEffect(() => {
    setIsFollowing(followData?.isFollowing ?? false);
    console.log("Debug", followData);
  }, [followData]);
  const { mutate: follow } = api.user.followUser.useMutation({
    onSettled: () => {
      void invalidateQueries();
    },
  });
  const { mutate: unfollow } = api.user.unfollowUser.useMutation({
    onSettled: () => {
      void invalidateQueries();
    },
  });
  const handleButtonClick = () => {
    if (followData?.isFollowing) {
      void unfollow({ userId });
      setIsFollowing(false);
    } else {
      void follow({ userId });
      setIsFollowing(true);
    }
  };
  const utils = api.useUtils();
  const invalidateQueries = () => {
    void utils.user.isFollowingUser.invalidate();
    void utils.user.getUserById.invalidate();
  };
  const session = useSession();
  if (session.data?.user.id === userId) {
    return null;
  }
  return (
    <Button
      loading={isLoading}
      loaderProps={{ type: "dots" }}
      variant="transparent"
      size={size}
      onClick={handleButtonClick}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

const FollowUserButtonWithSessionProvider = (props: Props) => {
  return (
    <SessionProvider>
      <FollowUserButton {...props} />
    </SessionProvider>
  );
};
export default FollowUserButtonWithSessionProvider;
