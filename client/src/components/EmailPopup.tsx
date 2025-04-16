import { ChangeEvent, useState } from 'react';
import { EmailPopupProps } from '../types/EmailPopupProps';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';
import { EmailPopupDetails } from '../types/EmailPopupDetails';

const detailsStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  p: 4,
  borderRadius: 2,
  width: 'min(400px, 95%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

function EmailPopup({
  open,
  setOpen,
  showEmailVerification,
  handleSendEmailVerification,
  handleSendVerificationCode,
  timer,
}: EmailPopupProps) {
  const [details, setDetails] = useState<EmailPopupDetails>({
    clientName: '',
    clientEmail: '',
  });
  const [code, setCode] = useState<string>('');

  return (
    <Modal
      open={open}
      onClose={setOpen}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={detailsStyle}>
        {showEmailVerification ? (
          <>
            <Typography id="modal-modal-title" variant="h3" component="h3">
              Enter details
            </Typography>
            <TextField
              type="text"
              placeholder="Enter full name"
              value={details.clientName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDetails({
                  ...details,
                  clientName: e.target.value,
                });
              }}
              sx={{ width: '100%', marginTop: '16px' }}
            />
            <TextField
              type="text"
              placeholder="Enter email"
              value={details.clientEmail}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDetails({
                  ...details,
                  clientEmail: e.target.value,
                });
              }}
              sx={{ width: '100%', marginBlock: '16px' }}
            />
            <Button
              variant="contained"
              onClick={() => handleSendEmailVerification(details)}
            >
              Send
            </Button>
          </>
        ) : (
          <>
            <Typography id="modal-modal-title" variant="h3" component="h3">
              A code was sent to your email
            </Typography>
            <TextField
              type="text"
              placeholder="Enter code"
              value={code}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCode(e.target.value)
              }
              sx={{ width: '100%', marginBlock: '16px' }}
            />
            {timer > 0 ? (
              <Typography>
                Time remaining: {Math.floor(timer / 60)}:
                {(timer % 60).toString().padStart(2, '0')}
              </Typography>
            ) : (
              <Typography>Code expired</Typography>
            )}

            <Button
              variant="contained"
              onClick={() => handleSendVerificationCode(code)}
              sx={{
                marginTop: '8px',
              }}
            >
              Send
            </Button>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default EmailPopup;
