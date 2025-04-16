import {
  IconButton,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { WorkingDay } from '../../types/WorkingDay';
import WorkingDaySelect from '../WorkingDaySelect';
import { WorkingDayFieldProps } from '../../types/WorkingDayFieldProps';

function WorkingDayField({
  index,
  workingDay,
  handleUpdateUserWorkingDays,
  handleDeleteWorkingDay,
}: WorkingDayFieldProps) {
  const [dayValue, setDayValue] = useState<WorkingDay>({ ...workingDay });
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleChangeWorkingDays = (event: SelectChangeEvent<string>) => {
    const newDayObj: WorkingDay = { ...dayValue };
    newDayObj[event.target.name] = event.target.value;
    setDayValue(newDayObj);
  };

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {isEdit ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          width="100%"
        >
          <WorkingDaySelect
            index={index}
            selectedDay={dayValue.day}
            selectedOpening={dayValue.opening}
            selectedClosing={dayValue.closing}
            handleChangeWorkingDays={handleChangeWorkingDays}
            isDeletable={false}
          />
          <IconButton
            onClick={() => {
              setIsEdit(false);
              setDayValue(workingDay);
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              handleUpdateUserWorkingDays(dayValue);
              setIsEdit(false);
            }}
          >
            <DoneIcon />
          </IconButton>
        </Stack>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography
            whiteSpace="nowrap"
            mr={1.5}
          >{`${workingDay.day}: `}</Typography>
          <Typography
            flexGrow={1}
          >{`${workingDay.opening} - ${workingDay.closing}`}</Typography>
          <IconButton onClick={() => handleDeleteWorkingDay(+dayValue.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}

export default WorkingDayField;
