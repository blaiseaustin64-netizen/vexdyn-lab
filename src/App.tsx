import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Entry } from './pages/Entry';
import { Home } from './pages/Home';
import { Practice } from './pages/Practice';
import { Challenge } from './pages/Challenge';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Entry />} />
      <Route element={<Layout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/challenges" element={<Practice />} />
        <Route path="/challenge/:id" element={<Challenge />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
