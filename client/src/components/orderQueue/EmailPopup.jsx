import { Modal, Typography, Box, TextField, Button } from '@mui/material';
import React, { useState } from 'react';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	// width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
	borderRadius: 2,
	width: 'min(400px, 95%)',
};

function EmailPopup({
	open,
	setOpen,
	step,
	handleSendEmailVerification,
	handleSendVerificationCode,
	timer,
}) {
	const [details, setDetails] = useState({ clientName: '', clientEmail: '' });
	const [code, setCode] = useState('');

	return (
		<Modal
			open={open}
			onClose={setOpen}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={style}>
				{step ? (
					<>
						<Typography
							id='modal-modal-title'
							variant='h3'
							component='h3'
						>
							Enter details
						</Typography>
						<TextField
							type='text'
							placeholder='Enter full name'
							value={details.clientName}
							onChange={(e) =>
								setDetails({
									...details,
									clientName: e.target.value,
								})
							}
							sx={{ width: '100%', marginTop: '16px' }}
						/>
						<TextField
							type='text'
							placeholder='Enter email'
							value={details.clientEmail}
							onChange={(e) =>
								setDetails({
									...details,
									clientEmail: e.target.value,
								})
							}
							sx={{ width: '100%', marginBlock: '16px' }}
						/>
						<Button
							variant='contained'
							onClick={() => handleSendEmailVerification(details)}
						>
							Send
						</Button>
					</>
				) : (
					<>
						<Typography
							id='modal-modal-title'
							variant='h3'
							component='h3'
						>
							A code was sent to your email
						</Typography>
						<TextField
							type='text'
							placeholder='Enter code'
							value={code}
							onChange={(e) => setCode(e.target.value)}
							sx={{ width: '100%', marginBlock: '16px' }}
						/>
						{timer > 0 ? (
							<Typography>
								Time remaining: {Math.floor(timer / 60)}:
								{(timer % 60).toString().padStart(2, '0')}
							</Typography>
						) : (
							<Typography>Code expired</Typography>
						)}

						<Button
							variant='contained'
							onClick={() => handleSendVerificationCode(code)}
							marginTop='8px'
						>
							Send
						</Button>
					</>
				)}
			</Box>
		</Modal>
	);
}

export default EmailPopup;
