import { toast, Flip } from 'react-toastify';

type ToastType = 'success' | 'error' | 'warn';

export const alertMessage = (type: ToastType, message: string) => {
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
  });
};
