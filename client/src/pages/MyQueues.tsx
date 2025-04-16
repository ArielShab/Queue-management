import {
  Box,
  CircularProgress,
  Container,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import MainTitle from '../components/MainTitle';
import { useQuery } from '@tanstack/react-query';
import { ClientContext } from '../contexts/clientContext';
import { fetchBookedQueues } from '../api/queuesApi';
import BookedQueue from '../components/BookedQueue';
import { ClientContextType } from '../types/ClientContextType';
import { useNavigate } from 'react-router-dom';
import { QueueType } from '../types/QueueType';
import ErrorScrean from '../components/ErrorScreen';

function MyQueues() {
  const [queuesToView, setQueuesToView] = useState<number>(0);
  const { loggedClient } = useContext(ClientContext) as ClientContextType;
  const navigate = useNavigate();

  // fetch client queues by client id
  const {
    data: queues,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['queues', loggedClient?.id, true],
    queryFn: fetchBookedQueues,
    enabled: !!loggedClient,
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
            <BookedQueue
              key={index}
              queue={queue}
              index={index}
              client={true}
            />
          );
        },
      );
    } else return <Typography variant="h3">No future queues</Typography>;
  };

  const renderPastQueues = () => {
    if (queues?.data.pastQueues.length) {
      return queues?.data.pastQueues.map((queue: QueueType, index: number) => {
        return (
          <BookedQueue key={index} queue={queue} index={index} client={true} />
        );
      });
    } else return <Typography variant="h3">No past queues</Typography>;
  };

  useEffect(() => {
    // if no user logged go to sign in
    if (!loggedClient?.id) navigate('/sign-in');
  }, []);

  if (isLoading) return <CircularProgress />;
  if (isError) return <ErrorScrean error={JSON.stringify(error)} />;

  return (
    <Container>
      <MainTitle title="My queues" />

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
      <Stack mt={3} spacing={2}>
        {queuesToView === 0 ? renderFutureQueues() : renderPastQueues()}
      </Stack>
    </Container>
  );
}

export default MyQueues;
