import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NavBar from './components/general/NavBar';
import ProtectedRoute from './tools/ProtectedRoute';
import Layout from './Layouts/Layout';
import { LinearProgress } from '@mui/material';

const SignIn = lazy(() => import('./screens/SignIn'));
const SignUp = lazy(() => import('./screens/SignUp'));
const MyQueues = lazy(() => import('./screens/MyQueues'));
const PersonalData = lazy(() => import('./screens/PersonalData'));
const Services = lazy(() => import('./screens/Services'));
const Queues = lazy(() => import('./screens/Queues'));
const SignOut = lazy(() => import('./screens/SignOut'));
const OrderQueue = lazy(() => import('./screens/OrderQueue'));

function App() {
	return (
		<div className='App'>
			<Router>
				<Routes>
					<Route
						path='/sign-in'
						element={
							<Suspense fallback={<LinearProgress />}>
								<Layout>
									<SignIn />
								</Layout>
							</Suspense>
						}
					/>
					<Route
						path='/sign-up'
						element={
							<Suspense fallback={<LinearProgress />}>
								<Layout>
									<SignUp />
								</Layout>
							</Suspense>
						}
					/>
					<Route
						path='/my-queues'
						element={
							<Suspense fallback={<LinearProgress />}>
								<Layout>
									<MyQueues />
								</Layout>
							</Suspense>
						}
					/>
					<Route
						path='/order-queue/:id'
						element={
							<Suspense fallback={<LinearProgress />}>
								<Layout>
									<OrderQueue />
								</Layout>
							</Suspense>
						}
					/>
					<Route
						path='/'
						element={
							<ProtectedRoute>
								<Suspense fallback={<LinearProgress />}>
									<Layout>
										<PersonalData />
									</Layout>
								</Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/services'
						element={
							<ProtectedRoute>
								<Suspense fallback={<LinearProgress />}>
									<Layout>
										<Services />
									</Layout>
								</Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/queues'
						element={
							<ProtectedRoute>
								<Suspense fallback={<LinearProgress />}>
									<Layout>
										<Queues />
									</Layout>
								</Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/sign-out'
						element={
							<ProtectedRoute>
								<Suspense fallback={<LinearProgress />}>
									<SignOut />
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
