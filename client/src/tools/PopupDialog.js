import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import React, { useContext } from "react";
import { DialogContext } from "../context/DialogContext";

function PopupDialog() {
  const { openDialog, dialogText, dialogFunction, handleCloseDialog } =
    useContext(DialogContext);

  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <DialogContentText sx={{ color: "#000" }}>
          {dialogText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>No</Button>
        <Button
          onClick={() => {
            dialogFunction();
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
