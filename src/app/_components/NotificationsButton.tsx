import {
  Text,
  Badge,
  Box,
  Button,
  Loader,
  Menu,
  ThemeIcon,
  Title,
  Avatar,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { TakeReactionType } from "@prisma/client";
import { IconBell } from "@tabler/icons-react";
import { api } from "~/trpc/react";
import { ModalNames } from "./Modals";
import { useRouter } from "next/navigation";

const NotificationsButton = () => {
  const { data: notifications, isLoading } =
    api.userNotification.getUserNotifications.useQuery(undefined, {
      refetchIntervalInBackground: true,
      refetchInterval: 60000,
    });

  const { data: unreadNotificationsCount } =
    api.userNotification.getUnreadUserNotificationsCount.useQuery(undefined, {
      refetchIntervalInBackground: true,
      refetchInterval: 60000,
    });

  const utils = api.useUtils();

  const { mutate: markAsRead } =
    api.userNotification.markUserNotificationAsRead.useMutation({
      onSettled: () => {
        void utils.userNotification.invalidate();
      },
    });
  const router = useRouter();
  const handleOpenNotification = ({
    notificationId,
    takeId,
    userHandle,
  }: {
    notificationId: number;
    takeId?: number | null;
    userHandle?: string | null;
  }) => {
    markAsRead({ notificationId: notificationId });
    if (takeId) {
      modals.openContextModal({
        modal: ModalNames.TakeModalView,
        innerProps: {
          takeId,
        },
        size: "xl",
      });
    }
    if (userHandle) {
      router.push(`/user/${userHandle}`);
    }
  };
  return (
    <Box pos="relative">
      <Menu
        shadow="md"
        width={400}
        transitionProps={{ transition: "slide-left", duration: 350 }}
      >
        <Menu.Target>
          <ThemeIcon
            autoContrast
            variant="gradient"
            size="lg"
            aria-label="Gradient action icon"
            gradient={
              !!unreadNotificationsCount
                ? {
                    from: "red",
                    to: "yellow",
                    deg: 30,
                  }
                : {
                    from: "blue",
                    to: "cyan",
                    deg: 90,
                  }
            }
          >
            <IconBell cursor="pointer" />
            <Badge
              size="md"
              color={!!unreadNotificationsCount ? "red" : "blue"}
              pos="absolute"
              top="-5px"
              right="-10px"
              circle
            >
              {(unreadNotificationsCount ?? 0) < 10
                ? unreadNotificationsCount ?? 0
                : "+"}
            </Badge>
          </ThemeIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Label>Notifications</Menu.Label>
          <Menu.Divider />
          {isLoading ? (
            <Loader />
          ) : (
            notifications?.map((notification) => (
              <Menu.Item key={notification.id}>
                {notification.commentBody && (
                  <Button
                    variant="transparent"
                    color={notification.readAt ? "default" : "blue"}
                    onClick={() =>
                      handleOpenNotification({
                        notificationId: notification.id,
                        takeId: notification.takeId,
                      })
                    }
                  >
                    New comment:&nbsp;
                    <Text maw="240px" truncate="end" ta="left">
                      &quot;{notification.commentBody}
                    </Text>
                    &quot;
                  </Button>
                )}
                {notification.reactionType && (
                  <Button
                    variant="transparent"
                    color={notification.readAt ? "default" : "blue"}
                    onClick={() =>
                      handleOpenNotification({
                        notificationId: notification.id,
                        takeId: notification.takeId,
                      })
                    }
                    rightSection={
                      <Title order={2}>
                        {notification.reactionType === TakeReactionType.Hot_Take
                          ? "🔥"
                          : "💩"}
                      </Title>
                    }
                  >
                    You got a new Reaction:
                  </Button>
                )}
                {notification.followerId && (
                  <Button
                    variant="transparent"
                    color={notification.readAt ? "default" : "blue"}
                    onClick={() =>
                      handleOpenNotification({
                        notificationId: notification.id,
                        userHandle: notification.follower?.follower.handle,
                      })
                    }
                  >
                    <Avatar
                      src={notification.follower?.follower.image}
                      size="sm"
                      mr="sm"
                    />
                    @{notification.follower?.follower.handle} started following
                    you
                  </Button>
                )}
              </Menu.Item>
            ))
          )}
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
};

export default NotificationsButton;
