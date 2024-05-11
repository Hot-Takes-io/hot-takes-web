"use client";
import { Flex } from "@mantine/core";

import React from "react";
import { Modals } from "../Modals";
import { ModalsProvider } from "@mantine/modals";

type Props = { children: React.ReactNode };

const App = ({ children }: Props) => {
  return (
    <ModalsProvider modals={{ ...Modals /* ...other modals */ }}>
      <Flex flex="1">{children}</Flex>
    </ModalsProvider>
  );
};

export default App;
