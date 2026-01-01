import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { Schedule } from './pages/Schedule';
import { useStore } from './store/useStore';
import { Review } from './pages/Review';


function App() {
  const { hasOnboarded } = useStore();

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/deadlines" element={<Tasks />} />
        <Route path="/review" element={<Review />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}

export default App
