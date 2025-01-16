import { Box, Button, Container, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import InputField from "../components/general/InputField";
import {
  StyledSignUpForm,
  StyledSubmitInput,
  StyledWarningMessage,
} from "../styles/SignUpStyles";
import { createUser } from "../api/usersApi";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../context/userContext";
import { useMutation } from "@tanstack/react-query";
import MainTitle from "../components/general/MainTitle";
import WorkingDaySelect from "../components/SignUp/WorkingDaySelect";
import { days } from "../tools/WeekDays";
import { alertMessage } from "../tools/AlertMessage";

function SignUp() {
  const [fieldsValues, setFieldsValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    queueDuration: 0,
  });
  const [fieldsErrors, setFieldsErrors] = useState({});
  const [workingDays, setWorkingDays] = useState([]);
  const { setLoggedUser } = useContext(UserContext);
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: ({ success, data: email }) => {
      if (success) {
        // Store the user's email in localStorage and a flag indicating they are at step 2
        localStorage.setItem("step", "verification");
        localStorage.setItem("email", email); // Store the email
        const expiresAt = Date.now() + 5 * 60 * 1000; // Store expiration time (5 minutes)
        localStorage.setItem("codeExpiration", expiresAt);
        alertMessage("success", "User was created");
        navigate("/sign-in");
      }
    },
    onError: (error) => {
      console.error("Error creating user", error);
    },
  });

  const handleFieldChange = (id, value) => {
    const temp = { ...fieldsValues };
    temp[id] = id === "queueDuration" ? +value : value;
    setFieldsValues(temp);
  };

  const handleChangeWorkingDays = (event, index) => {
    const temp = [...workingDays];

    const newDayObj = temp[index];
    newDayObj[event.target.name] = event.target.value;
    setWorkingDays(temp);
  };

  const handleAddDayOfWork = () => {
    const temp = [...workingDays];
    temp.push({ day: "", opening: "", closing: "" });
    setWorkingDays(temp);
  };

  const handleDeleteDaySelect = (index) => {
    const temp = workingDays.filter((dayObj, idx) => idx !== index);
    setWorkingDays(temp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    const errors = validate(fieldsValues);
    setFieldsErrors(errors);

    // If there are validation errors, stop the submission
    if (Object.keys(errors).length) return;

    createUserMutation.mutate({ fieldsValues, workingDays });
  };

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^0\d{8,9}$/;

    if (!values.firstName) errors.firstName = "First name is required";

    if (!values.lastName) errors.lastName = "Last name is required";

    if (!values.email) errors.email = "Email is required";
    else if (!emailRegex.test(values.email)) errors.email = "Invalid email";

    if (!values.phone) errors.phone = "Phone number is required";
    else if (!phoneRegex.test(values.phone))
      errors.phone = "Invalid phone number";

    if (values.queueDuration === 0)
      errors.queueDuration = "Queue duration is required";
    else if (isNaN(values.queueDuration))
      errors.queueDuration = "Invalid queue duration";

    if (!workingDays.length)
      errors.workingDays = "You should choose at least 1 working day";
    else if (
      (workingDays.length === 1 && !workingDays[0].day) ||
      !workingDays[0].opening ||
      !workingDays[0].closing
    )
      errors.workingDays = "Working day is missing data";
    else if (workingDays[0].opening >= workingDays[0].closing)
      errors.workingDays = "Invalid working time";

    return errors;
  };

  useEffect(() => {
    // Check if user if logged in
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      setLoggedUser(decodedToken);

      if (decodedToken.id) navigate("/");
    }
  }, []);

  return (
    <Container>
      <MainTitle title="Sign Up" />

      <StyledSignUpForm onSubmit={handleSubmit}>
        <InputField
          label="First name"
          id="firstName"
          placeholder="Enter first name please"
          required={true}
          fieldsErrors={fieldsErrors}
          value={fieldsValues.firstName}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Last name"
          id="lastName"
          placeholder="Enter last name please"
          required={true}
          fieldsErrors={fieldsErrors}
          value={fieldsValues.lastName}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Email"
          id="email"
          placeholder="Enter email please"
          required={true}
          fieldsErrors={fieldsErrors}
          value={fieldsValues.email}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Phone *"
          id="phone"
          placeholder="Enter first name please"
          fieldsErrors={fieldsErrors}
          value={fieldsValues.phone}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Queue Duration (minutes) *"
          id="queueDuration"
          placeholder="Enter queue duration please"
          type={"number"}
          fieldsErrors={fieldsErrors}
          value={fieldsValues.queueDuration}
          handleFieldChange={handleFieldChange}
        />

        <Typography component="h3" variant="h3" marginTop="16px">
          Choose days of work:
        </Typography>

        <Box marginTop="16px">
          {workingDays.map((dayObj, index) => {
            return (
              <WorkingDaySelect
                key={index}
                index={index}
                days={days}
                selectedDay={dayObj.day}
                selectedOpening={dayObj.opening}
                selectedClosing={dayObj.closing}
                handleChangeWorkingDays={handleChangeWorkingDays}
                handleDeleteDaySelect={handleDeleteDaySelect}
              />
            );
          })}
        </Box>

        <StyledWarningMessage>{fieldsErrors.workingDays}</StyledWarningMessage>
        <Button
          variant="outlined"
          onClick={handleAddDayOfWork}
          sx={{ marginTop: 2 }}
        >
          Add day
        </Button>

        <Stack alignItems="flex-end">
          <StyledSubmitInput type="submit" value="Register" />
        </Stack>
      </StyledSignUpForm>
    </Container>
  );
}

export default SignUp;
