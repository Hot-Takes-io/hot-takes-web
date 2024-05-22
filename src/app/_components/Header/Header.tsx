"use client";
import { Anchor, Avatar, Badge, Flex, Menu, Title, Text } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import CreateTake from "../Takes/CreateTake";
import Link from "next/link";
import {
  IconBrandDiscordFilled,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import NotificationsButton from "../NotificationsButton";

const Header = () => {
  const router = useRouter();
  const session = useSession();
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
            <IconBrandDiscordFilled size={24} />
            <Text size="xs" ta="center">
              Contact
            </Text>
          </Flex>
        </Anchor>
        {session.data?.user?.id && (
          <Flex gap="sm" align="center">
            <CreateTake />
            <NotificationsButton />
            <Menu
              shadow="md"
              width={200}
              transitionProps={{ transition: "slide-left", duration: 350 }}
            >
              <Menu.Target>
                <Avatar className="pointer" src={session.data?.user.image} />
              </Menu.Target>
              <Menu.Dropdown>
                <Anchor
                  component={Link}
                  td="none"
                  href={`/user/${session.data?.user.handle}`}
                >
                  <Menu.Item leftSection={<IconUser />}>Profile</Menu.Item>
                </Anchor>
                <Menu.Item leftSection={<IconSettings />}>Settings</Menu.Item>
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
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
