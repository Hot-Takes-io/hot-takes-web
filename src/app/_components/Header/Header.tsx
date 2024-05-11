"use client";
import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Flex,
  Menu,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import React from "react";
import CreateTake from "../Takes/CreateTake";
import PoweredBy from "./PoweredBy";
import Link from "next/link";
import {
  IconBell,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const session = useSession();
  const router = useRouter();
  return (
    <Flex justify="space-between" align="center" mah="60px" px="sm" flex="1">
      <Flex>
        <Anchor component={Link} href="/" td="none" c="gray">
          <Flex align="center">
            <Avatar src="/logos/hot-takes.png" />
            <Title id="nav-logo">Hot-Takes.io</Title>
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
        <PoweredBy />
      </Flex>
      <Flex align="center" justify="flex-end" gap="sm" flex="1">
        {session.data?.user.id && (
          <Flex gap="sm" align="center">
            <CreateTake />
            <Box pos="relative">
              <ThemeIcon
                autoContrast
                variant="gradient"
                size="lg"
                aria-label="Gradient action icon"
                gradient={
                  false
                    ? { from: "red", to: "yellow", deg: 30 }
                    : { from: "blue", to: "cyan", deg: 90 }
                }
              >
                <IconBell />
                <Badge
                  size="xs"
                  color="blue"
                  pos="absolute"
                  top="-5px"
                  right="-5px"
                >
                  0
                </Badge>
              </ThemeIcon>
            </Box>
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

const WithSessionProvider = () => (
  <SessionProvider>
    <Header />
  </SessionProvider>
);

export default WithSessionProvider;
