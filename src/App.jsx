import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

// pages & components
// import Home from './pages/Home';
import Workers from './pages/Workers';
import Warehouses from './pages/Warehouses';
import Vehicles from './pages/Vehicles';
import AddVehicle from './pages/addPages/AddVehicle';
import AddWorker from './pages/addPages/AddWorker';
import AddWarehouse from './pages/addPages/AddWarehouse';
// import SignupPage from './pages/SignupPage';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import ChangeHistoryPage from './pages/ChangeHistoryPage';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import TransactionPage from './pages/TransactionPage';
function App() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <BrowserRouter>
        {user ? <Navbar /> : null}
        <div className="pages">
          <Routes>
            <Route path="/" element={user ? <Workers /> : <Navigate to="/login" />} />
            <Route path="/workers" element={user ? <Workers /> : <Navigate to="/login" />} />
            <Route path="/warehouses" element={user ? <Warehouses /> : <Navigate to="/login" />} />
            <Route path="/vehicles" element={user ? <Vehicles /> : <Navigate to="/login" />} />
            <Route path="/vehicles/add" element={user ? <AddVehicle /> : <Navigate to="/login" />} />
            <Route path="/workers/add" element={user ? <AddWorker /> : <Navigate to="/login" />} />
            <Route path="/warehouses/add" element={user ? <AddWarehouse /> : <Navigate to="/login" />} />
            <Route path="/change-history" element={user && user.role === 'admin' ? <ChangeHistoryPage /> : <Navigate to="/login" />} />
            {/* <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} /> */}
            <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/users" element={user && user.role === 'admin' ? <UsersPage /> : <Navigate to="/" />} />
            <Route path="/profile/:id" element={user && user.role === 'admin' ? <ProfilePage /> : <Navigate to="/login" />} />
            <Route path="/transactions" element={user ? <TransactionPage /> : <Navigate to="/login" />} />
            <Route path="*" element={<div>404</div>} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
