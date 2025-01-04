import React, { useEffect } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom';
import FloatingShape from './component/FloatingShape'
import Signup from './pages/Signup';
import Login from './pages/Login';
import EmailVerification from './pages/EmailVerification';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Dashboard from './pages/Dashboard';
import LoadingSpinner from './component/LoadingSpinner'
import ForgotPass from './pages/ForgotPass';
import ResetPass from './pages/ResetPass';

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};

// redirected authenticated users to the home
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;
  
  

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
    <FloatingShape color='bg-green-500'size="w-64 h-64" top="-5%" left="10%" delay={0} />
    <FloatingShape color='bg-green-500' size='w-48 h-48' top='70%' left='80%' delay={5}/>
    <FloatingShape color='bg-green-500' size='w-64 h-64' top='40%' left='-10%' delay={2} />
      <Routes>
        <Route path='/' element = {
          <ProtectedRoute>
              <Dashboard/>
          </ProtectedRoute>
          }/>
        <Route path='/signup' element = {
          <RedirectAuthenticatedUser>
            <Signup/>
          </RedirectAuthenticatedUser>
        }/>
        <Route path='/login' element = {
          <RedirectAuthenticatedUser>
            <Login/>
          </RedirectAuthenticatedUser>
          }/>
        <Route path='/verify-email' element = {<EmailVerification/>}/>
        <Route path='/forgot-password' element = {
          <RedirectAuthenticatedUser>
            <ForgotPass/>
          </RedirectAuthenticatedUser>
          }/>
          <Route path='/reset-password/:token' element = {
            <RedirectAuthenticatedUser>
              <ResetPass/>
            </RedirectAuthenticatedUser>
            }/>
              {/* catch all routes */}
				    <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App