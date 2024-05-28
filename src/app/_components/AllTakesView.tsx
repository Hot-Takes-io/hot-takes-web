"use client";

import { Box, Flex, Tabs, Title } from "@mantine/core";
import TakeList from "./Takes/TakeList";

import { useSession } from "next-auth/react";
import { TakeFetchTarget } from "../_sharedTypes";
import PoweredBy from "./Header/PoweredBy";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { modals } from "@mantine/modals";
import { ModalNames } from "./Modals";

const AllTakesView = () => {
  const session = useSession();
  const searchParams = useSearchParams();
  const takeId = searchParams.get("takeId");

  useEffect(() => {
    if (takeId) {
      modals.openContextModal({
        modal: ModalNames.TakeModalView,
        innerProps: {
          takeId: parseInt(takeId),
        },
        size: "xl",
      });
    }
  }, [takeId]);
  enum TabValues {
    All = "all",
    Following = "following",
  }

  return (
    <Flex flex="1" justify="center">
      <Box flex="1" className="hide-on-mobile">
        <PoweredBy />
      </Box>
      <Flex justify="center" flex="3">
        <Tabs defaultValue={TabValues.All}>
          <Tabs.List>
            <Tabs.Tab value={TabValues.All}>All Takes</Tabs.Tab>
            {session.data?.user.id && (
              <Tabs.Tab value={TabValues.Following}>
                From nerds you follow
              </Tabs.Tab>
            )}
          </Tabs.List>
          <Tabs.Panel value={TabValues.All}>
            <TakeList
              title="Trending Takes from all nerds"
              listType={TakeFetchTarget.All}
            />
          </Tabs.Panel>

          <Tabs.Panel value={TabValues.Following}>
            <TakeList
              title="Takes from nerds you follow"
              listType={TakeFetchTarget.Following}
            />
          </Tabs.Panel>
        </Tabs>
      </Flex>
      <Flex
        flex="1"
        className="hide-on-mobile"
        direction="column"
        align="center"
        pt="xl"
      >
        <Title order={4} mb="sm">
          Hot-Takes.io is
        </Title>
        <iframe
          width="280"
          height="158"
          src="https://www.youtube.com/embed/SV-omrkCpDo?si=uoPIQTClBj-1pKy4"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <Title order={4} mt="sm">
          Made in Texas
        </Title>
      </Flex>
    </Flex>
  );
};

export default AllTakesView;
