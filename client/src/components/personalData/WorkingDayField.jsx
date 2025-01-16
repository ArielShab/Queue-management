import { IconButton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import WorkingDaySelect from "../SignUp/WorkingDaySelect";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { days } from "../../tools/WeekDays";
import DeleteIcon from "@mui/icons-material/Delete";

function WorkingDayField({
  index,
  workingDay,
  handleUpdateUserWorkingDays,
  handleDeleteWorkingDay,
}) {
  const [dayValue, setDayValue] = useState({ ...workingDay });
  const [isEdit, setIsEdit] = useState(false);

  const handleChangeWorkingDays = (event) => {
    const newDayObj = { ...dayValue };
    newDayObj[event.target.name] = event.target.value;
    setDayValue(newDayObj);
  };

  return (
    <Stack direction="row" columnGap="8px" alignItems="center">
      {isEdit ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          columnGap="8px"
          width="100%"
        >
          <WorkingDaySelect
            index={index}
            days={days}
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
            marginRight="12px"
          >{`${workingDay.day}: `}</Typography>
          <Typography flexGrow="1">{`${workingDay.opening} - ${workingDay.closing}`}</Typography>
          <IconButton onClick={() => handleDeleteWorkingDay(dayValue.id)}>
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
