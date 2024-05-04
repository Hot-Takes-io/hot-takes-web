import { Flex, ScrollAreaAutosize, Title } from "@mantine/core";
import React from "react";
import { api } from "~/trpc/server";
import TakeCard from "./TakeCard";
import { type Content } from "@tiptap/react";
import { TakeFetchTarget } from "~/server/api/routers/take";

type Props = {
  title: string;
  listType: TakeFetchTarget;
};
const TakeList = async ({ title, listType }: Props) => {
  const takes = await api.take.fetch({ fetchTarget: listType });
  return (
    <Flex flex="1" direction="column">
      <Title order={3} mx="auto">
        {title}
      </Title>
      {takes.length > 0 ? (
        <ScrollAreaAutosize mah={"calc(100vh - 120px)"}>
          {takes.map((take) => (
            <TakeCard
              key={take.id}
              by={{
                name: take.createdBy.name ?? "",
                image: take.createdBy.image ?? "",
                handle: take.createdBy.handle ?? "",
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
