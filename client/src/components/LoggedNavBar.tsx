import { SyntheticEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { StyledLinksWrapper, StyledNavBar } from '../styles/StyledNavBar';
import {
  BottomNavigation,
  BottomNavigationAction,
  Container,
  Paper,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ServicesIcon from '@mui/icons-material/Settings';
import QueueIcon from '@mui/icons-material/ListAlt';
import { NavigationItem } from '../types/NavigationItem';

function LoggedNavBar() {
  const [value, setValue] = useState<number>(0);
  const navigate = useNavigate();

  const navigationItems: NavigationItem[] = [
    { label: 'Person Data', icon: <PersonIcon />, path: '/' },
    { label: 'Services', icon: <ServicesIcon />, path: '/services' },
    { label: 'Queues', icon: <QueueIcon />, path: '/queues' },
  ];

  return (
    <>
      <StyledNavBar>
        <Container>
          <StyledLinksWrapper>
            <NavLink to="/sign-out">Sign Out</NavLink>
          </StyledLinksWrapper>
        </Container>
      </StyledNavBar>
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_: SyntheticEvent, newValue: number) => {
            setValue(newValue);
          }}
        >
          {navigationItems.map(({ label, icon, path }: NavigationItem) => (
            <BottomNavigationAction
              key={label}
              label={label}
              icon={icon}
              onClick={() => navigate(path)}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
}

export default LoggedNavBar;
