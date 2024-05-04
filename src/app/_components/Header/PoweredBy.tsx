import { Anchor, Flex, TooltipFloating } from "@mantine/core";

import { type StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import React from "react";
import TypeScriptLogo from "src/app/assets/images/svg/ts-logo-128.svg";

const powerdBy = [
  {
    name: "Vercel",
    link: "https://vercel.com",
    logo: "https://avatars.githubusercontent.com/u/14985020?s=36&v=4",
  },
  {
    name: "T3 Stack",
    link: "https://create.t3.gg",
    logo: "https://avatars.githubusercontent.com/u/108266839?s=36&v=4",
  },
  {
    name: "TypeScript",
    link: "https://www.typescriptlang.org/",
    logo: TypeScriptLogo as StaticImport,
  },
  {
    name: "Prisma",
    link: "https://prisma.io",
    logo: "https://avatars.githubusercontent.com/u/17219288?s=36&v=4",
  },
  {
    name: "tRPC",
    link: "https://trpc.io",
    logo: "https://avatars.githubusercontent.com/u/78011399?s=36&v=4",
  },
  {
    name: "NextAuth.js",
    link: "https://next-auth.js.org",
    logo: "https://avatars.githubusercontent.com/u/67470890?s=36&v=4",
  },
  {
    name: "Mantine",
    link: "https://mantine.dev",
    logo: "https://avatars.githubusercontent.com/u/79146003?s=36&v=4",
  },
  {
    name: "Sentry",
    link: "https://sentry.io",
    logo: "https://avatars.githubusercontent.com/u/1396951?s=36&v=4",
  },
];

const PoweredBy = () => {
  return (
    <Flex flex="1" align="center" gap="xs">
      &nbsp;Powered By:
      {powerdBy.map((sponsor) => (
        <TooltipFloating key={sponsor.name} label={sponsor.name} color="black">
          <Anchor href={sponsor.link} target="_blank" rel="noreferrer">
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              width={36}
              height={36}
            />
          </Anchor>
        </TooltipFloating>
      ))}
      Sponsored By: No one 😢 (yet!)
    </Flex>
  );
};

export default PoweredBy;
