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
import { hours } from "../../tools/DayHours";

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
