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

function EmailPopup({ open, setOpen, step, handleSendEmailConfirmation }) {
	const [email, setEmail] = useState('');
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
							Enter email for confirmation
						</Typography>
						<TextField
							type='text'
							placeholder='Enter email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							sx={{ width: '100%', marginBlock: '16px' }}
						/>
						<Button
							variant='contained'
							onClick={() => handleSendEmailConfirmation(email)}
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
						<Button variant='contained'>Send</Button>
					</>
				)}
			</Box>
		</Modal>
	);
}

export default EmailPopup;
