import { EmailPopupDetails } from './EmailPopupDetails';

export interface EmailPopupProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showEmailVerification: boolean;
  handleSendEmailVerification: ({
    clientName,
    clientEmail,
  }: EmailPopupDetails) => void;
  handleSendVerificationCode: (code: string) => void;
  timer: number;
}
