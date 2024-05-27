"use client";
import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";
import React from "react";

const SignInButton = () => {
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  return (
    <Button
      loading={isSigningIn}
      onClick={async () => {
        setIsSigningIn(true);
        signIn()
          .then((params) => {
            console.info("Signed in", params);
          })
          .catch((e) => {
            console.error("Failed to sign in", e);
          });
      }}
      variant="gradient"
      gradient={{ from: "red", to: "yellow", deg: 30 }}
    >
      Sign In
    </Button>
  );
};

export default SignInButton;
