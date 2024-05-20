import "~/styles/globals.css";
import { Roboto_Mono } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { ColorSchemeScript, MantineProvider, Flex } from "@mantine/core";
import { Analytics } from "@vercel/analytics/react";

import App from "./_components/App";

import { getServerAuthSession } from "~/server/auth";
import React from "react";

const roboto = Roboto_Mono({
  subsets: ["latin"],
});

export const metadata = {
  title: "Hot Takes",
  description: "The Web Arena for Hot Takes 🔥",
  icons: [
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
    { rel: "manifest", url: "/site.webmanifest" },
  ],
};

declare global {
  interface window {
    innerWidth: number;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      if (child) {
        return React.cloneElement(child as React.ReactElement, {
          session,
        });
      }
      return null;
    });
  };

  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={roboto.className}>
        <TRPCReactProvider>
          <Analytics />
          <MantineProvider forceColorScheme="dark">
            <Flex flex="1" direction="column">
              <App>{renderChildren()}</App>
            </Flex>
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
