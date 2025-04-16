import { Container } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { StyledLinksWrapper, StyledNavBar } from '../styles/StyledNavBar';

function ClientNavBar() {
  return (
    <StyledNavBar>
      <Container>
        <StyledLinksWrapper>
          <NavLink to="/my-queues" style={{ marginInlineEnd: 'auto' }}>
            My Queues
          </NavLink>
          <NavLink to="/sign-out">Sign Out</NavLink>
        </StyledLinksWrapper>
      </Container>
    </StyledNavBar>
  );
}

export default ClientNavBar;
