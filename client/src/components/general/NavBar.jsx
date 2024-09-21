import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { StyledLinksWrapper, StyledNavBar } from '../../styles/NavBarStyles';
import {
	BottomNavigation,
	BottomNavigationAction,
	Container,
	Paper,
	Stack,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { UserContext } from '../../context/userContext';

function NavBar() {
	const [value, setValue] = useState(0);
	const { loggedUser } = useContext(UserContext);

	console.log('loggedUser', loggedUser);

	return loggedUser?.id ? (
		<Paper
			sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
			elevation={3}
		>
			<BottomNavigation
				showLabels
				value={value}
				onChange={(event, newValue) => {
					setValue(newValue);
				}}
			>
				<BottomNavigationAction
					label='Recents'
					icon={<FavoriteIcon />}
				/>
				<BottomNavigationAction
					label='Favorites'
					icon={<FavoriteIcon />}
				/>
				<BottomNavigationAction
					label='Archive'
					icon={<FavoriteIcon />}
				/>
			</BottomNavigation>
		</Paper>
	) : (
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
