import {
	Route,
	Routes,
	BrowserRouter as Router,
	Outlet,
	Navigate,
} from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NavBar from './components/general/NavBar';
import ProtectedRoute from './tools/ProtectedRoute';
// import { PrivateRoute, AnonymousRoute } from './tools/RoutesHelpers';

const SignIn = lazy(() => import('./screens/SignIn'));
const SignUp = lazy(() => import('./screens/SignUp'));
const PersonalData = lazy(() => import('./screens/PersonalData'));
const Services = lazy(() => import('./screens/Services'));

function App() {
	return (
		<div className='App'>
			<Router>
				<NavBar />

				<Routes>
					<Route
						path='/sign-in'
						element={
							<Suspense fallback={<div>Loading...</div>}>
								<SignIn />
							</Suspense>
						}
					/>
					<Route
						path='/sign-up'
						element={
							<Suspense fallback={<div>Loading...</div>}>
								<SignUp />
							</Suspense>
						}
					/>
					<Route
						path='/personal-data'
						element={
							<ProtectedRoute>
								<Suspense fallback={<div>Loading...</div>}>
									<PersonalData />
								</Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/services'
						element={
							<ProtectedRoute>
								<Suspense fallback={<div>Loading...</div>}>
									<Services />
								</Suspense>
							</ProtectedRoute>
						}
					/>
				</Routes>
			</Router>
		</div>
	);
}

export default App;
