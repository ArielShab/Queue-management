import React, { useContext, useState } from 'react';
import { Container, Stack, TextField, Typography } from '@mui/material';
import { UserContext } from '../context/userContext';
import { getUserPersonalData, updateUserDataById } from '../api/usersApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import MainTitle from '../components/general/MainTitle';
import DataField from '../components/personalData/DataField';

function PersonalData() {
	const { loggedUser } = useContext(UserContext);
	const [editFields, setEditFields] = useState({
		firstName: false,
		lastName: false,
		email: false,
		phone: false,
		queueDuration: false,
	});

	const updateUserMutation = useMutation({
		mutationFn: updateUserDataById,
		onSuccess: (data, body, context) => {},
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

	if (isLoading) return <h1>Loading...</h1>;
	if (isError) return <p>{JSON.stringify(error)}</p>;

	return (
		<Container>
			<MainTitle title='Personal Data' />

			<Stack rowGap='16px'>
				<DataField
					label={'First Name:'}
					value={user.data.firstName}
					editFields={editFields}
					setEditFields={setEditFields}
					dataKey='firstName'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Last Name:'}
					value={user.data.lastName}
					editFields={editFields}
					setEditFields={setEditFields}
					dataKey='lastName'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Email:'}
					value={user.data.email}
					editFields={editFields}
					setEditFields={setEditFields}
					dataKey='email'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Phone:'}
					value={user.data.phone}
					editFields={editFields}
					setEditFields={setEditFields}
					dataKey='phone'
					handleUpdateField={handleUpdateField}
				/>
				<DataField
					label={'Queue duration:'}
					value={user.data.queueDuration}
					type='number'
					editFields={editFields}
					setEditFields={setEditFields}
					dataKey='queueDuration'
					handleUpdateField={handleUpdateField}
				/>
			</Stack>
		</Container>
	);
}

export default PersonalData;
