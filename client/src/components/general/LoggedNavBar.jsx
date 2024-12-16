import {
	BottomNavigation,
	BottomNavigationAction,
	Container,
	Paper,
} from '@mui/material';
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import ServicesIcon from '@mui/icons-material/Settings';
import QueueIcon from '@mui/icons-material/ListAlt';
import { StyledLinksWrapper, StyledNavBar } from '../../styles/NavBarStyles';

function LoggedNavBar() {
	const [value, setValue] = useState(0);
	const navigate = useNavigate();

	return (
		<>
			<StyledNavBar>
				<Container>
					<StyledLinksWrapper>
						<NavLink to='/sign-out'>Sign Out</NavLink>
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
		</>
	);
}

export default LoggedNavBar;
