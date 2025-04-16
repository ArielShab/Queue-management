import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import { useContext } from 'react';
import { DialogContext } from '../contexts/DialogContext';
import { DialogContextType } from '../types/DialogContextType';

function PopupDialog() {
  const { openDialog, dialogText, dialogFunction, handleCloseDialog } =
    useContext(DialogContext) as DialogContextType;

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText sx={{ color: '#000' }}>
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>No</Button>
        <Button
          onClick={() => {
            if (dialogFunction) {
              dialogFunction();
            }
            handleCloseDialog();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopupDialog;
