import React, { useContext } from 'react';
import { Container, Stack } from '@mui/material';
import { UserContext } from '../context/userContext';
import { getUserPersonalData, updateUserDataById } from '../api/usersApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import MainTitle from '../components/general/MainTitle';
import DataField from '../components/personalData/DataField';
import { StyledLoader } from '../styles/LoaderStyle';

function PersonalData() {
	const { loggedUser } = useContext(UserContext);

	const updateUserMutation = useMutation({
		mutationFn: updateUserDataById,
		onSuccess: (data, body, context) => {
			if (data?.status === 201) alert('Update success');
		},
		onError: (error, body, context) => {
			console.error('error', error);
		},
	});

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

	const handleUpdateField = (value) => {
		updateUserMutation.mutate({ ...value, id: loggedUser.id });
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
		</Container>
	);
}

export default PersonalData;
