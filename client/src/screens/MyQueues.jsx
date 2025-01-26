import React, { useContext, useEffect, useState } from "react";
import { Box, Container, Stack, Tab, Tabs, Typography } from "@mui/material";
import { StyledSignUpForm, StyledSubmitInput } from "../styles/SignUpStyles";
import InputField from "../components/general/InputField";
import { sendClientLoginCode, sendCodeToClientMail } from "../api/usersApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MainTitle from "../components/general/MainTitle";
import { alertMessage } from "../tools/AlertMessage";
import { deleteBookedQueue, fetchClientBookedQueues } from "../api/queuesApi";
import BookedQueue from "../components/queues/BookedQueue";
import { jwtDecode } from "jwt-decode";
import { ClientContext } from "../context/clientContext";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

function MyQueues() {
  const [fieldsErrors, setFieldsErrors] = useState({});
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(300); // 5-minute timer in seconds
  const queryClient = useQueryClient();
  const [queuesToView, setQueuesToView] = useState(0);
  const { loggedClient, setLoggedClient } = useContext(ClientContext);
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  const sendCodeToClientMailMutation = useMutation({
    mutationFn: sendCodeToClientMail,
    onSuccess: (response) => {
      if (response.success) {
        setStep(2);
        // Store the user's email in localStorage and a flag indicating they are at step 2
        localStorage.setItem("step", "verification");
        localStorage.setItem("clientEmail", email); // Store the email
        const expiresAt = Date.now() + 5 * 60 * 1000; // Store expiration time (5 minutes)
        localStorage.setItem("codeExpiration", expiresAt);
        // Start the countdown timer
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
      } else alertMessage("error", response.message);
    },
    onError: (error, body, context) => {
      console.error("Invalid email", error);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: sendClientLoginCode,
    onSuccess: (data) => {
      console.log("data", data);
      if (data.success) {
        localStorage.removeItem("step");
        localStorage.removeItem("clientEmail");
        localStorage.removeItem("codeExpiration");
        localStorage.setItem("clientToken", data.data);

        setLoggedClient(jwtDecode(data.data));

        alertMessage("success", "Login successful");
      } else {
        setFieldsErrors({ "verification-code": data.message });
      }
    },
    onError: (error) => {
      console.error("Invalid or expired code", error);
    },
  });

  const { data: queues } = useQuery({
    queryKey: ["queues", loggedClient?.id],
    queryFn: fetchClientBookedQueues,
    enabled: !!loggedClient,
    onError: (error) => {
      console.error("Could not get queues", error);
    },
  });

  const deleteQueueMutation = useMutation({
    mutationFn: deleteBookedQueue,
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries(["queues"], { exact: true });
        alert("Queue was deleted");
      }
    },
    onError: (error) => {
      console.error("error", error);
    },
  });

  const handleFieldChange = (id, value) => {
    if (id === "email") setEmail(value);
    else if (id === "verification-code") setVerificationCode(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
    const errors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email";
    }
    setFieldsErrors(errors);

    // If there are validation errors, stop the submission
    if (Object.keys(errors).length) return;
    sendCodeToClientMailMutation.mutate({ email });
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();

    verifyCodeMutation.mutate({ clientEmail: email, verificationCode });
  };

  const handleDeleteQueue = (id) => {
    deleteQueueMutation.mutate(id);
  };

  const handleChange = (event, newQueueToView) => {
    setQueuesToView(newQueueToView);
  };

  // const resendCode = async () => {
  // 	resendCodeMutation.mutate({ email });
  // };

  useEffect(() => {
    // Check if user logged in
    const userToken = localStorage.getItem("token");

    if (userToken) {
      const decodedToken = jwtDecode(userToken);
      setLoggedUser(decodedToken);

      if (decodedToken.id) navigate("/");
    }

    // Check if the client is supposed to be on the verification code page
    const step = localStorage.getItem("step");
    const expiration = localStorage.getItem("codeExpiration");

    if (step !== "verification" || !expiration) {
      // If not, redirect to step 1 (login page)
      return;
    }

    const currentTime = Date.now();

    if (currentTime > parseInt(expiration)) {
      // Code has expired, redirect back to step 1
      localStorage.removeItem("step");
      localStorage.removeItem("clientEmail");
      localStorage.removeItem("codeExpiration");
      return;
    } else {
      setStep(2);
      setEmail(localStorage.getItem("clientEmail"));
    }

    const remainingTime = Math.floor((expiration - currentTime) / 1000);
    setTimer(remainingTime);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup interval when component unmounts or re-renders
    return () => {
      clearInterval(interval);
    };
  }, []);

  const renderSubmitionForm = () => {
    return step === 1 ? (
      <>
        <StyledSignUpForm onSubmit={handleSubmit}>
          <InputField
            label="Email"
            id="email"
            placeholder="Enter email please"
            required={true}
            fieldsErrors={fieldsErrors}
            value={email}
            handleFieldChange={handleFieldChange}
          />
          <Stack alignItems="flex-end">
            <StyledSubmitInput type="submit" value="Send" />
          </Stack>
        </StyledSignUpForm>
      </>
    ) : (
      <>
        <Typography component="h3" variant="h3" marginBlock="30px">
          Set verification code
        </Typography>
        <StyledSignUpForm onSubmit={handleVerifyCode}>
          <InputField
            label="Verification Code"
            id="verification-code"
            placeholder="Verification Code"
            required={true}
            fieldsErrors={fieldsErrors}
            value={verificationCode}
            handleFieldChange={handleFieldChange}
          />
          <Stack alignItems="flex-end">
            <StyledSubmitInput type="submit" value="Verify" />
          </Stack>

          {timer > 0 ? (
            <Typography>
              Time remaining: {Math.floor(timer / 60)}:
              {(timer % 60).toString().padStart(2, "0")}
            </Typography>
          ) : (
            <Typography>Code expired</Typography>
          )}
        </StyledSignUpForm>
      </>
    );
  };

  const renderQueues = () => {
    return (
      <>
        <Box sx={{ borderColor: "divider" }}>
          <Tabs
            value={queuesToView}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Future queues" />
            <Tab label="Past queues" />
          </Tabs>
        </Box>
        <Stack marginTop="24px" rowGap="16px">
          {queuesToView === 0 ? renderFutureQueues() : renderPastQueues()}
        </Stack>
      </>
    );
  };

  const renderFutureQueues = () => {
    if (queues?.data.futureQueues.length) {
      return queues?.data.futureQueues.map((queue, index) => {
        return (
          <BookedQueue
            key={queue.id}
            queue={queue}
            index={index}
            handleDeleteQueue={handleDeleteQueue}
            client={true}
          />
        );
      });
    } else return <Typography variant="h3">No future queues</Typography>;
  };
  const renderPastQueues = () => {
    if (queues?.data.pastQueues.length) {
      return queues?.data.pastQueues.map((queue, index) => {
        return (
          <BookedQueue
            key={queue.id}
            queue={queue}
            index={index}
            client={true}
          />
        );
      });
    } else return <Typography variant="h3">No past queues</Typography>;
  };

  return (
    <Container>
      <MainTitle title="My Queues" />
      {queues ? renderQueues() : renderSubmitionForm()}
    </Container>
  );
}

export default MyQueues;
