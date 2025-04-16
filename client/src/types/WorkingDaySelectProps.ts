import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent } from 'react';

export interface WorkingDaySelectProps {
  index: number;
  selectedDay: string;
  selectedOpening: string;
  selectedClosing: string;
  handleChangeWorkingDays: (
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>,
    index: number,
  ) => void;
  handleDeleteDaySelect?: (index: number) => void;
  isConfirmAble?: boolean;
  isDeletable?: boolean;
  handleAddWorkingDay?: (index: number) => void;
}
