import { Container } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { StyledLinksWrapper, StyledNavBar } from "../../styles/NavBarStyles";

function ClientNavBar() {
  return (
    <StyledNavBar>
      <Container>
        <StyledLinksWrapper>
          <NavLink to="/sign-out">Sign Out</NavLink>
        </StyledLinksWrapper>
      </Container>
    </StyledNavBar>
  );
}

export default ClientNavBar;
