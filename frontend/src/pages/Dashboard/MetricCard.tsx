import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function MetricCard({
  title,
  value,
  subtitle,
}: MetricCardProps) {
  return (
    <Paper
      sx={{ p: 2, borderRadius: 1, bgcolor: "background.paper" }}
      elevation={0}
    >
      <Box>
        <Typography variant="subtitle2" component="div">
          {title}
        </Typography>
        <Typography variant="h5" component="div">
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
}
