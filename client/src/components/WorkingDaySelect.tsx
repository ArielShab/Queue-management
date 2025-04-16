import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneIcon from '@mui/icons-material/Done';
import { hours } from '../utils/DayHours';
import { days } from '../utils/WeekDays';
import { WorkingDaySelectProps } from '../types/WorkingDaySelectProps';

function WorkingDaySelect({
  index,
  selectedDay,
  selectedOpening,
  selectedClosing,
  handleChangeWorkingDays,
  handleDeleteDaySelect,
  isConfirmAble = false,
  isDeletable = true,
  handleAddWorkingDay,
}: WorkingDaySelectProps) {
  return (
    <Box>
      <Stack direction="row" alignItems="baseline" mb={1.5}>
        <FormControl
          variant="standard"
          sx={{ minWidth: 120, width: '50%', mr: 1 }}
        >
          <InputLabel id="working-day">Day</InputLabel>
          <Select
            labelId="working-day"
            id="working-day"
            name="day"
            value={selectedDay}
            onChange={(e: SelectChangeEvent) => {
              handleChangeWorkingDays?.(e, index);
            }}
            label="Start of work"
          >
            {days.map((day: string) => {
              return (
                <MenuItem key={day} value={day}>
                  {day}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ minWidth: 120, width: '50%', mr: 1 }}
        >
          <InputLabel id="working-start-work">Start of work</InputLabel>
          <Select
            labelId="working-start-work"
            id="working-start-work"
            value={selectedOpening}
            onChange={(e: SelectChangeEvent) => {
              handleChangeWorkingDays?.(e, index);
            }}
            label="Start of work"
            name="opening"
          >
            {hours.map((hour: string) => {
              return (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl
          variant="standard"
          sx={{ minWidth: 120, width: '50%', mr: 1 }}
        >
          <InputLabel id="working-end-work">End of work</InputLabel>
          <Select
            labelId="working-end-work"
            id="working-end-work"
            value={selectedClosing}
            onChange={(e: SelectChangeEvent) => {
              handleChangeWorkingDays?.(e, index);
            }}
            label="End of work"
            name="closing"
          >
            {hours.map((hour: string) => {
              return (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {isConfirmAble && (
          <IconButton onClick={() => handleAddWorkingDay?.(index)}>
            <DoneIcon />
          </IconButton>
        )}
        {isDeletable && (
          <IconButton onClick={() => handleDeleteDaySelect?.(index)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}

export default WorkingDaySelect;
