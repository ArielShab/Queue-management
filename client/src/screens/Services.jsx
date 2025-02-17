import { Button, Container, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import MainTitle from "../components/general/MainTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/userContext";
import {
  createUserService,
  deleteUserService,
  getUserServices,
  updateUserService,
} from "../api/servicesApi";
import { StyledLoader } from "../styles/LoaderStyle";
import { Box } from "@mui/system";
import AddServiceField from "../components/Services/AddServiceField";
import ServiceField from "../components/Services/ServiceField";
import { DialogContext } from "../context/DialogContext";
import { alertMessage } from "../tools/AlertMessage";

function Services() {
  const { loggedUser } = useContext(UserContext);
  const [isAddService, setIsAddService] = useState(false);
  const queryClient = useQueryClient();
  const { handleOpenDialog, handleDialogText, handleSetDialogFunction } =
    useContext(DialogContext);

  // fetch user services by user id
  const {
    data: services,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["services", loggedUser?.id],
    queryFn: getUserServices,
    onError: (error) => {
      console.error("error", error);
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: createUserService,
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries(["services"], { exact: true });
        alertMessage("success", "Service was created");
      }
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: updateUserService,
    onSuccess: ({ success, data: message }) => {
      if (success) {
        queryClient.invalidateQueries(["services"], { exact: true });
        alertMessage("success", message);
      }
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: deleteUserService,
    onSuccess: ({ success, data: message }) => {
      if (success) {
        queryClient.invalidateQueries(["services"], { exact: true });
        alertMessage("success", message);
      }
    },
  });

  const handleUpadteService = (serviceId, serviceName) => {
    updateServiceMutation.mutate({ id: serviceId, serviceName });
  };

  const handleDeleteService = (serviceId) => {
    handleOpenDialog(true);
    handleDialogText("Are you sure you want to delete this service ?");
    handleSetDialogFunction(() => deleteServiceMutation.mutate(serviceId));
  };

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
      <MainTitle title="My Services" />

      {!services.data.length ? (
        <Typography component="h3" variant="h3" marginBottom="16px">
          No Servicess...
        </Typography>
      ) : (
        <Box marginBottom="16px">
          {services.data.map((service, index) => {
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
