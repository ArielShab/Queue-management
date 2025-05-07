import { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import MainTitle from '../components/MainTitle';
import { WorkingDay } from '../types/WorkingDay';
import WorkingDaySelect from '../components/WorkingDaySelect';
import DataField from '../components/personalData/DataField';
import WorkingDayField from '../components/personalData/WorkingDayField';
import { UserContext } from '../contexts/userContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addUserWorkingDay,
  deleteUserWorkingDay,
  getUserPersonalData,
  getUserWorkingDays,
  updateUserDataById,
  updateUserWorkingDays,
} from '../api/usersApi';
import { DialogContext } from '../contexts/DialogContext';
import { days } from '../utils/WeekDays';
import { alertMessage } from '../components/AlertMessage';
import { UserContextType } from '../types/UserContextType';
import { DialogContextType } from '../types/DialogContextType';
import ErrorScrean from '../components/ErrorScreen';

function PersonalData() {
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
  const [newWorkingDays, setNewWorkingDays] = useState<WorkingDay[]>([]);
  const { loggedUser } = useContext(UserContext) as UserContextType;
  const { handleOpenDialog, handleDialogText, handleSetDialogFunction } =
    useContext(DialogContext) as DialogContextType;
  const queryClient = useQueryClient();

  // fetch user personal data by user id
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
  } = useQuery({
    queryKey: ['user', loggedUser.id],
    queryFn: () => getUserPersonalData(+loggedUser.id),
    enabled: !!loggedUser.id,
  });

  // fetch user working days
  const {
    data: userWorkingDays,
    isLoading: isWorkingDaysLoading,
    isError: isWorkingDaysError,
    error: workingDaysError,
  } = useQuery({
    queryKey: ['workingDays', loggedUser.id],
    queryFn: () => getUserWorkingDays(+loggedUser.id),
    enabled: !!loggedUser.id,
  });

  const addWorkingDayMutation = useMutation({
    mutationFn: addUserWorkingDay,
    onSuccess: ({ success, data: message }) => {
      setNewWorkingDays([]);
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ['workingDays'],
          exact: true,
        });
        alertMessage('success', message);
      }
    },
    onError: (error) => {
      console.error('error', error);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserDataById,
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ['user'],
          exact: true,
        });
        alertMessage('success', 'Update success');
      }
    },
    onError: (error) => {
      console.error('error', error);
    },
  });

  const updateWorkingDaysMutation = useMutation({
    mutationFn: updateUserWorkingDays,
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ['workingDays'],
          exact: true,
        });
        alertMessage('success', 'Update success');
      }
    },
  });

  const deleteWorkingDayById = useMutation({
    mutationFn: deleteUserWorkingDay,
    onSuccess: ({ success }) => {
      if (success) {
        queryClient.invalidateQueries({
          queryKey: ['workingDays'],
          exact: true,
        });
        alertMessage('success', 'Day was deleted');
      }
    },
  });

  const handleAddDayOfWork = () => {
    const temp: WorkingDay[] = [...newWorkingDays];
    temp.push({ day: '', opening: '', closing: '' });
    setNewWorkingDays(temp);
  };

  const handleChangeNewWorkingDays = (
    event: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const temp: WorkingDay[] = [...newWorkingDays];

    const newDayObj: WorkingDay = temp[index];
    newDayObj[event.target.name] = event.target.value;
    setNewWorkingDays(temp);
  };

  const handleDeleteDaySelect = (index: number) => {
    const temp: WorkingDay[] = newWorkingDays.filter((_, idx) => idx !== index);
    setNewWorkingDays(temp);
  };

  const handleUpdateField = (value: { [key: string]: string | number }) => {
    updateUserMutation.mutate({ ...value, id: loggedUser.id });
  };

  const handleUpdateUserWorkingDays = (value: WorkingDay) => {
    updateWorkingDaysMutation.mutate(value);
  };

  const handleDeleteWorkingDay = (id: number) => {
    handleOpenDialog();
    handleDialogText('Are you sure you want to delete this day ?');
    handleSetDialogFunction(() => deleteWorkingDayById.mutate(id));
  };

  const handleAddWorkingDay = (index: number) => {
    if (!newWorkingDays[index].day) {
      alertMessage('warn', 'Please choose a day');
      return;
    }
    if (!newWorkingDays[index].opening) {
      alertMessage('warn', 'Please choose a start of work');
      return;
    }
    if (!newWorkingDays[index].closing) {
      alertMessage('warn', 'Please choose an end of work');
      return;
    }
    addWorkingDayMutation.mutate({
      ...newWorkingDays[index],
      userId: loggedUser.id,
    });
  };

  const handleSortWorkingDays = () => {
    const sortedArray: WorkingDay[] = userWorkingDays?.data.sort(
      (day1: WorkingDay, day2: WorkingDay) =>
        days.indexOf(day1.day) - days.indexOf(day2.day),
    );
    setWorkingDays(sortedArray);
  };

  useEffect(() => {
    if (userWorkingDays?.success) {
      handleSortWorkingDays();
    }
  }, [userWorkingDays]);

  if (isUserLoading || isWorkingDaysLoading) return <CircularProgress />;
  if (isUserError || isWorkingDaysError)
    return (
      <ErrorScrean error={JSON.stringify(userError || workingDaysError)} />
    );

  return (
    <Container>
      <MainTitle title="Personal Data" />

      <Stack spacing={2}>
        <DataField
          label={'First Name:'}
          value={user ? user.data?.firstName : null}
          dataKey="firstName"
          handleUpdateField={handleUpdateField}
        />
        <DataField
          label={'Last Name:'}
          value={user ? user.data?.lastName : null}
          dataKey="lastName"
          handleUpdateField={handleUpdateField}
        />
        <DataField
          label={'Email:'}
          value={user ? user.data?.email : null}
          dataKey="email"
          handleUpdateField={handleUpdateField}
        />
        <DataField
          label={'Phone:'}
          value={user ? user.data?.phone : null}
          dataKey="phone"
          handleUpdateField={handleUpdateField}
        />
        <DataField
          label={'Queue duration:'}
          value={user ? user.data?.queueDuration : null}
          type="number"
          dataKey="queueDuration"
          handleUpdateField={handleUpdateField}
        />
      </Stack>

      <Box mb={10} mt={2.5}>
        <Typography component="h3" variant="h3" mb={1}>
          Working Days
        </Typography>

        {workingDays?.map((workingDay: WorkingDay, index: number) => {
          return (
            <WorkingDayField
              key={workingDay.id}
              index={index}
              workingDay={workingDay}
              handleUpdateUserWorkingDays={handleUpdateUserWorkingDays}
              handleDeleteWorkingDay={handleDeleteWorkingDay}
            />
          );
        })}

        <Box mb={2}>
          {newWorkingDays.map((dayObj: WorkingDay, index: number) => {
            return (
              <WorkingDaySelect
                key={index}
                index={index}
                selectedDay={dayObj.day}
                selectedOpening={dayObj.opening}
                selectedClosing={dayObj.closing}
                handleChangeWorkingDays={handleChangeNewWorkingDays}
                handleDeleteDaySelect={handleDeleteDaySelect}
                isConfirmAble={true}
                handleAddWorkingDay={handleAddWorkingDay}
              />
            );
          })}
        </Box>

        <Button variant="outlined" onClick={handleAddDayOfWork} sx={{ mt: 2 }}>
          Add day
        </Button>
      </Box>
    </Container>
  );
}

export default PersonalData;
