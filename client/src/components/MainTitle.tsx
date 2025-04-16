import { Typography } from '@mui/material';
import { MainTitleProps } from '../types/MainTitleProps';

function MainTitle({ title }: MainTitleProps) {
  return (
    <Typography component="h1" variant="h1" mb={2} mt={2}>
      {title}
    </Typography>
  );
}

export default MainTitle;
