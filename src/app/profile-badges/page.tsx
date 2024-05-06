import { Flex, Title, Text } from "@mantine/core";
import { db } from "~/server/db";
import ProfileBadge, {
  ProfileBadgeSize,
} from "../_components/ProfileBadge/ProfileBadge";

const ProfileBadgesView = async () => {
  const profileBadges = await db.userBadge.findMany();
  return (
    <Flex flex="1" wrap="wrap" gap="sm">
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
  );
};

export default ProfileBadgesView;
