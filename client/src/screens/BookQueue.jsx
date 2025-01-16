import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import MainTitle from "../components/general/MainTitle";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchUserQueuesTimes,
  sendClientVerificationCode,
  sendClientQueueData,
} from "../api/queuesApi";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { StyledLoader } from "../styles/LoaderStyle";
import { getUserServices } from "../api/servicesApi";
import { getUserPersonalData } from "../api/usersApi";
import EmailPopup from "../components/bookQueue/EmailPopup";
import { days } from "../tools/WeekDays";
import { alertMessage } from "../tools/AlertMessage";

dayjs.extend(utc);
dayjs.extend(timezone);

function BookQueue() {
  const { id: providerId } = useParams();
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "day"));
  const [selectedTime, setSelectedTime] = useState("");
  const [formattingTime, setFormattingTime] = useState("");
  const [selectedService, setSelectedService] = useState("");
  // const [selectedDayName, setSelectedDayName] = useState('');
  const [openEmailVerification, setOpenEmailVerification] = useState(false);
  const [emailVerificationStep, setEmailVerificationStep] = useState(true);
  const [timer, setTimer] = useState(300);

  const { data: allQueues } = useQuery({
    queryKey: [
      "queues",
      {
        providerId,
        selectedDayName: days[selectedDate.day()],
        selectedDate: dayjs(selectedDate).format("DD/MM/YYYY"),
      },
    ],
    queryFn: fetchUserQueuesTimes,
    // enabled: selectedDate !== null,
    onError: (error) => {
      console.log("Couldn't get queues", error);
    },
  });

  const { data: user } = useQuery({
    queryKey: ["user", providerId],
    queryFn: getUserPersonalData,
    onError: (error) => {
      console.log("Couldn't get user data", error);
    },
  });

  const {
    data: services,
    isLoadingServices,
    isErrorServices,
    errorServices,
  } = useQuery({
    queryKey: ["services", providerId],
    queryFn: getUserServices,
    onError: (error) => {
      console.log("Couldn't get services", error);
    },
  });

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
      console.error("error", error);
    },
  });

  const sendVerificationCodeMutation = useMutation({
    mutationFn: sendClientVerificationCode,
    onSuccess: (data) => {
      if (data.success) {
        setSelectedTime("");
        setSelectedService("");
        setOpenEmailVerification(false);
        setEmailVerificationStep(true);
        setTimer(300);
        alertMessage("success", data.data);
      } else {
        alertMessage("error", data.message);
      }
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const handleSendEmailVerification = (data) => {
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;

    if (!data.clientName) {
      alertMessage("warn", "Full name is required");
      return;
    } else if (data.clientName.length < 2) {
      alertMessage("warn", "Invalid full name");
      return;
    }
    if (!data.clientEmail) {
      alertMessage("warn", "Email is required");
      return;
    } else if (!emailRegex.test(data.clientEmail)) {
      alertMessage("warn", "Invalid email");
      return;
    }

    sendClientQueueMutation.mutate({
      ...data,
      queueTime: formattingTime,
      serviceId: selectedService,
      userId: +providerId,
    });
  };

  const handleSendVerificationCode = (code) => {
    sendVerificationCodeMutation.mutate({
      queueTime: formattingTime,
      userId: +providerId,
      verificationCode: code,
    });
  };

  const handleChangeDate = (e) => {
    if (!dayjs(e.$d).isBefore(dayjs())) {
      // const localDate = dayjs(e.$d).startOf('day'); // Ensures time is midnight local
      // const isoString = localDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // Custom ISO format with local timezone
      // setSelectedDate(isoString);
      setSelectedDate(e);
      // setSelectedDayName(days[e.day()]);
    } else {
      alertMessage("warn", "Please choose a valid date");
    }
  };

  useEffect(() => {
    if (selectedTime) {
      const [hour, minute] = selectedTime.trim().split(":").map(Number);
      const tempFormattingTime = dayjs(selectedDate)
        .hour(hour)
        .minute(minute)
        .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

      setFormattingTime(tempFormattingTime);
    }
  }, [selectedTime]);

  if (isLoadingServices) return <StyledLoader />;
  if (isErrorServices) return <p>{JSON.stringify(errorServices)}</p>;

  return (
    <Container>
      <MainTitle title="Book a queue" />

      <Box marginBottom="20px">
        <Typography marginBottom="8px" fontWeight="600">
          {`Provider: ${user?.data.firstName} ${user?.data.lastName}`}
        </Typography>
        <Typography marginBottom="8px" fontWeight="600">
          {`Eamil: ${user?.data.email}`}
        </Typography>
        <Typography fontWeight="600">{`Phone: ${user?.data.phone}`}</Typography>
      </Box>

      <Typography>Choose date:</Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={(e) => handleChangeDate(e)}
        />
      </LocalizationProvider>
      {allQueues?.data?.length ? (
        <>
          <Typography component="h3" variant="h3" marginBottom="16px">
            {`Date: ${dayjs(selectedDate).format("DD/MM/YYYY")}`}
          </Typography>

          <Typography>Choose time:</Typography>

          <FormControl
            variant="standard"
            sx={{ minWidth: 120, width: "100%", mb: 3 }}
          >
            <InputLabel id="time">Time</InputLabel>
            <Select
              labelId="time"
              id="time"
              name="time"
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
              }}
              label="Choose time"
            >
              {allQueues?.data.map((queue) => {
                return (
                  <MenuItem key={queue} value={queue}>
                    {queue}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Typography>Choose service:</Typography>

          <FormControl variant="standard" sx={{ minWidth: 120, width: "100%" }}>
            <InputLabel id="service">Service</InputLabel>
            <Select
              labelId="service"
              id="service"
              name="service"
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
              }}
              label="Choose service"
            >
              {services?.data.map((service) => {
                return (
                  <MenuItem key={service.id} value={service.id}>
                    {service.serviceName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Box textAlign="end" marginBottom="30px">
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
        step={emailVerificationStep}
        handleSendEmailVerification={handleSendEmailVerification}
        handleSendVerificationCode={handleSendVerificationCode}
        timer={timer}
      />
    </Container>
  );
}

export default BookQueue;
