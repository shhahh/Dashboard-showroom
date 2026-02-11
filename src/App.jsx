import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

<h1 className="text-5xl font-bold text-red-500 bg-yellow-400">
  TAILWIND TEST
</h1>
// Ye function check karega ki user logged in hai ya nahi
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Token check kar rahe hain
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard ko Protected bana diya */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;