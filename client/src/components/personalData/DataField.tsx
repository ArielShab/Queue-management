import { ChangeEvent, useEffect, useState } from 'react';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import { DataFieldProps } from '../../types/DataFieldProps';

function DataField({
  label,
  value,
  type = 'text',
  dataKey,
  handleUpdateField,
}: DataFieldProps) {
  const [fieldValue, setFieldValue] = useState<string | number>(value);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleChangeField = () => {
    if (fieldValue !== value) {
      handleUpdateField({
        [dataKey]: dataKey === 'queueDuration' ? +fieldValue : fieldValue,
      });

      setIsEdit(false);
    } else {
      setIsEdit(false);
    }
  };

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Typography whiteSpace="nowrap">{label}</Typography>
      {isEdit ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={1}
          width="100%"
        >
          <TextField
            id="standard-basic"
            variant="standard"
            value={fieldValue}
            type={type}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFieldValue(e.target.value)
            }
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            onClick={() => {
              setIsEdit(false);
              setFieldValue(value);
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton onClick={handleChangeField}>
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
          <Typography>
            {dataKey === 'queueDuration' ? `${value} minutes` : value}
          </Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}

export default DataField;
