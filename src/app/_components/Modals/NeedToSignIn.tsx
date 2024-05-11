"use client";
import { Box, Flex } from "@mantine/core";
import { type ContextModalProps } from "@mantine/modals";
import SignInButton from "../SignInButton";

type Props = ContextModalProps<{ action: string }>;

const NeedToSignIn = ({ innerProps }: Props) => {
  const { action } = innerProps;
  return (
    <>
      <Box>Really? Trying to {action} without signing in?</Box>
      <Flex justify="end" mt="sm">
        <SignInButton />
      </Flex>
    </>
  );
};

export default NeedToSignIn;
