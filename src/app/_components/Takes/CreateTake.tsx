"use client";
import { Box, Button, Flex, Modal, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { SessionProvider } from "next-auth/react";
import React from "react";

// Rich Text Editor
import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const CreateTake = () => {
  const [opened, { close, open }] = useDisclosure(false);
  const router = useRouter();
  const { mutate: createTake, isPending } = api.take.create.useMutation({
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
        <Box>
          <RichTextEditor editor={editor} onChange={(e) => console.log(e)}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Subscript />
                <RichTextEditor.Superscript />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignJustify />
                <RichTextEditor.AlignRight />
              </RichTextEditor.ControlsGroup>

              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content />
          </RichTextEditor>
        </Box>
        <Flex justify="flex-end" gap="md" mt="md">
          <Button
            color="red"
            onClick={() => {
              editor?.commands.clearContent();
              close();
            }}
          >
            I chicken out
          </Button>
          <Button
            loading={isPending}
            onClick={() => {
              console.log(editor?.getJSON());
              const content = editor?.getJSON();
              if (content) {
                createTake({ content });
              }
            }}
          >
            I said what I said!
          </Button>
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
