import {HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorTest from './components/ErrorTest';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import DashboardPage from './components/DashboardPage';
import UploadPage from './components/UploadPage';
import DatasetDetailPage from './components/DatasetDetailPage';
import VisualizePage from './components/VisualizePage';
import AdminPage from './components/AdminPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="*" element={<Navigate to="/login" replace />} />
              <Route path="/main" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/errortest" element={<ErrorTest />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/datasets/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
              <Route path="/datasets/:id" element={<ProtectedRoute><DatasetDetailPage /></ProtectedRoute>} />
              <Route path="/datasets/:id/visualize" element={<ProtectedRoute><VisualizePage /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
            </Routes>
          </AuthProvider>
        </Router>
        <ToastContainer position="top-center" autoClose={2000} />
      </ErrorBoundary>
    </>
  );
}

export default App;