import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KanbanPage from "./pages/KanbanPage";
import LeadFormPage from "./pages/LeadFormPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<KanbanPage />} />
        <Route path="/lead/:id" element={<LeadFormPage />} />
        <Route path="/add" element={<LeadFormPage />} />
      </Routes>
    </Router>
  );
}

export default App;
