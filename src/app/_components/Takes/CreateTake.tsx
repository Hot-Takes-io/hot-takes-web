"use client";
import { Box, Button, Flex, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SessionProvider } from "next-auth/react";
import React from "react";

// Rich Text Editor
import { Link } from "@mantine/tiptap";
import { type Content, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import RichEditor from "../RichEditor/RichEditor";

const CreateTake = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const router = useRouter();
  const { mutate: createTake } = api.take.create.useMutation({
    onSettled: async () => {
      router.refresh();
      editor?.commands.clearContent();
      close();
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
    ],
  });
  const handleSubmit = (content: Content) => {
    console.log(editor?.getJSON());
    if (content) {
      createTake({ content });
    }
  };
  return (
    <Box>
      <Button size="md" fz="xs" variant="subtle" onClick={open}>
        I have an opinion
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title={<Title order={2}>Of course you do! type away nerd!</Title>}
        size="auto"
      >
        <Flex h="20rem">
          <RichEditor
            onSubmit={handleSubmit}
            submitLabel="I said what I said!"
            onCancel={close}
            cancelLabel="I chickened out"
          />
        </Flex>
      </Modal>
    </Box>
  );
};

const WithSession = () => (
  <SessionProvider>
    <CreateTake />
  </SessionProvider>
);

export default WithSession;
