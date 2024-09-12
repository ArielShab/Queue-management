import { styled } from '@mui/system';

export const StyledSignUpForm = styled('form')(({ theme }) => ({
	border: `1px solid ${theme.palette.primary.main}`,
	padding: '20px',
	borderRadius: '15px',
}));

export const StyledInput = styled('input')(({ theme }) => ({
	marginBlock: '4px',
	outline: 'none',
	padding: '6px',
}));

export const StyledSubmitInput = styled('input')(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.light,
	border: 'unset',
	fontSize: '18px',
	padding: '8px 12px',
}));

export const StyledWarningMessage = styled('span')(({ theme }) => ({
	fontSize: '14px',
	color: 'red',
}));
