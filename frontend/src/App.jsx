import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Explore from './pages/Explore';
import Notifications from './pages/Notifications';
import CreateRequest from './pages/CreateRequest';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import RequestDetailPage from './pages/RequestDetailPage';
import AiCenterPage from './pages/AiCenterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import MessagesPage from './pages/MessagesPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<MainLayout><AuthPage /></MainLayout>} />
          <Route path="/onboarding" element={<MainLayout><OnboardingPage /></MainLayout>} />
          <Route path="/dashboard" element={<MainLayout><DashboardPage /></MainLayout>} />
          <Route path="/explore" element={<MainLayout><Explore /></MainLayout>} />
          <Route path="/leaderboard" element={<MainLayout><Leaderboard /></MainLayout>} />
          <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
          <Route path="/create-request" element={<MainLayout><CreateRequest /></MainLayout>} />
          <Route path="/request/:id" element={<MainLayout><RequestDetailPage /></MainLayout>} />
          <Route path="/messages" element={<MainLayout><MessagesPage /></MainLayout>} />
          <Route path="/ai-center" element={<MainLayout><AiCenterPage /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/admin" element={<MainLayout><AdminDashboard /></MainLayout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;