import { ToastContainer } from 'react-toastify';

function MyToastContainer() {
  return (
    <ToastContainer
      style={{
        width: '90%',
        left: '50%',
        transform: 'translateX(-50%)',
        top: '10px',
      }}
    />
  );
}

export default MyToastContainer;
