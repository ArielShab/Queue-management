import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NavBar from './components/general/NavBar';
import ProtectedRoute from './tools/ProtectedRoute';

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
						path='/my-queues'
						element={
							<Suspense fallback={<div>Loading...</div>}>
								<MyQueues />
							</Suspense>
						}
					/>
					<Route
						path='/order-queue/:id'
						element={
							<Suspense fallback={<div>Loading...</div>}>
								<OrderQueue />
							</Suspense>
						}
					/>
					<Route
						path='/'
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
					<Route
						path='/queues'
						element={
							<ProtectedRoute>
								<Suspense fallback={<div>Loading...</div>}>
									<Queues />
								</Suspense>
							</ProtectedRoute>
						}
					/>
					<Route
						path='/sign-out'
						element={
							<ProtectedRoute>
								<Suspense fallback={<div>Loading...</div>}>
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
