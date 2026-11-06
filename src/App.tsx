import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { SongPage } from './pages/SongPage';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs/:slug" element={<SongPage />} />
      </Routes>
    </>
  );
}
