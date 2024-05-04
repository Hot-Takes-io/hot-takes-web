"use client";
import { Avatar, Badge, Button, Flex, Title } from "@mantine/core";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import React from "react";
import CreateTake from "../Takes/CreateTake";
import PoweredBy from "./PoweredBy";

const Header = () => {
  const session = useSession();
  return (
    <Flex justify="space-between" align="center" h="60px" px="sm">
      <Flex>
        <Title>🔥 Hot-Takes.io</Title>
        <Badge
          variant="gradient"
          gradient={{ from: "red", to: "yellow", deg: 30 }}
          size="xs"
        >
          Alpha 0.0.1
        </Badge>
        <PoweredBy />
      </Flex>
      <Flex align="center" gap="sm">
        {session.data?.user.id && (
          <Flex gap="sm">
            <CreateTake />
            <Avatar src={session.data?.user.image} />
          </Flex>
        )}

        {session.data?.user.id && (
          <Button onClick={() => signOut()} size="xs" color="red">
            Sign Out
          </Button>
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
