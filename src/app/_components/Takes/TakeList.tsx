"use client";

import { Flex, Loader, ScrollAreaAutosize, Title } from "@mantine/core";

import TakeCard from "./TakeCard";
import { type Content } from "@tiptap/react";
import { TakeFetchTarget } from "~/app/_sharedTypes";
import { api } from "~/trpc/react";
import UnauthenticatedLandingSection from "../UnauthenticatedLandingSection";
import { useSession } from "next-auth/react";

type Props = {
  title: string;
  listType: TakeFetchTarget;
};
const TakeList = ({ title, listType }: Props) => {
  const { data: takes, isLoading } = api.take.get.useQuery({
    fetchTarget: listType,
  });
  const session = useSession();
  if (isLoading) {
    return (
      <Flex flex="1" align="center" justify="center" mih="calc(100vh - 120px)">
        <Loader size="xl" type="bars" />
      </Flex>
    );
  }

  return (
    <Flex flex="1" direction="column" miw="325px">
      <Title order={3} mx="auto" my="xs">
        {title}
      </Title>
      {takes ? (
        <ScrollAreaAutosize mah={"calc(100vh - 120px)"}>
          {!session.data?.user && <UnauthenticatedLandingSection />}
          {takes.map((take) => (
            <TakeCard
              key={take.id}
              by={{
                name: take.createdBy.name ?? "",
                image: take.createdBy.image ?? "",
                handle: take.createdBy.handle ?? "",
                id: take.createdBy.id,
              }}
              content={take.content as Content}
              createdAt={take.createdAt}
              commentsCount={take._count.comments}
              takeId={take.id}
            />
          ))}
        </ScrollAreaAutosize>
      ) : (
        <Flex flex="1" align="center">
          <Title order={3} mx="auto">
            Seems like there is nothing here yet,{" "}
            {listType === TakeFetchTarget.All
              ? "be the first to take a stand!"
              : "follow some nerds to see their takes!"}
          </Title>
        </Flex>
      )}
    </Flex>
  );
};

export default TakeList;
