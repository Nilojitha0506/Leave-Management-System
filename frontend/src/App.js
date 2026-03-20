import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import LeaveRequests from "./pages/LeaveRequests";
import LeaveApproval from "./pages/LeaveApproval";
import Employees from "./pages/Employees";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/requests" element={<LeaveRequests />} />
          <Route path="/approval" element={<LeaveApproval />} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;