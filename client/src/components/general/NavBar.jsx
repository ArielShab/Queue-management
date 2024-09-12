import React from 'react';
import { NavLink } from 'react-router-dom';
import { StyledLinksWrapper, StyledNavBar } from '../../styles/NavBarStyles';
import { Container, Stack } from '@mui/material';

function NavBar() {
	return (
		<StyledNavBar>
			<Container>
				<StyledLinksWrapper>
					<NavLink to='sign-in'>Sign In</NavLink>
					<NavLink to='sign-up'>Sign Up</NavLink>
				</StyledLinksWrapper>
			</Container>
		</StyledNavBar>
	);
}

export default NavBar;
