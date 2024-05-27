"use client";
import {
  Anchor,
  Avatar,
  Badge,
  Flex,
  Menu,
  Title,
  Text,
  Modal,
  TextInput,
  Button,
  Checkbox,
} from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import CreateTake from "../Takes/CreateTake";
import Link from "next/link";
import {
  IconBrandDiscordFilled,
  IconCheck,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import NotificationsButton from "../NotificationsButton";
import { useDebouncedCallback, useDisclosure } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";

import { useForm } from "@mantine/form";
import { z } from "zod";
import { api } from "~/trpc/react";
import { notifications } from "@mantine/notifications";

const Header = () => {
  const router = useRouter();
  const session = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const emailSchema = z.string().email();
  const nameSchema = z.string().min(2).max(30);
  const handleSchema = z.string().min(4).max(20);
  const utils = api.useUtils();
  const [isTaken, setIsTaken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: userData, isLoading: isUserLoading } =
    api.user.getCurrentUser.useQuery(undefined, {
      enabled: !!session.data?.user?.id,
    });

  const { mutate: updateUser } = api.user.updateUser.useMutation({
    onSuccess: () => {
      notifications.show({
        title: "Success",
        icon: <IconCheck />,
        color: "green",
        message: "User Settings updated",
      });
    },
    onSettled: () => {
      void utils.user.getCurrentUser.invalidate();
    },
  });

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      image: userData?.image ?? "",
      name: userData?.name ?? "",
      handle: userData?.handle ?? "",
      email: userData?.email ?? "",
      newCommentNotifications: userData?.newCommentNotifications,
      newFollowerNotifications: userData?.newFollowerNotifications,
      newReactionNotifications: userData?.newReactionNotifications,
    },
    validate: {
      email: (value) => {
        const result = emailSchema.safeParse(value).success
          ? null
          : "Invalid email address";
        return result;
      },
      name: (value) => {
        const result = nameSchema.safeParse(value).success
          ? null
          : "Name must be between 2 and 30 characters";
        return result;
      },
      handle: (value) => {
        if (
          userData?.handle &&
          value.toLowerCase() === userData.handle.toLowerCase()
        ) {
          return null;
        }
        const isLengthOk = handleSchema.safeParse(value).success;
        if (!isLengthOk) {
          return "Handle must be between 4 and 20 characters";
        }
        if (isTaken) {
          return "Handle is already taken";
        }
        return null;
      },
      newCommentNotifications: () => null,
      newFollowerNotifications: () => null,
      newReactionNotifications: () => null,
    },
  });

  useEffect(() => {
    if (userData?.id && userData && !form.isDirty()) {
      form.setValues({
        image: userData.image ?? "",
        name: userData.name ?? "",
        handle: userData.handle ?? "",
        email: userData.email ?? "",
        newCommentNotifications: userData.newCommentNotifications,
        newFollowerNotifications: userData.newFollowerNotifications,
        newReactionNotifications: userData.newReactionNotifications,
      });
    }
  }, [form, userData?.id, userData]);

  const forceSettings = useMemo(() => {
    const { name, handle, email } = userData ?? {};
    if (!name) {
      return true;
    }
    if (!handle) {
      return true;
    }
    if (!email) {
      return true;
    }
    return false;
  }, [userData]);
  const checkHandle = useDebouncedCallback(async (handle: string) => {
    const { isTaken } = await utils.user.isHandleTaken.fetch({
      handle,
    });
    setIsTaken(isTaken);
    setIsLoading(false);
    form.validateField("handle");
  }, 500);

  return (
    <Flex justify="space-between" align="center" h="64px" px="sm">
      <Flex>
        <Anchor component={Link} href="/" td="none" c="gray">
          <Flex align="center">
            <Avatar src="/logos/hot-takes.png" />
            <Title className="hide-on-mobile" id="nav-logo">
              Hot-Takes.io
            </Title>
          </Flex>
        </Anchor>
        <Badge
          className="hide-on-mobile"
          variant="gradient"
          gradient={{ from: "red", to: "yellow", deg: 30 }}
          size="xs"
        >
          Alpha 0.0.1
        </Badge>
      </Flex>

      <Flex align="center" justify="flex-end" gap="sm" flex="1">
        <Anchor td="none" href="https://discord.gg/CeJY9YSFGj" target="_blank">
          <Flex align="center" direction="column" justify="center" ml="xs">
            <IconBrandDiscordFilled size={28} />
            <Text size="xs" ta="center">
              Contact
            </Text>
          </Flex>
        </Anchor>
        {userData?.id && (
          <Flex gap="sm" align="center">
            <CreateTake />
            <NotificationsButton />
            <Menu
              shadow="md"
              width={200}
              transitionProps={{ transition: "slide-left", duration: 350 }}
            >
              <Menu.Target>
                <Avatar className="pointer" src={userData.image} />
              </Menu.Target>
              <Menu.Dropdown>
                <Anchor
                  component={Link}
                  td="none"
                  href={`/user/${userData.handle}`}
                >
                  <Menu.Item leftSection={<IconUser />}>Profile</Menu.Item>
                </Anchor>
                <Menu.Item
                  leftSection={<IconSettings />}
                  onClick={() => {
                    open();
                  }}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconLogout />}
                  onClick={async () => {
                    await signOut();
                    router.push("/");
                  }}
                >
                  Sign Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Modal
              opened={opened || forceSettings}
              onClose={close}
              withCloseButton={!forceSettings}
            >
              <Title order={4}>User Settings</Title>
              <form
                onSubmit={form.onSubmit((values) => {
                  if (isTaken) {
                    form.validate();
                  } else {
                    updateUser(values);
                  }
                })}
              >
                <Flex direction="column" gap="md">
                  <TextInput
                    label="Profile image"
                    placeholder="https://example.com/image.jpg"
                    {...form.getInputProps("image")}
                  />
                  <TextInput
                    label="Name"
                    placeholder="Your name"
                    withAsterisk
                    {...form.getInputProps("name")}
                  />
                  <TextInput
                    label="Handle"
                    placeholder="yourhandle"
                    withAsterisk
                    {...form.getInputProps("handle")}
                    onChange={async (e) => {
                      form.setFieldValue("handle", e.target.value);
                      setIsLoading(true);
                      checkHandle(e.target.value);
                    }}
                  />
                  <TextInput
                    label="Email"
                    placeholder="Your email"
                    withAsterisk
                    {...form.getInputProps("email")}
                    disabled
                  />
                </Flex>
                <Title order={4} mt="lg">
                  Email Notifications
                </Title>
                <Checkbox
                  mt="sm"
                  color="lime.4"
                  iconColor="dark.8"
                  size="sm"
                  label="New Comment"
                  key={form.key("newCommentNotifications")}
                  {...form.getInputProps("newCommentNotifications", {
                    type: "checkbox",
                  })}
                />
                <Checkbox
                  disabled
                  mt="sm"
                  color="lime.4"
                  iconColor="dark.8"
                  size="sm"
                  label="New Follower (Coming soon)"
                  key={form.key("newFollowerNotifications")}
                  {...form.getInputProps("newFollowerNotifications", {
                    type: "checkbox",
                  })}
                />
                <Checkbox
                  disabled
                  mt="sm"
                  color="lime.4"
                  iconColor="dark.8"
                  size="sm"
                  label="New reactions (Coming Soon)"
                  key={form.key("newReactionNotifications")}
                  {...form.getInputProps("newReactionNotifications", {
                    type: "checkbox",
                  })}
                />
                <Flex justify="flex-end">
                  <Button
                    mt="lg"
                    type="submit"
                    variant="gradient"
                    loading={isUserLoading || isLoading}
                  >
                    Save
                  </Button>
                </Flex>
              </form>
            </Modal>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
