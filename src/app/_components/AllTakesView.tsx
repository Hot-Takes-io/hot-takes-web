"use client";

import { Flex } from "@mantine/core";
import React from "react";
import TakeList from "./Takes/TakeList";

import UnauthenticatedLandingSection from "./UnauthenticatedLandingSection";
import { useSession } from "next-auth/react";
import { TakeFetchTarget } from "../_sharedTypes";

const AllTakesView = () => {
  const session = useSession();
  return (
    <Flex flex="1" direction="column">
      <Flex flex="1" p="sm" gap="sm" wrap="wrap-reverse">
        <TakeList
          title="Trending Takes from all nerds"
          listType={TakeFetchTarget.All}
        />
        {session.data?.user.id ? (
          <TakeList
            title="Takes from nerds you follow"
            listType={TakeFetchTarget.Following}
          />
        ) : (
          <UnauthenticatedLandingSection />
        )}
      </Flex>
    </Flex>
  );
};

export default AllTakesView;
