import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import Breathing from './pages/Breathing';
import Books from './pages/Books';
import Profile from './pages/Profile';
import GameLibrary from './pages/GameLibrary'; // <--- Ensure you import the menu page
import Sudoku from './components/games/Sudoku';
import FlappyBird from './components/games/FlappyBird';
// Game Components

import MemoryMatch from './components/games/MemoryMatch';


// Components
import AppLayout from './components/AppLayout';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  return !user ? children : <Navigate to="/app/chat" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected App Routes (Prefix: /app) */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

            {/* Chat Routes */}
            <Route path="chat" element={<Chat />} />
            <Route path="chat/:chatId" element={<Chat />} />

            {/* Game Menu (Library) */}
            <Route path="games" element={<GameLibrary />} />

            {/* Specific Game Routes */}

            <Route path="game/memory-match" element={<MemoryMatch />} />


            {/* NEW ROUTES */}


            <Route path="game/sudoku" element={<Sudoku />} />
            <Route path="game/flappy-bird" element={<FlappyBird />} />
            {/* Other Features */}
            <Route path="breathing" element={<Breathing />} />
            <Route path="books" element={<Books />} />
            <Route path="profile" element={<Profile />} />

            {/* Default redirect to chat */}
            <Route index element={<Navigate to="chat" />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;