import { toast, Flip } from 'react-toastify';

export const alertMessage = (type, message) => {
	toast[`${type}`](message, {
		position: 'top-right',
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: 'light',
		transition: Flip,
		style: {
			width: 'min(375px, 90%)',
			top: '5px',
			marginInline: 'auto',
		},
	});
};
