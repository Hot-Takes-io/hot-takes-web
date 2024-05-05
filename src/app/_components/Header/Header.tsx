"use client";
import { Anchor, Avatar, Badge, Flex, Menu, Title } from "@mantine/core";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import React from "react";
import CreateTake from "../Takes/CreateTake";
import PoweredBy from "./PoweredBy";
import Link from "next/link";
import { IconLogout, IconSettings, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const session = useSession();
  const router = useRouter();
  return (
    <Flex justify="space-between" align="center" mah="60px" px="sm" flex="1">
      <Flex>
        <Anchor component={Link} href="/" td="none" c="gray">
          <Title id="nav-logo">🔥 Hot-Takes.io</Title>
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
          <Flex gap="sm">
            <CreateTake />
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
                  href={`/${session.data?.user.handle}`}
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
