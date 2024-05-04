import { getServerAuthSession } from "~/server/auth";
import { Box, Flex } from "@mantine/core";

import TakeList from "./_components/Takes/TakeList";
import { TakeFetchTarget } from "~/server/api/routers/take";
import UnauthenticatedLandingSection from "./_components/UnauthenticatedLandingSection";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <Flex flex="1" direction="column">
      <Flex flex="1" p="sm" gap="sm">
        <TakeList
          title="Trending Takes from all nerds"
          listType={TakeFetchTarget.All}
        />
        {session?.user.id ? (
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
}
