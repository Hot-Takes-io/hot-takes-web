"use client";
import { Button, type MantineSize } from "@mantine/core";

import { useSession } from "next-auth/react";
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
  const session = useSession();
  const isAuthenticated = !!session.data?.user?.id;
  const { data: followData, isLoading } = api.user.isFollowingUser.useQuery(
    {
      userId: userId ?? "",
    },
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    setIsFollowing(followData?.isFollowing ?? false);
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
  if (session.data?.user?.id === userId || !isAuthenticated) {
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

export default FollowUserButton;
