import { Container, Tab, Tabs } from '@mui/material';
import MainTitle from '../components/MainTitle';
import LoginForm from '../components/ui/LoginForm';
import { SyntheticEvent, useEffect, useState } from 'react';

function SignIn() {
  const [loginType, setLoginType] = useState<string>('user');

  // Change login type to user or client
  const handleChangeLoginType = (_: SyntheticEvent, newValue: string) => {
    setLoginType(newValue);
  };

  useEffect(() => {
    // Check if there is data in localstorage and set login type to the localstorage login type
    if (localStorage.length) {
      if (localStorage.getItem('clientStep')) setLoginType('client');
      else setLoginType('user');
    }
  }, []);

  return (
    <Container>
      <MainTitle title="Sign in" />

      <Tabs value={loginType} onChange={handleChangeLoginType} sx={{ mb: 2 }}>
        <Tab label="User" value="user" />
        <Tab label="Client" value="client" />
      </Tabs>

      <LoginForm isClient={loginType === 'user' ? false : true} />
    </Container>
  );
}

export default SignIn;
