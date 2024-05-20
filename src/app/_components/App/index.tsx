"use client";
import { Flex } from "@mantine/core";

import React from "react";
import { Modals } from "../Modals";
import { ModalsProvider } from "@mantine/modals";
import { SessionProvider } from "next-auth/react";

type Props = { children: React.ReactNode };

const App = ({ children }: Props) => {
  return (
    <ModalsProvider modals={{ ...Modals /* ...other modals */ }}>
      <SessionProvider>
        <Flex flex="1">{children}</Flex>
      </SessionProvider>
    </ModalsProvider>
  );
};

export default App;
