import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import MainTitle from "../components/general/MainTitle";
import { UserContext } from "../context/userContext";
import { deleteBookedQueue, fetchUserBookedQueues } from "../api/queuesApi";
import BookedQueue from "../components/queues/BookedQueue";
import { DialogContext } from "../context/DialogContext";
import { alertMessage } from "../tools/AlertMessage";

function Queues() {
  const [queuesToView, setQueuesToView] = useState(0);
  const { loggedUser } = useContext(UserContext);
  const queryClient = useQueryClient();
  const { handleOpenDialog, handleDialogText, handleSetDialogFunction } =
    useContext(DialogContext);

  // fetch user queues by user id
  const { data: queues } = useQuery({
    queryKey: ["queues", loggedUser.id],
    queryFn: fetchUserBookedQueues,
    onError: (error) => {
      console.error("Could not get queues", error);
    },
  });

  const deleteQueueMutation = useMutation({
    mutationFn: deleteBookedQueue,
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries(["queues"], { exact: true });
        alertMessage("success", "Queue was deleted");
      }
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const handleDeleteQueue = (id) => {
    handleOpenDialog(true);
    handleDialogText("Are you sure you want to delete this queue ?");
    handleSetDialogFunction(() => deleteQueueMutation.mutate(id));
  };

  const handleChange = (event, newQueueToView) => {
    setQueuesToView(newQueueToView);
  };

  const renderFutureQueues = () => {
    if (queues?.data.futureQueues.length) {
      return queues?.data.futureQueues.map((queue, index) => {
        return (
          <BookedQueue
            key={queue.queueTime}
            queue={queue}
            index={index}
            handleDeleteQueue={handleDeleteQueue}
          />
        );
      });
    } else return <Typography variant="h3">No future queues</Typography>;
  };
  const renderPastQueues = () => {
    if (queues?.data.pastQueues.length) {
      return queues?.data.pastQueues.map((queue, index) => {
        return (
          <BookedQueue key={queue.queueTime} queue={queue} index={index} />
        );
      });
    } else return <Typography variant="h3">No past queues</Typography>;
  };

  return (
    <Container>
      <MainTitle title="Booked queues" />

      <Box sx={{ borderColor: "divider" }}>
        <Tabs
          value={queuesToView}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Future queues" />
          <Tab label="Past queues" />
        </Tabs>
      </Box>

      <Stack marginTop="24px" rowGap="16px">
        {queuesToView === 0 ? renderFutureQueues() : renderPastQueues()}
      </Stack>
    </Container>
  );
}

export default Queues;
