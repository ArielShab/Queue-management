import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NavBar from './components/general/NavBar';

const SignIn = lazy(() => import('./screens/SignIn'));
const SignUp = lazy(() => import('./screens/SignUp'));

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
				</Routes>
			</Router>
		</div>
	);
}

export default App;
