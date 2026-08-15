import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { Layout } from '@/components/layout/Layout';

// Pages
import { Home } from '@/pages/Home';
import { Games } from '@/pages/Games';
import { GameDetail } from '@/pages/GameDetail';
import { Profile } from '@/pages/Profile';
import { LeaderboardPage } from '@/pages/LeaderboardPage';
import { Admin } from '@/pages/Admin';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="games" element={<Games />} />
              <Route path="games/:id" element={<GameDetail />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/:id" element={<Profile />} />
              <Route path="leaderboard" element={<LeaderboardPage />} />
              <Route path="admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </GameProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
