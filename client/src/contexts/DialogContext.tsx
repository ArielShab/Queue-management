import { createContext, useState } from 'react';
import { DialogContextType } from '../types/DialogContextType';
import { ChildrenProps } from '../types/ChildrenProps';

export const DialogContext = createContext<DialogContextType>(
  {} as DialogContextType,
);

export const DialogContextProvider = ({ children }: ChildrenProps) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [dialogText, setDialogText] = useState<string>('');
  const [dialogFunction, setDialogFunction] = useState<(() => void) | null>(
    null,
  );

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogFunction(null);
  };

  const handleDialogText = (title: string) => {
    setDialogText(title);
  };

  const handleSetDialogFunction = (func: () => void) => {
    setDialogFunction(() => func);
  };

  const DialogContextData = {
    openDialog,
    dialogText,
    dialogFunction,
    handleOpenDialog,
    handleDialogText,
    handleCloseDialog,
    handleSetDialogFunction,
  };

  return (
    <DialogContext.Provider value={DialogContextData}>
      {children}
    </DialogContext.Provider>
  );
};
