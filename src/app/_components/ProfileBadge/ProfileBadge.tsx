import { Box, Tooltip } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  size?: ProfileBadgeSize;
  image: string;
  name: string;
  withLink?: boolean;
};

export enum ProfileBadgeSize {
  xxxs = "xxxs",
  xxs = "xxs",
  xs = "xs",
  sm = "sm",
  md = "md",
  lg = "lg",
  xl = "xl",
  xxl = "xxl",
  xxxl = "xxxl",
}

const ProfileBadge = ({ size, image, name, withLink }: Props) => {
  let badgeSize = 32;
  switch (size) {
    case ProfileBadgeSize.xxxs:
      badgeSize = 12;
      break;
    case ProfileBadgeSize.xxs:
      badgeSize = 16;
      break;
    case ProfileBadgeSize.xs:
      badgeSize = 24;
      break;
    case ProfileBadgeSize.sm:
      badgeSize = 32;
      break;
    case ProfileBadgeSize.md:
      badgeSize = 48;
      break;
    case ProfileBadgeSize.lg:
      badgeSize = 64;
      break;
    case ProfileBadgeSize.xl:
      badgeSize = 96;
      break;
    case ProfileBadgeSize.xxl:
      badgeSize = 128;
      break;
    case ProfileBadgeSize.xxxl:
      badgeSize = 256;
      break;
  }

  return (
    <Box>
      <Tooltip label={name} disabled={!withLink} position="bottom">
        <Link href={withLink ? `/profile-badges` : ""}>
          <Image
            src={image}
            alt={`${name} badge`}
            height={badgeSize}
            width={badgeSize}
          />
        </Link>
      </Tooltip>
    </Box>
  );
};

export default ProfileBadge;
