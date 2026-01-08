import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { Schedule } from './pages/Schedule';
import { useStore } from './store/useStore';
import { Review } from './pages/Review';
import { Profile } from './pages/Profile';
import { AIChat } from './pages/AIChat';
import { Notifications } from './components/Notifications';
import { AddTaskModal } from './components/AddTaskModal';
import { useEffect } from 'react';


function App() {
  const { hasOnboarded, isNotificationsOpen, setNotificationsOpen, isAddTaskOpen, setAddTaskOpen } = useStore();

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/deadlines" element={<Tasks />} />
          <Route path="/review" element={<Review />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>

      {/* Global Modals */}
      <Notifications isOpen={isNotificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <AddTaskModal isOpen={isAddTaskOpen} onClose={() => setAddTaskOpen(false)} />
    </>
  );
}

export default App
