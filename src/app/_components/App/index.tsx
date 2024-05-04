"use client";
import { Flex } from "@mantine/core";
import React from "react";

type Props = { children: React.ReactNode };

const App = ({ children }: Props) => {
  const [windowWidth, setWindowWidth] = React.useState<number>(501);
  React.useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);
  return (
    <Flex flex="1">
      {windowWidth > 500 ? <>{children}</> : <div>Mobile</div>}
    </Flex>
  );
};

export default App;
