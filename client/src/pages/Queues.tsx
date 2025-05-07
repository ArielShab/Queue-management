import { SyntheticEvent, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import MainTitle from '../components/MainTitle';
import { UserContext } from '../contexts/userContext';
import { fetchBookedQueues } from '../api/queuesApi';
import BookedQueue from '../components/BookedQueue';
import { UserContextType } from '../types/UserContextType';
import { QueueType } from '../types/QueueType';
import ErrorScrean from '../components/ErrorScreen';

function Queues() {
  const [queuesToView, setQueuesToView] = useState<number>(0);
  const { loggedUser } = useContext(UserContext) as UserContextType;

  // fetch user queues by user id
  const {
    data: queues,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['queues', loggedUser?.id, false],
    queryFn: () => fetchBookedQueues(+loggedUser?.id, false),
    enabled: !!loggedUser?.id,
  });

  const handleChangeDisplayQueues = (
    _: SyntheticEvent,
    newQueueToView: number,
  ) => {
    setQueuesToView(newQueueToView);
  };

  const renderFutureQueues = () => {
    if (queues?.data.futureQueues.length) {
      return queues?.data.futureQueues.map(
        (queue: QueueType, index: number) => {
          return (
            <BookedQueue key={queue.queueTime} queue={queue} index={index} />
          );
        },
      );
    } else return <Typography variant="h3">No future queues</Typography>;
  };
  const renderPastQueues = () => {
    if (queues?.data.pastQueues.length) {
      return queues?.data.pastQueues.map((queue: QueueType, index: number) => {
        return (
          <BookedQueue key={queue.queueTime} queue={queue} index={index} />
        );
      });
    } else return <Typography variant="h3">No past queues</Typography>;
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <ErrorScrean error={JSON.stringify(error)} />;

  return (
    <Container>
      <MainTitle title="Booked queues" />

      <Box sx={{ borderColor: 'divider' }}>
        <Tabs
          value={queuesToView}
          onChange={handleChangeDisplayQueues}
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
