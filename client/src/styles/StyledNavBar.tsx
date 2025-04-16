import { Box, Stack } from '@mui/material';
import { styled } from '@mui/system';

export const StyledLinksWrapper = styled(Stack)(({ theme }) => ({
  flexDirection: 'row',
  justifyContent: 'flex-end',
  columnGap: '16px',
}));

export const StyledNavBar = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  paddingBlock: '16px',

  a: {
    color: theme.palette.primary.light,
    textDecoration: 'none',

    '&.active': {
      textDecoration: 'underLine',
    },
  },
}));
