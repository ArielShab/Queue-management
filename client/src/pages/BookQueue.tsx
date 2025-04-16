import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchUserQueuesTimes,
  sendClientVerificationCode,
  sendClientQueueData,
  fetchProviderData,
} from '../api/queuesApi';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getUserServices } from '../api/servicesApi';
import { days } from '../utils/WeekDays';
import EmailPopup from '../components/EmailPopup';
import { EmailPopupDetails } from '../types/EmailPopupDetails';
import MainTitle from '../components/MainTitle';
import { alertMessage } from '../components/AlertMessage';
import { ServiceType } from '../types/ServiceType';
import ErrorScrean from '../components/ErrorScreen';

// change time zone and date format to israel
dayjs.extend(utc);
dayjs.extend(timezone);

function BookQueue() {
  const { id: providerId } = useParams(); // get user id from url params
  const [selectedDate, setSelectedDate] = useState<Dayjs>(
    dayjs().add(1, 'day'),
  ); // set booked queue date to tomorrow
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formattingTime, setFormattingTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [openEmailVerification, setOpenEmailVerification] =
    useState<boolean>(false);
  const [emailVerificationStep, setEmailVerificationStep] =
    useState<boolean>(true);
  const [timer, setTimer] = useState<number>(300);
  const queryClient = useQueryClient();

  // fetch provider data by provider id
  const {
    data: provider,
    isLoading: isProviderLoading,
    isError: isProviderError,
    error: providerError,
  } = useQuery({
    queryKey: ['provider', String(providerId)],
    queryFn: fetchProviderData,
  });

  // fetch provider services by provider id
  const {
    data: services,
    isLoading: isServicesLoading,
    isError: isServicesError,
    error: servicesError,
  } = useQuery({
    queryKey: ['services', String(providerId)],
    queryFn: getUserServices,
  });

  // fetch available queues by provider id
  const {
    data: allQueues,
    isLoading: isQueuesLoading,
    isError: isQueuesError,
    error: queuesError,
  } = useQuery({
    queryKey: [
      'queues',
      {
        providerId,
        selectedDayName: days[selectedDate.day()],
        selectedDate: dayjs(selectedDate).format('DD/MM/YYYY'),
      },
    ],
    queryFn: fetchUserQueuesTimes,
  });

  // send verify queue code to user email
  const sendClientQueueMutation = useMutation({
    mutationFn: sendClientQueueData,
    onSuccess: ({ success }) => {
      if (success) {
        setEmailVerificationStep(false);
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
      }
    },
    onError: (error) => {
      console.error('error', error);
    },
  });

  // check user verification queue code
  const sendVerificationCodeMutation = useMutation({
    mutationFn: sendClientVerificationCode,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ['queues'],
          exact: true,
        });
        setSelectedTime('');
        setSelectedService('');
        setOpenEmailVerification(false);
        setEmailVerificationStep(true);
        setTimer(300);
        alertMessage('success', data.data);
      } else {
        alertMessage('error', data.message);
      }
    },
    onError: (error) => {
      console.error('error', error);
    },
  });

  // check if all fields are valid before send queue
  const handleSendEmailVerification = (data: EmailPopupDetails) => {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;

    if (!data.clientName) {
      alertMessage('warn', 'Full name is required');
      return;
    } else if (data.clientName.length < 2) {
      alertMessage('warn', 'Invalid full name');
      return;
    }
    if (!data.clientEmail) {
      alertMessage('warn', 'Email is required');
      return;
    } else if (!emailRegex.test(data.clientEmail)) {
      alertMessage('warn', 'Invalid email');
      return;
    }

    sendClientQueueMutation.mutate({
      ...data,
      queueTime: formattingTime,
      serviceId: selectedService,
      userId: Number(providerId),
    });
  };

  const handleSendVerificationCode = (code: string) => {
    sendVerificationCodeMutation.mutate({
      queueTime: formattingTime,
      userId: Number(providerId),
      verificationCode: code,
    });
  };

  const handleChangeDate = (e: any) => {
    if (!dayjs(e.$d).isBefore(dayjs())) {
      setSelectedDate(e);
    } else {
      alertMessage('warn', 'Please choose a valid date');
    }
  };

  useEffect(() => {
    // if selected time valid render queue times
    if (selectedTime) {
      const [hour, minute] = selectedTime.trim().split(':').map(Number);
      const tempFormattingTime: string = dayjs(selectedDate)
        .hour(hour)
        .minute(minute)
        .format('YYYY-MM-DDTHH:mm:ss.SSSZ');

      setFormattingTime(tempFormattingTime);
    }
  }, [selectedTime]);

  if (isProviderLoading || isServicesLoading || isQueuesLoading)
    return <CircularProgress />;
  if (isProviderError || isServicesError || isQueuesError)
    return (
      <ErrorScrean
        error={JSON.stringify(providerError || servicesError || queuesError)}
      />
    );

  return (
    <Container>
      <MainTitle title="Book a queue" />

      <Box mb={2.5}>
        <Typography mb={1} fontWeight="600">
          {`Provider: ${provider?.data.firstName} ${provider?.data.lastName}`}
        </Typography>
        <Typography mb={1} fontWeight="600">
          {`Eamil: ${provider?.data.email}`}
        </Typography>
        <Typography fontWeight="600">{`Phone: ${provider?.data.phone}`}</Typography>
      </Box>

      <Typography>Choose date:</Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={selectedDate} onChange={handleChangeDate} />
      </LocalizationProvider>
      {allQueues?.data?.length ? (
        <>
          <Typography component="h3" variant="h3" mb={2}>
            {`Date: ${dayjs(selectedDate).format('DD/MM/YYYY')}`}
          </Typography>

          <Typography>Choose time:</Typography>

          <FormControl
            variant="standard"
            sx={{ minWidth: 120, width: '100%', mb: 3 }}
          >
            <InputLabel id="time">Time</InputLabel>
            <Select
              labelId="time"
              id="time"
              name="time"
              value={selectedTime}
              onChange={(e: SelectChangeEvent) => {
                setSelectedTime(e.target.value);
              }}
              label="Choose time"
            >
              {allQueues?.data.map((queue: string) => {
                return (
                  <MenuItem key={queue} value={queue}>
                    {queue}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Typography>Choose service:</Typography>

          <FormControl variant="standard" sx={{ minWidth: 120, width: '100%' }}>
            <InputLabel id="service">Service</InputLabel>
            <Select
              labelId="service"
              id="service"
              name="service"
              value={selectedService}
              onChange={(e: SelectChangeEvent) => {
                setSelectedService(e.target.value);
              }}
              label="Choose service"
            >
              {services?.data.map((service: ServiceType) => {
                return (
                  <MenuItem key={service.id} value={service.id}>
                    {service.serviceName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Box textAlign="end" mb={3.5}>
            <Button
              variant="contained"
              onClick={() => setOpenEmailVerification(true)}
              sx={{ mt: 3 }}
            >
              Book queue
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="h3" component="h3">
          {allQueues?.message}
        </Typography>
      )}
      <EmailPopup
        open={openEmailVerification}
        setOpen={setOpenEmailVerification}
        showEmailVerification={emailVerificationStep}
        handleSendEmailVerification={handleSendEmailVerification}
        handleSendVerificationCode={handleSendVerificationCode}
        timer={timer}
      />
    </Container>
  );
}

export default BookQueue;
