import { Flex } from "@mantine/core";

import TakeList from "./_components/Takes/TakeList";

import UnauthenticatedLandingSection from "./_components/UnauthenticatedLandingSection";
import { TakeFetchTarget } from "./_sharedTypes";

export default async function Home() {
  return (
    <Flex flex="1" direction="column">
      <Flex flex="1" p="sm" gap="sm" wrap="wrap-reverse">
        <TakeList
          title="Trending Takes from all nerds"
          listType={TakeFetchTarget.All}
        />

        <TakeList
          title="Takes from nerds you follow"
          listType={TakeFetchTarget.Following}
        />
      </Flex>
    </Flex>
  );
}
