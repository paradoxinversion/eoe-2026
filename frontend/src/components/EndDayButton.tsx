import React from "react";
import Button from "@mui/material/Button";

type Props = {
  onEndDay: () => void;
  disabled?: boolean;
  label?: string;
};

export default function EndDayButton({ onEndDay, disabled, label }: Props) {
  return (
    <Button
      variant="contained"
      onClick={onEndDay}
      disabled={disabled}
      aria-label={label || "End Turn"}
    >
      {label || "End Day"}
    </Button>
  );
}
