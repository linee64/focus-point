import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { AITutor } from './pages/AITutor';
import { Settings } from './pages/Settings';
import { Onboarding } from './pages/Onboarding';
import { useStore } from './store/useStore';

function App() {
  const { hasOnboarded } = useStore();

  if (!hasOnboarded) {
    return <Onboarding />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tutor" element={<AITutor />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  )
}

export default App
