import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./tools/ProtectedRoute";
import Layout from "./Layouts/Layout";
import { LinearProgress } from "@mui/material";
import { UserContextProvider } from "./context/userContext";
import { DialogContextProvider } from "./context/DialogContext";
import { ClientContextProvider } from "./context/clientContext";

const SignIn = lazy(() => import("./screens/SignIn"));
const SignUp = lazy(() => import("./screens/SignUp"));
const MyQueues = lazy(() => import("./screens/MyQueues"));
const PersonalData = lazy(() => import("./screens/PersonalData"));
const Services = lazy(() => import("./screens/Services"));
const Queues = lazy(() => import("./screens/Queues"));
const SignOut = lazy(() => import("./screens/SignOut"));
const BookQueue = lazy(() => import("./screens/BookQueue"));

function App() {
  return (
    <div className="App">
      <Router>
        <DialogContextProvider>
          <UserContextProvider>
            <ClientContextProvider>
              <Routes>
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
                  path="/my-queues"
                  element={
                    <Suspense fallback={<LinearProgress />}>
                      <Layout>
                        <MyQueues />
                      </Layout>
                    </Suspense>
                  }
                />
                <Route
                  path="/book-queue/:id"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<LinearProgress />}>
                        <Layout>
                          <BookQueue />
                        </Layout>
                      </Suspense>
                    </ProtectedRoute>
                  }
                />
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
