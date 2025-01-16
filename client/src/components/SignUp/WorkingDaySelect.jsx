import React from "react";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";

function WorkingDaySelect({
  index,
  days,
  selectedDay,
  selectedOpening,
  selectedClosing,
  handleChangeWorkingDays,
  isDeletable = true,
  handleDeleteDaySelect,
  isConfirmAble = false,
  handleAddWorkingDay,
}) {
  const hours = [
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
  ];

  return (
    <Box>
      <Stack direction="row" alignItems="baseline" marginBottom="12px">
        <FormControl
          variant="standard"
          sx={{ minWidth: 120, width: "50%", marginRight: "8px" }}
        >
          <InputLabel id="working-day">Day</InputLabel>
          <Select
            labelId="working-day"
            id="working-day"
            name="day"
            value={selectedDay}
            onChange={(e) => {
              handleChangeWorkingDays(e, index);
            }}
            label="Start of work"
          >
            {days.map((day) => {
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
          sx={{ minWidth: 120, width: "50%", marginRight: "8px" }}
        >
          <InputLabel id="working-start-work">Start of work</InputLabel>
          <Select
            labelId="working-start-work"
            id="working-start-work"
            value={selectedOpening}
            onChange={(e) => {
              handleChangeWorkingDays(e, index);
            }}
            label="Start of work"
            name="opening"
          >
            {hours.map((hour) => {
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
          sx={{ minWidth: 120, width: "50%", marginRight: "8px" }}
        >
          <InputLabel id="working-end-work">End of work</InputLabel>
          <Select
            labelId="working-end-work"
            id="working-end-work"
            value={selectedClosing}
            onChange={(e) => {
              handleChangeWorkingDays(e, index);
            }}
            label="End of work"
            name="closing"
          >
            {hours.map((hour) => {
              return (
                <MenuItem key={hour} value={hour}>
                  {hour}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {isConfirmAble && (
          <IconButton onClick={() => handleAddWorkingDay(index)}>
            <DoneIcon />
          </IconButton>
        )}
        {isDeletable && (
          <IconButton onClick={() => handleDeleteDaySelect(index)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}

export default WorkingDaySelect;
