import { Box, IconButton, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";

function BookedQueue({ queue, index, handleDeleteQueue, client = false }) {
  return (
    <Stack direction="row" alignItems="flex-start">
      <Box flexGrow="1">
        <Typography fontWeight="600">{`${index + 1}. ${dayjs(
          queue.queueTime
        ).format("DD/MM/YYYY")} - ${dayjs(queue.queueTime).format(
          "HH:mm"
        )}`}</Typography>
        <Typography>
          {client
            ? `${queue.userName} - ${queue.userEmail}`
            : `${queue.clientName} - ${queue.clientEmail}`}
        </Typography>
        <Typography>{queue.serviceName}</Typography>
      </Box>
      {handleDeleteQueue && (
        <IconButton
          onClick={() => handleDeleteQueue(queue.id)}
          sx={{ padding: "unset" }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </Stack>
  );
}

export default BookedQueue;
