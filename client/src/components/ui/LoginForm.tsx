import { Button, Stack, Typography } from '@mui/material';
import { StyledFormWrapper } from '../../styles/UiStyles';
import InputField from './InputField';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { FieldsErrors } from '../../types/FieldsErrors';
import { useMutation } from '@tanstack/react-query';
import { loginUser, verifyCode } from '../../api/usersApi';
import { jwtDecode } from 'jwt-decode';
import { UserContext } from '../../contexts/userContext';
import { ClientContext } from '../../contexts/clientContext';
import { useNavigate } from 'react-router-dom';
import { alertMessage } from '../AlertMessage';
import { CustomJwtPayload } from '../../types/CustomJwtPayload';
import { UserContextType } from '../../types/UserContextType';
import { ClientContextType } from '../../types/ClientContextType';

function LoginForm({ isClient }: { isClient: boolean }) {
  const [fieldsErrors, setFieldsErrors] = useState<FieldsErrors>({});
  const [email, setEmail] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [step, setStep] = useState<number>(1);
  const [timer, setTimer] = useState<number>(300); // 5-minute timer in seconds
  const { setLoggedUser, isUserAuthenticated, setIsUserAuthenticated } =
    useContext(UserContext) as UserContextType;
  const { setLoggedClient, isClientAuthenticated, setIsClientAuthenticated } =
    useContext(ClientContext) as ClientContextType;
  const navigate = useNavigate();

  const loginUserMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      if (response.success) {
        setStep(2);
        // Store the user's or client's email in localStorage and the step of the login
        localStorage.setItem(isClient ? 'clientStep' : 'step', 'verification');
        localStorage.setItem(isClient ? 'clientEmail' : 'email', email);
        const expiresAt: number = Date.now() + 5 * 60 * 1000; // Store expiration time (5 minutes)
        localStorage.setItem(
          isClient ? 'clientCodeExpiration' : 'codeExpiration',
          expiresAt.toString(),
        );
        // Start the countdown timer
        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
      } else {
        alertMessage('error', response.message);
      }
    },
    onError: (error) => {
      console.error('Invalid email or password', error);
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: verifyCode,
    onSuccess: (data) => {
      if (data.success) {
        localStorage.removeItem(isClient ? 'clientStep' : 'step');
        localStorage.removeItem(isClient ? 'clientEmail' : 'email');
        localStorage.removeItem(
          isClient ? 'clientCodeExpiration' : 'codeExpiration',
        );
        localStorage.setItem(isClient ? 'clientToken' : 'token', data.data);

        // get user data from decoded token
        const decodedToken = jwtDecode<CustomJwtPayload>(data.data);

        if (!isClient) {
          setLoggedUser(decodedToken);
          setIsUserAuthenticated(true);
        } else {
          setLoggedClient(decodedToken);
          setIsClientAuthenticated(true);
        }

        alertMessage('success', 'login succesful');

        // Redirect to the pesonal data if this is user login
        if (!isClient) navigate('/');
        else navigate('/my-queues');
      } else {
        setFieldsErrors({ 'verification-code': data.message });
      }
    },
    onError: (error) => {
      console.error('Invalid or expired code', error);
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: ({ success }) => {
      if (success) {
        const expiresAt: number = Date.now() + 5 * 60 * 1000;
        localStorage.setItem(
          isClient ? 'clientCodeExpiration' : 'codeExpiration',
          expiresAt.toString(),
        );
        setTimer(300);

        const interval = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) clearInterval(interval);
            return prev - 1;
          });
        }, 1000);
      }
    },
    onError: (error) => {
      console.error('Invalid email or password', error);
    },
  });

  const handleFieldChange = (id: string, value: string) => {
    if (id === 'email') setEmail(value);
    else if (id === 'verification-code') setVerificationCode(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
    const errors: FieldsErrors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Invalid email';
    }
    setFieldsErrors(errors);

    // If there are validation errors, stop the submission
    if (Object.keys(errors).length) return;

    loginUserMutation.mutate({ email, isClient });
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();

    const errors: FieldsErrors = {};

    if (!verificationCode) {
      errors.verificationCode = 'Verification Code is required';
    }

    setFieldsErrors(errors);

    // If there are validation errors, stop the submission
    if (Object.keys(errors).length) return;

    verifyCodeMutation.mutate({
      email,
      code: verificationCode,
      isClient,
    });
  };

  const resendCode = async () => {
    resendCodeMutation.mutate({ email, isClient });
  };

  useEffect(() => {
    // Check if user or client logged in
    if (isUserAuthenticated) navigate('/');
    else if (isClientAuthenticated) navigate('/my-queues');

    // Check if the client is supposed to be on the verification code page
    const step = localStorage.getItem(isClient ? 'clientStep' : 'step');
    const expiration = localStorage.getItem(
      isClient ? 'clientCodeExpiration' : 'codeExpiration',
    );

    // Set login from begining if the step is one or if code expired
    if (step !== 'verification' || !expiration) {
      setStep(1);
      return;
    }

    const currentTime: number = Date.now();

    if (currentTime > Number(expiration)) {
      // Code has expired, redirect back to step 1
      localStorage.removeItem(isClient ? 'clientStep' : 'step');
      localStorage.removeItem(isClient ? 'clientEmail' : 'email');
      localStorage.removeItem(
        isClient ? 'clientCodeExpiration' : 'codeExpiration',
      );
      return;
    } else {
      const email: string | null = localStorage.getItem(
        isClient ? 'clientEmail' : 'email',
      );
      if (email) {
        setStep(2);
        setEmail(email);
      }
    }

    const remainingTime: number = Math.floor(
      (Number(expiration) - currentTime) / 1000,
    );
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
  }, [isClient]);

  return (
    <StyledFormWrapper onSubmit={step === 1 ? handleSubmit : handleVerifyCode}>
      <InputField
        label={step === 1 ? 'Email' : 'Verification Code'}
        id={step === 1 ? 'email' : 'verification-code'}
        placeholder={
          step === 1
            ? 'Enter your email please'
            : 'Enter verification code please'
        }
        fieldsErrors={fieldsErrors}
        value={step === 1 ? email : verificationCode}
        handleFieldChange={handleFieldChange}
      />

      <Stack alignItems="flex-end" sx={{ mt: 2 }}>
        <Button type="submit" variant="outlined">
          Send
        </Button>
      </Stack>

      {step === 2 && timer > 0 && (
        <Typography>
          Time remaining: {Math.floor(timer / 60)}:
          {(timer % 60).toString().padStart(2, '0')}
        </Typography>
      )}

      {step === 2 && timer === 0 && (
        <>
          <Typography>Code expired</Typography>
          <Button variant="contained" onClick={resendCode}>
            Resend Code
          </Button>
        </>
      )}
    </StyledFormWrapper>
  );
}

export default LoginForm;
