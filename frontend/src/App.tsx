import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CaseWorkspace from './pages/CaseWorkspace';
import EvidenceAnalysis from './pages/EvidenceAnalysis';
import LegalChat from './pages/LegalChat';
import LawMapper from './pages/LawMapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="case/new" element={<CaseWorkspace />} />
          <Route path="case/:id" element={<CaseWorkspace />} />
          <Route path="evidence" element={<EvidenceAnalysis />} />
          <Route path="chat" element={<LegalChat />} />
          <Route path="mapper" element={<LawMapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
