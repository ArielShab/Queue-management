import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { StyledLinksWrapper, StyledNavBar } from '../../styles/NavBarStyles';
import {
	BottomNavigation,
	BottomNavigationAction,
	Container,
	Paper,
} from '@mui/material';
import { UserContext } from '../../context/userContext';
import PersonIcon from '@mui/icons-material/Person';
import ServicesIcon from '@mui/icons-material/Settings';
import QueueIcon from '@mui/icons-material/ListAlt';

function NavBar() {
	const [value, setValue] = useState(0);
	const { loggedUser } = useContext(UserContext);
	const navigate = useNavigate();

	return (
		<>
			<StyledNavBar>
				<Container>
					<StyledLinksWrapper>
						{loggedUser?.id ? (
							<NavLink to='sign-out'>Sign Out</NavLink>
						) : (
							<>
								<NavLink
									to='my-queues'
									style={{ marginInlineEnd: 'auto' }}
								>
									<PersonIcon />
								</NavLink>
								<NavLink to='sign-in'>Sign In</NavLink>
								<NavLink to='sign-up'>Sign Up</NavLink>
							</>
						)}
					</StyledLinksWrapper>
				</Container>
			</StyledNavBar>
			{loggedUser?.id && (
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
						onChange={(event, newValue) => {
							setValue(newValue);
						}}
					>
						<BottomNavigationAction
							label='Person Data'
							icon={<PersonIcon />}
							onClick={() => navigate('/')}
						/>
						<BottomNavigationAction
							label='Services'
							icon={<ServicesIcon />}
							onClick={() => navigate('/services')}
						/>
						<BottomNavigationAction
							label='Queues'
							icon={<QueueIcon />}
							onClick={() => navigate('/queues')}
						/>
					</BottomNavigation>
				</Paper>
			)}
		</>
	);
}

export default NavBar;
