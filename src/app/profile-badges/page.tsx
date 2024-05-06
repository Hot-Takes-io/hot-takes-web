import { Flex, Title, Text, ScrollAreaAutosize } from "@mantine/core";
import { db } from "~/server/db";
import ProfileBadge, {
  ProfileBadgeSize,
} from "../_components/ProfileBadge/ProfileBadge";

const ProfileBadgesView = async () => {
  const profileBadges = await db.userBadge.findMany();
  return (
    <ScrollAreaAutosize component={Flex} flex="1" mah="calc(100vh - 63px)">
      <Flex wrap="wrap">
        {profileBadges.map((profileBadge) => (
          <Flex
            direction="column"
            align="center"
            key={profileBadge.id}
            p="sm"
            w="25rem"
          >
            <ProfileBadge
              name={profileBadge.name}
              image={profileBadge.imageURL}
              size={ProfileBadgeSize.xxxl}
            />

            <Title order={2}>{profileBadge.name}</Title>
            <Text>{profileBadge.description}</Text>
            <Flex>
              <Title order={5}>Limit</Title>:<Text>{profileBadge.limit}</Text>
            </Flex>
          </Flex>
        ))}
      </Flex>
    </ScrollAreaAutosize>
  );
};

export default ProfileBadgesView;
