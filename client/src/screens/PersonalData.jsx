import React, { useContext, useState } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { UserContext } from '../context/userContext';
import {
	addUserWorkingDay,
	deleteUserWorkingDay,
	getUserPersonalData,
	getUserWorkingDays,
	updateUserDataById,
	updateUserWorkingDays,
} from '../api/usersApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MainTitle from '../components/general/MainTitle';
import DataField from '../components/personalData/DataField';
import { StyledLoader } from '../styles/LoaderStyle';
import WorkingDayField from '../components/personalData/WorkingDayField';
import WorkingDaySelect from '../components/SignUp/WorkingDaySelect';
import { days } from '../tools/WeekDays';
import { DialogContext } from '../context/DialogContext';

function PersonalData() {
	const [newWorkingDays, setNewWorkingDays] = useState([]);
	const { loggedUser } = useContext(UserContext);
	const { handleOpenDialog, handleDialogText, handleSetDialogFunction } =
		useContext(DialogContext);
	const queryClient = useQueryClient();

	const {
		data: user,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['user', loggedUser?.id],
		queryFn: getUserPersonalData,
		onError: (error) => {
			console.log("Couldn't get user data", error);
		},
	});

	const { data: userWorkingDays } = useQuery({
		queryKey: ['workingDays', loggedUser?.id],
		queryFn: getUserWorkingDays,
		onError: (error) => {
			console.log("Couldn't get user working days", error);
		},
	});

	const addWorkingDayMutation = useMutation({
		mutationFn: addUserWorkingDay,
		onSuccess: ({ success, data: message }) => {
			setNewWorkingDays([]);
			queryClient.invalidateQueries(['workingDays'], { exact: true });
			if (success) alert(message);
		},
		onError: (error) => {
			console.error('error', error);
		},
	});

	const updateUserMutation = useMutation({
		mutationFn: updateUserDataById,
		onSuccess: (data) => {
			queryClient.invalidateQueries(['user'], { exact: true });
			if (data?.status === 201) alert('Update success');
		},
		onError: (error) => {
			console.error('error', error);
		},
	});

	const updateWorkingDaysMutation = useMutation({
		mutationFn: updateUserWorkingDays,
		onSuccess: (data) => {
			queryClient.invalidateQueries(['workingDays'], { exact: true });
		},
	});

	const deleteWorkingDayById = useMutation({
		mutationFn: deleteUserWorkingDay,
		onSuccess: (data) => {
			queryClient.invalidateQueries(['workingDays'], { exact: true });
		},
	});

	const handleAddDayOfWork = () => {
		const temp = [...newWorkingDays];
		temp.push({ day: '', opening: '', closing: '' });
		setNewWorkingDays(temp);
	};

	const handleChangeNewWorkingDays = (event, index) => {
		const temp = [...newWorkingDays];

		const newDayObj = temp[index];
		newDayObj[event.target.name] = event.target.value;
		setNewWorkingDays(temp);
	};

	const handleDeleteDaySelect = (index) => {
		const temp = newWorkingDays.filter((dayObj, idx) => idx !== index);
		setNewWorkingDays(temp);
	};

	const handleUpdateField = (value) => {
		updateUserMutation.mutate({ ...value, id: loggedUser.id });
	};

	const handleUpdateUserWorkingDays = (value) => {
		updateWorkingDaysMutation.mutate(value);
	};

	const handleDeleteWorkingDay = (id) => {
		// handleOpenDialog();
		// handleDialogText('Are you sure you want to delete this day ?');
		// handleSetDialogFunction();
		deleteWorkingDayById.mutate(id);
	};

	const handleAddWorkingDay = (index) => {
		if (!newWorkingDays[index].day) {
			alert('Please choose a day');
			return;
		}
		if (!newWorkingDays[index].opening) {
			alert('Please choose a start of work');
			return;
		}
		if (!newWorkingDays[index].closing) {
			alert('Please choose an end of work');
			return;
		}
		addWorkingDayMutation.mutate({
			userId: loggedUser.id,
			...newWorkingDays[index],
		});
	};

	if (isLoading) return <StyledLoader />;
	if (isError) return <p>{JSON.stringify(error)}</p>;

	return (
		<Container>
			<MainTitle title='Personal Data' />

			<Stack rowGap='16px'>
				<DataField
					label={'First Name:'}
					value={user.data.firstName}
					dataKey='firstName'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Last Name:'}
					value={user.data.lastName}
					dataKey='lastName'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Email:'}
					value={user.data.email}
					dataKey='email'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Phone:'}
					value={user.data.phone}
					dataKey='phone'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Queue duration:'}
					value={user.data.queueDuration}
					type='number'
					dataKey='queueDuration'
					handleUpdateField={handleUpdateField}
				/>
			</Stack>

			<Box marginBlock='20px 80px'>
				<Typography component='h3' variant='h3' marginBottom='8px'>
					Working Days
				</Typography>

				{userWorkingDays?.data.map((workingDay, index) => {
					return (
						<WorkingDayField
							key={workingDay.id}
							index={index}
							workingDay={workingDay}
							handleUpdateUserWorkingDays={
								handleUpdateUserWorkingDays
							}
							handleDeleteWorkingDay={handleDeleteWorkingDay}
						/>
					);
				})}

				<Box marginBlock='16px'>
					{newWorkingDays.map((dayObj, index) => {
						return (
							<WorkingDaySelect
								key={index}
								index={index}
								days={days}
								selectedDay={dayObj.day}
								selectedOpening={dayObj.opening}
								selectedClosing={dayObj.closing}
								handleChangeWorkingDays={
									handleChangeNewWorkingDays
								}
								handleDeleteDaySelect={handleDeleteDaySelect}
								isConfirmAble={true}
								handleAddWorkingDay={handleAddWorkingDay}
							/>
						);
					})}
				</Box>

				<Button
					variant='outlined'
					onClick={handleAddDayOfWork}
					sx={{ marginTop: 2 }}
				>
					Add day
				</Button>
			</Box>
		</Container>
	);
}

export default PersonalData;
