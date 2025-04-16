import { EmailPopupDetails } from './EmailPopupDetails';

export interface ClientQueueDataType extends EmailPopupDetails {
  queueTime: string;
  serviceId: string;
  userId: number | undefined;
}
