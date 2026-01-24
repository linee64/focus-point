import { useEffect } from 'react';
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
import { supabase } from './services/supabase';

function App() {
  const { 
    hasOnboarded, 
    completeOnboarding, 
    logout, 
    isNotificationsOpen, 
    setNotificationsOpen, 
    isAddTaskOpen, 
    setAddTaskOpen,
    updateStreak,
    updateUser,
    loadData
  } = useStore();

  useEffect(() => {
    // Update streak on app load
    updateStreak();

    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        // Load data from Supabase
        await loadData();
        
        // Sync user metadata if available
        const meta = session.user?.user_metadata;
        
        // Handle both custom metadata and Google/OAuth metadata
        let firstName = meta?.first_name || '';
        let lastName = meta?.last_name || '';

        // If it's a Google login, we might have full_name instead
        if (!firstName && meta?.full_name) {
          const parts = meta.full_name.split(' ');
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        }

        if (firstName || lastName) {
          updateUser(firstName, lastName);
        }
        
        // Only complete onboarding if the store says so (loaded from Supabase)
        if (useStore.getState().hasOnboarded) {
          completeOnboarding();
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        // Load data from Supabase
        await loadData();

        // Sync user metadata if available
        const meta = session.user?.user_metadata;
        
        // Handle both custom metadata and Google/OAuth metadata
        let firstName = meta?.first_name || '';
        let lastName = meta?.last_name || '';

        // If it's a Google login, we might have full_name instead
        if (!firstName && meta?.full_name) {
          const parts = meta.full_name.split(' ');
          firstName = parts[0];
          lastName = parts.slice(1).join(' ');
        }

        if (firstName || lastName) {
          updateUser(firstName, lastName);
        }

        // Only complete onboarding if the store says so (loaded from Supabase)
        if (useStore.getState().hasOnboarded) {
          completeOnboarding();
        }
      } else {
        // If no session, we don't necessarily logout from store 
        // because we might want to keep offline data, but for this app 
        // let's keep it simple: no session = onboarding view
        // logout(); // This might be too aggressive if we want offline support
      }
    });

    return () => subscription.unsubscribe();
  }, [completeOnboarding, logout]);

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
