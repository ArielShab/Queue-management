import {
  Box,
  Button,
  Container,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { FormEvent, useContext, useEffect, useState } from 'react';
import MainTitle from '../components/MainTitle';
import { StyledFormWrapper } from '../styles/UiStyles';
import InputField from '../components/ui/InputField';
import { FieldsErrors } from '../types/FieldsErrors';
import { SignUpFields } from '../types/SignUpFields';
import { WorkingDay } from '../types/WorkingDay';
import WorkingDaySelect from '../components/WorkingDaySelect';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '../api/usersApi';
import { useNavigate } from 'react-router-dom';
import { ClientContext } from '../contexts/clientContext';
import { UserContext } from '../contexts/userContext';
import { alertMessage } from '../components/AlertMessage';
import { UserContextType } from '../types/UserContextType';
import { ClientContextType } from '../types/ClientContextType';

function SignUp() {
  const [fieldsErrors, setFieldsErrors] = useState<FieldsErrors>({});
  const [fieldsValues, setFieldsValues] = useState<SignUpFields>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    queueDuration: 0,
  });
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([]);
  const { loggedUser } = useContext(UserContext) as UserContextType;
  const { loggedClient } = useContext(ClientContext) as ClientContextType;
  const navigate = useNavigate();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: ({ success, data: email }) => {
      if (success) {
        // Store the user's email in localStorage and a flag indicating they are at step 2
        localStorage.setItem('step', 'verification');
        localStorage.setItem('email', email);
        const expiresAt: number = Date.now() + 5 * 60 * 1000;
        localStorage.setItem('codeExpiration', expiresAt.toString());
        alertMessage('success', 'User was created');
        navigate('/sign-in');
      }
    },
    onError: (error) => {
      console.error('Error creating user', error);
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate form fields
    const errors: FieldsErrors = validate(fieldsValues);
    setFieldsErrors(errors);

    // If there are validation errors, stop the submission
    if (Object.keys(errors).length) return;

    createUserMutation.mutate({ fieldsValues, workingDays });
  };

  const validate = (values: SignUpFields) => {
    const errors: FieldsErrors = {};
    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^0\d{8,9}$/;

    if (!values.firstName) errors.firstName = 'First name is required';
    if ((values.firstName as string).length < 2)
      errors.firstName = 'First name is invalid';

    if (!values.lastName) errors.lastName = 'Last name is required';
    if ((values.lastName as string).length < 2)
      errors.lastName = 'Last name is invalid';

    if (!values.email) errors.email = 'Email is required';
    else if (!emailRegex.test(values.email as string))
      errors.email = 'Invalid email';

    if (!values.phone) errors.phone = 'Phone number is required';
    else if (!phoneRegex.test(values.phone as string))
      errors.phone = 'Invalid phone number';

    if (values.queueDuration === 0)
      errors.queueDuration = 'Queue duration is required';
    else if (isNaN(values.queueDuration as number))
      errors.queueDuration = 'Invalid queue duration';

    if (!workingDays.length)
      errors.workingDays = 'You should choose at least 1 working day';
    else if (
      (workingDays.length === 1 && !workingDays[0].day) ||
      !workingDays[0].opening ||
      !workingDays[0].closing
    )
      errors.workingDays = 'Working day is missing data';
    else if (workingDays[0].opening >= workingDays[0].closing)
      errors.workingDays = 'Invalid working time';

    return errors;
  };

  const handleFieldChange = (id: string, value: string) => {
    const temp: SignUpFields = { ...fieldsValues };
    temp[id] = id === 'queueDuration' ? +value : value;
    setFieldsValues(temp);
  };

  const handleAddDayOfWork = () => {
    const temp: WorkingDay[] = [...workingDays];
    temp.push({ day: '', opening: '', closing: '' });
    setWorkingDays(temp);
  };

  const handleChangeWorkingDays = (
    event: SelectChangeEvent<string>,
    index: number,
  ) => {
    const temp: WorkingDay[] = [...workingDays];
    const newDayObj: WorkingDay = temp[index];

    newDayObj[event.target.name as keyof WorkingDay] = event.target.value;
    setWorkingDays(temp);
  };

  const handleDeleteDaySelect = (index: number) => {
    const temp: WorkingDay[] = workingDays.filter(
      (_: WorkingDay, idx) => idx !== index,
    );
    setWorkingDays(temp);
  };

  useEffect(() => {
    // Check if user or client logged in
    if (loggedUser.id) navigate('/');
    else if (loggedClient.id) navigate('/my-queues');
  }, []);

  return (
    <Container>
      <MainTitle title="Sign Up" />

      <StyledFormWrapper onSubmit={handleSubmit}>
        <InputField
          label="First name"
          id="firstName"
          placeholder="Enter first name please"
          fieldsErrors={fieldsErrors}
          value={fieldsValues.firstName}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Last name"
          id="lastName"
          placeholder="Enter last name please"
          fieldsErrors={fieldsErrors}
          value={fieldsValues.lastName}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Email"
          id="email"
          placeholder="Enter email please"
          fieldsErrors={fieldsErrors}
          value={fieldsValues.email}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Phone"
          id="phone"
          placeholder="Enter first name please"
          fieldsErrors={fieldsErrors}
          value={fieldsValues.phone}
          handleFieldChange={handleFieldChange}
        />
        <InputField
          label="Queue Duration (minutes)"
          id="queueDuration"
          placeholder="Enter queue duration please"
          fieldsErrors={fieldsErrors}
          value={fieldsValues.queueDuration}
          handleFieldChange={handleFieldChange}
        />

        <Typography component="h3" variant="h3" mt={2}>
          Choose days of work:
        </Typography>

        <Box mt={2}>
          {workingDays.map((dayObj: WorkingDay, index: number) => {
            return (
              <WorkingDaySelect
                key={index}
                index={index}
                selectedDay={dayObj.day}
                selectedOpening={dayObj.opening}
                selectedClosing={dayObj.closing}
                handleChangeWorkingDays={handleChangeWorkingDays}
                handleDeleteDaySelect={handleDeleteDaySelect}
              />
            );
          })}
        </Box>

        <Typography color="#f00">{fieldsErrors.workingDays}</Typography>

        <Button variant="outlined" onClick={handleAddDayOfWork} sx={{ mt: 2 }}>
          Add day
        </Button>

        <Stack alignItems="flex-end">
          <Button type="submit" variant="outlined">
            Register
          </Button>
        </Stack>
      </StyledFormWrapper>
    </Container>
  );
}

export default SignUp;
