"use client";
import { Flex } from "@mantine/core";
import React from "react";

type Props = { children: React.ReactNode };

const App = ({ children }: Props) => {
  return <Flex flex="1">{children}</Flex>;
};

export default App;
