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
      rel: "icon",
      url: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>",
    },
  ],
};

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
            <Flex h="100vh" w="100vw" direction="column">
              <Header />
              <App>{children}</App>
            </Flex>
          </MantineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
