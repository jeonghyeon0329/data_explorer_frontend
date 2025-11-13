import { HashRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorTest from './components/ErrorTest';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="*" element={<Navigate to="/main" replace />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/errortest" element={<ErrorTest />} />
          </Routes>
        </Router>
        <ToastContainer position="top-center" autoClose={2000} />
      </ErrorBoundary>
    </>
  );
}

export default App;