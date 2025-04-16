export interface DialogContextType {
  openDialog: boolean;
  dialogText: string;
  dialogFunction: (() => void) | null;
  handleOpenDialog: () => void;
  handleCloseDialog: () => void;
  handleDialogText: (title: string) => void;
  handleSetDialogFunction: (func: () => void) => void;
}
