import { NavLink } from 'react-router-dom';
import { Container } from '@mui/material';
import { StyledLinksWrapper, StyledNavBar } from '../styles/StyledNavBar';

function NavBar() {
  return (
    <StyledNavBar>
      <Container>
        <StyledLinksWrapper>
          <NavLink to="/sign-in">Sign In</NavLink>
          <NavLink to="/sign-up">Sign Up</NavLink>
        </StyledLinksWrapper>
      </Container>
    </StyledNavBar>
  );
}

export default NavBar;
