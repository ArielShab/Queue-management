import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ServiceFieldProps } from '../../types/ServiceFieldProps';

function ServiceField({
  serviceId,
  serviceName,
  index,
  handleUpadteService,
  handleDeleteService,
}: ServiceFieldProps) {
  const [fieldValue, setFieldValue] = useState<string>(serviceName);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
          <TextField
            id="standard-basic"
            variant="standard"
            value={fieldValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setFieldValue(e.target.value)
            }
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            onClick={() => {
              handleUpadteService(serviceId, fieldValue);
              setIsEdit(false);
            }}
          >
            <DoneIcon />
          </IconButton>
          <IconButton
            onClick={() => {
              setFieldValue(serviceName);
              setIsEdit(false);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      ) : (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Typography flexGrow={1}>{`${index}. ${fieldValue}`}</Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteService(serviceId)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      )}
    </Stack>
  );
}

export default ServiceField;
