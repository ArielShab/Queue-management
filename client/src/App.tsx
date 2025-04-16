import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LinearProgress } from '@mui/material';
import Layout from './layouts/Layout';
import { DialogContextProvider } from './contexts/DialogContext';
import { UserContextProvider } from './contexts/userContext';
import { ClientContextProvider } from './contexts/clientContext';
import ProtectedRoute from './routes/ProtectedRoute';

const PersonalData = lazy(() => import('./pages/PersonalData'));
const Services = lazy(() => import('./pages/Services'));
const Queues = lazy(() => import('./pages/Queues'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const MyQueues = lazy(() => import('./pages/MyQueues'));
const BookQueue = lazy(() => import('./pages/BookQueue'));
const SignOut = lazy(() => import('./pages/SignOut'));

function App() {
  return (
    <div className="App">
      <Router>
        <DialogContextProvider>
          <UserContextProvider>
            <ClientContextProvider>
              <Routes>
                <Route
                  path="/"
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
                  path="/services"
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
                  path="/queues"
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
                  path="/book-queue/:id"
                  element={
                    <Suspense fallback={<LinearProgress />}>
                      <Layout>
                        <BookQueue />
                      </Layout>
                    </Suspense>
                  }
                />
                <Route
                  path="/my-queues"
                  element={
                    <ProtectedRoute isClient={true}>
                      <Suspense fallback={<LinearProgress />}>
                        <Layout>
                          <MyQueues />
                        </Layout>
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sign-in"
                  element={
                    <Suspense fallback={<LinearProgress />}>
                      <Layout>
                        <SignIn />
                      </Layout>
                    </Suspense>
                  }
                />
                <Route
                  path="/sign-up"
                  element={
                    <Suspense fallback={<LinearProgress />}>
                      <Layout>
                        <SignUp />
                      </Layout>
                    </Suspense>
                  }
                />
                <Route
                  path="/sign-out"
                  element={
                    <Suspense fallback={<LinearProgress />}>
                      <SignOut />
                    </Suspense>
                  }
                />
              </Routes>
            </ClientContextProvider>
          </UserContextProvider>
        </DialogContextProvider>
      </Router>
    </div>
  );
}

export default App;
