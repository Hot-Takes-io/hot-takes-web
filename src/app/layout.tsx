import "~/styles/globals.css";
import { Roboto_Mono } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { ColorSchemeScript, MantineProvider, Flex } from "@mantine/core";

import App from "./_components/App";
import Header from "./_components/Header/Header";

const roboto = Roboto_Mono({
  subsets: ["latin"],
});

export const metadata = {
  title: "Hot Takes",
  description: "The Dev Arena for Hot Takes 🔥",
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

{
  /* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"></link> */
}

declare global {
  interface window {
    innerWidth: number;
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={roboto.className}>
        <TRPCReactProvider>
          <MantineProvider forceColorScheme="dark">
            <Flex flex="1" direction="column">
              <Header />
              <App>{children}</App>
            </Flex>
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
