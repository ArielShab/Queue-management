import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import MainTitle from '../components/MainTitle';
import ServiceField from '../components/services/ServiceField';
import AddServiceField from '../components/services/AddServiceField';
import { UserContext } from '../contexts/userContext';
import { DialogContext } from '../contexts/DialogContext';
import {
  createUserService,
  deleteUserService,
  getUserServices,
  updateUserService,
} from '../api/servicesApi';
import { alertMessage } from '../components/AlertMessage';
import { UserContextType } from '../types/UserContextType';
import { DialogContextType } from '../types/DialogContextType';
import { ServiceType } from '../types/ServiceType';
import ErrorScrean from '../components/ErrorScreen';

function Services() {
  const { loggedUser } = useContext(UserContext) as UserContextType;
  const [isAddService, setIsAddService] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { handleOpenDialog, handleDialogText, handleSetDialogFunction } =
    useContext(DialogContext) as DialogContextType;

  // fetch user services by user id
  const {
    data: services,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['services', loggedUser?.id],
    queryFn: getUserServices,
    enabled: !!loggedUser?.id,
  });

  const createServiceMutation = useMutation({
    mutationFn: createUserService,
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ['services'],
          exact: true,
        });
        alertMessage('success', 'Service was created');
      }
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: updateUserService,
    onSuccess: ({ success, data: message }) => {
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ['services'],
          exact: true,
        });
        alertMessage('success', message);
      }
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteUserService,
    onSuccess: ({ success, data: message }) => {
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ['services'],
          exact: true,
        });
        alertMessage('success', message);
      }
    },
  });

  const handleUpadteService = (serviceId: number, serviceName: string) => {
    updateServiceMutation.mutate({ id: serviceId, serviceName });
  };

  const handleDeleteService = (serviceId: number) => {
    handleOpenDialog();
    handleDialogText('Are you sure you want to delete this service ?');
    handleSetDialogFunction(() => deleteServiceMutation.mutate(serviceId));
  };

  const handleAddService = (value: string) => {
    createServiceMutation.mutate({
      userId: Number(loggedUser?.id),
      serviceName: value,
    });
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <ErrorScrean error={JSON.stringify(error)} />;

  return (
    <Container>
      <MainTitle title="My Services" />

      {!services?.data.length ? (
        <Typography component="h3" variant="h3" mb={2}>
          No Services...
        </Typography>
      ) : (
        <Box mb={2}>
          {services?.data.map((service: ServiceType, index: number) => {
            return (
              <ServiceField
                key={service.id}
                serviceId={service.id}
                serviceName={service.serviceName}
                index={index + 1}
                handleUpadteService={handleUpadteService}
                handleDeleteService={handleDeleteService}
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
          variant="outlined"
          onClick={() => setIsAddService(true)}
          sx={{ mt: 3 }}
        >
          Add service
        </Button>
      </Box>
    </Container>
  );
}

export default Services;
