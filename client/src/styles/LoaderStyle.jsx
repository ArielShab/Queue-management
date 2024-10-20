import { styled } from '@mui/system';

export const StyledLoader = styled('div')(({ theme }) => ({
	width: '48px',
	height: '48px',
	borderRadius: '50%',
	position: 'relative',
	animation: 'rotate 1s linear infinite',

	'&::before': {
		content: '""',
		boxSizing: 'border-box',
		position: 'absolute',
		inset: '0px',
		borderRadius: '50%',
		border: `5px solid ${theme.palette.primary.main}`,
		animation: 'prixClipFix 2s linear infinite',
	},

	'@keyframes rotate': {
		'100%': { transform: 'rotate(360deg)' },
	},

	'@keyframes prixClipFix': {
		'0%': { clipPath: 'polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)' },
		'25%': {
			clipPath: 'polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)',
		},
		'50%': {
			clipPath:
				'polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)',
		},
		'75%': {
			clipPath: 'polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 100%)',
		},
		'100%': {
			clipPath: 'polygon(50% 50%,0 0,100% 0,100% 100%,0 100%,0 0)',
		},
	},
}));
