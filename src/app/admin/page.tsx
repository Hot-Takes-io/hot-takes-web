import {
  Anchor,
  Avatar,
  Box,
  Flex,
  Table,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from "@mantine/core";

import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const Admin = async () => {
  const session = await getServerAuthSession();

  if (session?.user.email !== "suarezluis@gmail.com") {
    return (
      <Flex flex="1" justify="center" align="center">
        <Title order={1}>You are not authorized to view this page</Title>
      </Flex>
    );
  }
  const users = await api.user.getAllUsers();
  return (
    <Flex flex="1" p="md">
      <Box>
        <Title order={4}>Users</Title>
        <Table striped>
          <TableThead>
            <TableTr>
              <TableTh></TableTh>
              <TableTh></TableTh>
              <TableTh>Handle</TableTh>
              <TableTh>Name</TableTh>
              <TableTh>Email</TableTh>
              <TableTh>Followers</TableTh>
              <TableTh>Following</TableTh>
              <TableTh>Takes</TableTh>
              <TableTh>Comments</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {users.map((user, index) => (
              <TableTr key={user.id}>
                <TableTh>{index + 1}</TableTh>
                <TableTh>
                  <Anchor href={`/user/${user.handle}`}>
                    <Avatar src={user.image} />
                  </Anchor>
                </TableTh>
                <TableTh>{user.handle}</TableTh>
                <TableTh>{user.name}</TableTh>
                <TableTh>{user.email}</TableTh>
                <TableTh>{user._count.followers}</TableTh>
                <TableTh>{user._count.following}</TableTh>
                <TableTh>{user._count.takes}</TableTh>
                <TableTh>{user._count.comments}</TableTh>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default Admin;
