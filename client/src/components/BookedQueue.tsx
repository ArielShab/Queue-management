import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { BookedQueueProps } from '../types/BookedQueueProps';

function BookedQueue({ queue, index, client = false }: BookedQueueProps) {
  return (
    <Stack direction="row" alignItems="flex-start">
      <Box flexGrow={1}>
        <Typography fontWeight="600">{`${index + 1}. ${dayjs(
          queue.queueTime,
        ).format('DD/MM/YYYY')} - ${dayjs(queue.queueTime).format(
          'HH:mm',
        )}`}</Typography>
        <Typography>
          {client
            ? `${queue.userName} - ${queue.userEmail}`
            : `${queue.clientName} - ${queue.clientEmail}`}
        </Typography>
        <Typography>{queue.serviceName}</Typography>
      </Box>
    </Stack>
  );
}

export default BookedQueue;
