"use client";
import { Flex } from "@mantine/core";

import React from "react";
import { Modals } from "../Modals";
import { ModalsProvider } from "@mantine/modals";
import { SessionProvider } from "next-auth/react";

type Props = { children: React.ReactNode };

const App = ({ children }: Props) => {
  return (
    <SessionProvider>
      <ModalsProvider modals={{ ...Modals /* ...other modals */ }}>
        <Flex flex="1">{children}</Flex>
      </ModalsProvider>
    </SessionProvider>
  );
};

export default App;
