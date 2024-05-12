import { Flex, Text, Title } from "@mantine/core";
import React from "react";

const FourOFour = () => {
  return (
    <Flex direction="column" justify="center" align="center" flex="1" gap="sm">
      <Title order={1}>Error 404</Title>
      <Text size="150px">💩</Text>
      <Title order={2}>This page could not be found.</Title>
    </Flex>
  );
};

export default FourOFour;
