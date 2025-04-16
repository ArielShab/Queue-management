import { styled } from '@mui/system';

export const StyledFormWrapper = styled('form')(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  padding: '20px',
  borderRadius: '15px',
}));
