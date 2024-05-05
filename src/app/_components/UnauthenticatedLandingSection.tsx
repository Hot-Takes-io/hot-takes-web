"use client";
import {
  Card,
  Text,
  CardSection,
  Flex,
  Badge,
  Box,
  Button,
} from "@mantine/core";
import { IconArrowBigLeftLines } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

const UnauthenticatedLandingSection = () => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  return (
    <Flex flex="1">
      <Card>
        <CardSection p="md">
          <Text>
            Hot-Takes.io is a platform for sharing your opinions on the
            internet. It&apos;s a place where you can share your thoughts,
            ideas, and TAKES with the world.
          </Text>
          <Text>
            Sharing your opinions can be very powerful,&nbsp;
            <Text
              component="span"
              fw="900"
              variant="gradient"
              size="lg"
              gradient={{ from: "red", to: "yellow", deg: 30 }}
            >
              but with great power comes great responsibility.
            </Text>
            &nbsp;So, type under your own risk.
          </Text>
          <br />
          <Text>
            This is a community of savage nerds, and we don&apos;t take
            prisoners. Your takes will be voted by us and they will earn the
            following badges:
          </Text>
          <Flex direction="column" gap="sm" align="center" p="sm">
            <Flex gap="sm">
              <Box>
                <Badge
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "red", to: "yellow", deg: 30 }}
                >
                  Hot Take
                </Badge>
              </Box>
              <Text>
                This is a hot take, it&apos;s on fire 🔥 and you kinda know what
                you are talking about.
              </Text>
            </Flex>
            <Flex gap="sm">
              <Box>
                <Badge
                  size="lg"
                  variant="gradient"
                  gradient={{ from: "brown", to: "gray", deg: 30 }}
                >
                  Hot Shit
                </Badge>
              </Box>
              <Text>
                This is hot shit 💩, it stinks and if you justify the air you
                are breathing is debatable at this point.
              </Text>
            </Flex>
            <Flex gap="sm">
              <Box>
                <Badge size="lg" variant="outline" color="gray">
                  ¯\_(ツ)_/¯
                </Badge>
              </Box>
              <Text>
                No one cares 🤷‍♂️ about this, but give it some time. Like you,
                everyone has an opinion.
              </Text>
            </Flex>
            <Flex align="center" gap="sm">
              <IconArrowBigLeftLines size="80" />
              <Text>
                Take these nerds for example, they dared to express themselves
                and we bet you are dying to go let them have a piece of your
                mind right?
              </Text>
            </Flex>
            <Text>
              Well we are dying 💀 to let you have a piece of ours, so jump
              right in if you have what it takes.
            </Text>
            <Text>
              If you{" "}
              <Text component="span" td="line-through">
                are ready
              </Text>{" "}
              think that you are tough enough, click the button below to sign in
              and start sharing your takes.
            </Text>
          </Flex>
          <Flex justify="center" p="md">
            <Button
              loading={isSigningIn}
              onClick={async () => {
                setIsSigningIn(true);
                signIn("github")
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
          </Flex>
          <Text mt="sm">
            PS. Don&apos;t you f***ing dare to call this site &#34;Social
            Media&#34; 👊.
          </Text>
        </CardSection>
      </Card>
    </Flex>
  );
};

export default UnauthenticatedLandingSection;
