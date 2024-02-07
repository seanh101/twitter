import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { getUser } from '../../utilities/users-service';
import './App.css';
import AuthPage from '../AuthPage/AuthPage';
import UserProfilePage from '../UserProfilePage/UserProfilePage';
import TimelinePage from '../TimelinePage/TimelinePage';
import NoteCreationPage from '../NoteCreationPage/NoteCreationPage';
import NoteDetail from '../NoteDetail/NoteDetail';
import NavBar from '../../components/NavBar/NavBar';

export default function App() {
  const [user, setUser] = useState(getUser());

  return (
    <main className="App">
      { user ?
          <>
            <NavBar user={user} setUser={setUser} />
            <Routes>
              <Route path="/notes/new" element={<NoteCreationPage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/notes/:noteId" element={<NoteDetail />} />
              <Route path="/users/:userId" element={<UserProfilePage />} />
            </Routes>
          </>
          :
          <AuthPage setUser={setUser} />
      }
    </main>
  );
}
