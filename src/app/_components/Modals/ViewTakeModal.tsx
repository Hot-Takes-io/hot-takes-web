"use client";
import React from "react";
import { type ContextModalProps } from "@mantine/modals";
import { Button, Text } from "@mantine/core";

type Props = ContextModalProps<{ takeId: string }>;

const ViewTakeModal = ({ context, id, innerProps }: Props) => {
  console.log(context);
  const modal = context?.modals?.find((modal) => modal?.id === id);
  if (!modal) {
    return null;
  }
  modal.props.title = "View Take";
  return (
    <div>
      <Text>{innerProps.takeId}</Text>
      <Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
        Close modal
      </Button>
    </div>
  );
};

export default ViewTakeModal;
