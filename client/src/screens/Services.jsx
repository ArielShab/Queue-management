import { Button, Container, Stack, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import MainTitle from '../components/general/MainTitle';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserContext } from '../context/userContext';
import { createUserService, getUserServices } from '../api/servicesApi';
import { StyledLoader } from '../styles/LoaderStyle';
import { Box } from '@mui/system';
import AddServiceField from '../components/Services/AddServiceField';
import ServiceField from '../components/Services/ServiceField';

function Services() {
	const { loggedUser } = useContext(UserContext);
	const [isAddService, setIsAddService] = useState(false);

	const {
		data: services,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ['services', loggedUser?.id],
		queryFn: getUserServices,
		onError: (error, body, context) => {
			console.log(error);
		},
	});

	const createServiceMutation = useMutation({
		mutationFn: createUserService,
		onSuccess: (data, body, context) => {
			console.log('data', data);
		},
	});

	if (isLoading) return <StyledLoader />;
	if (isError) return <p>{JSON.stringify(error)}</p>;

	const handleAddService = (value) => {
		createServiceMutation.mutate({
			userId: loggedUser.id,
			serviceName: value,
		});
	};

	return (
		<Container>
			<MainTitle title='My Services' />

			{!services.data.length ? (
				<Typography component='h3' variant='h3' marginBottom='16px'>
					No Servicess...
				</Typography>
			) : (
				<Box marginBottom='16px'>
					{services.data.map((service) => {
						return (
							<ServiceField
								key={service.id}
								serviceName={service.serviceName}
							/>
						);
					})}
				</Box>
			)}

			<Box>
				{isAddService && (
					<AddServiceField
						setIsAddService={setIsAddService}
						handleAddService={handleAddService}
					/>
				)}
				<Button
					variant='outlined'
					onClick={() => setIsAddService(true)}
					sx={{ marginTop: '8px' }}
				>
					Add service
				</Button>
			</Box>
		</Container>
	);
}

export default Services;
