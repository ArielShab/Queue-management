import { InputLabel, Stack, TextField, Typography } from '@mui/material';
import { InputFieldProps } from '../../types/InputFieldProps';
import { ChangeEvent } from 'react';

function InputField({
  label,
  id,
  placeholder,
  fieldsErrors,
  value,
  handleFieldChange,
}: InputFieldProps) {
  return (
    <Stack spacing={1}>
      <InputLabel htmlFor={id} sx={{ color: '#000' }}>
        {label}
      </InputLabel>
      <TextField
        id={id}
        variant="standard"
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          handleFieldChange(e.target.id, e.target.value);
        }}
      />
      <Typography color="#f00">{fieldsErrors[id]}</Typography>
    </Stack>
  );
}

export default InputField;
