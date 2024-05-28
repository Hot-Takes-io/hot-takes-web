import {
  Anchor,
  Avatar,
  Flex,
  ScrollAreaAutosize,
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

  if (!session?.user.isSuperAdmin) {
    return (
      <Flex flex="1" justify="center" align="center">
        <Title order={1}>You are not authorized to view this page</Title>
      </Flex>
    );
  }
  const users = await api.user.getAllUsers();
  return (
    <Flex flex="1" p="md" direction="column">
      <Title order={4}>Users</Title>
      <ScrollAreaAutosize mah="calc(100vh - 120px)">
        <Table striped>
          <TableThead>
            <TableTr>
              <TableTh></TableTh>
              <TableTh></TableTh>
              <TableTh>Handle</TableTh>
              <TableTh>Name</TableTh>
              <TableTh>Email</TableTh>
              <TableTh>Takes</TableTh>
              <TableTh>Comments</TableTh>
              <TableTh>Reactions</TableTh>
              <TableTh>Followers</TableTh>
              <TableTh>Following</TableTh>
              <TableTh>Providers</TableTh>
              <TableTh>Last Login</TableTh>
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
                <TableTh>{user._count.takes}</TableTh>
                <TableTh>{user._count.comments}</TableTh>
                <TableTh>{user._count.takeReactions}</TableTh>
                <TableTh>{user._count.followers}</TableTh>
                <TableTh>{user._count.following}</TableTh>
                <TableTh>
                  email,{" "}
                  {user.accounts
                    ?.map((account) => {
                      return account.provider;
                    })
                    .join(", ")}
                </TableTh>
                <TableTh>{user.lastLogin?.toLocaleString() ?? ""}</TableTh>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      </ScrollAreaAutosize>
    </Flex>
  );
};

export default Admin;
