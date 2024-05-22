import { Flex, Text, Title } from "@mantine/core";
import React from "react";

const WpAdmin = () => {
  return (
    <Flex direction="column" justify="center" align="center" flex="1" gap="sm">
      <Title order={1}>Nice try</Title>
      <Text size="150px">🖕</Text>
      <Title order={2}>You wish hacker wannabe!</Title>
    </Flex>
  );
};

export default WpAdmin;
