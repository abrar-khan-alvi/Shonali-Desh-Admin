import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import UserDetails from './pages/UserDetails';
import AddUser from './pages/AddUser';
import AddField from './pages/AddField';
import FieldDetails from './pages/FieldDetails';
import Experts from './pages/Experts';
import ExpertDetails from './pages/ExpertDetails';
import Reports from './pages/Reports';
import IoT from './pages/IoT';
import Financials from './pages/Financials';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/add" element={<AddUser />} />
                <Route path="/users/:userId/add-field" element={<AddField />} />
                <Route path="/users/:userId/fields/:fieldId" element={<FieldDetails />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/experts" element={<Experts />} />
                <Route path="/experts/:id" element={<ExpertDetails />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/iot" element={<IoT />} />
                <Route path="/financials" element={<Financials />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
