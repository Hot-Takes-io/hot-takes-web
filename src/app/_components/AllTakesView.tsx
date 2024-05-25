"use client";

import { Box, Flex, Tabs } from "@mantine/core";
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
      <Box flex="1" className="hide-on-mobile"></Box>
    </Flex>
  );
};

export default AllTakesView;
