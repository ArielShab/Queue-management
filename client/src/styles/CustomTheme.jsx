import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		background: {
			default: '#fafafa',
		},
		primary: {
			main: '#000',
			light: '#fff',
			grey: '#fafafa',
		},
	},
	typography: {
		h1: {
			fontSize: 'clamp(50px, 7vw, 70px)',
			fontWeight: 700,
			lineHeight: 1,
		},
		h3: {
			fontSize: 'clamp(20px, 2.4vw, 24px)',
			fontWeight: 700,
			lineHeight: 1,
		},
	},
});

export default theme;
