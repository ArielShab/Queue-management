import React, { useContext } from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import { UserContext } from '../context/userContext';
import {
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

function PersonalData() {
	const { loggedUser } = useContext(UserContext);
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

	const { data: workingDays } = useQuery({
		queryKey: ['workingDays', loggedUser?.id],
		queryFn: getUserWorkingDays,
		onError: (error) => {
			console.log("Couldn't get user working days", error);
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
			console.log('data', data);
		},
	});

	const handleUpdateField = (value) => {
		updateUserMutation.mutate({ ...value, id: loggedUser.id });
	};

	const handleUpdateUserWorkingDays = (value) => {
		updateWorkingDaysMutation.mutate(value);
	};

	const handleDeleteWorkingDay = (id) => {
		deleteWorkingDayById.mutate(id);
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

			<Box marginTop='16px'>
				<Typography component='h3' variant='h3' marginBottom='8px'>
					Working Days
				</Typography>

				{workingDays?.data.map((workingDay, index) => {
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
			</Box>
		</Container>
	);
}

export default PersonalData;
