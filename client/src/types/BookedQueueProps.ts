import { QueueType } from './QueueType';

export interface BookedQueueProps {
  queue: QueueType;
  index: number;
  client?: boolean;
}
