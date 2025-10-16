import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

// Layouts and Common Components
import { PortalLayout } from "./components/common/layout/PortalLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// Sidebars
import { ClientSidebar } from "./components/client/ClientSidebar";
import { EmployeeSidebar } from "./components/employee/EmployeeSidebar";
import { ManagerSidebar } from "./components/manager/ManagerSidebar";

// Client Portal Pages
import ClientDashboard from "./pages/client/Dashboard";
import ClientProjects from "./pages/client/Projects";
import ClientSubmitRequest from "./pages/client/SubmitRequest";
import ClientProfile from "./pages/client/Profile";

// Employee Portal Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeTasks from "./pages/employee/Tasks";
import EmployeeProfile from "./pages/employee/Profile";

// Manager Portal Pages
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerProjects from "./pages/manager/Projects";
import ManagerTeam from "./pages/manager/Team";
import ManagerProfile from "./pages/manager/Profile";
import ProjectDetails from "./pages/manager/ProjectDetails";

// Common Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing/Login Route */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />

            {/* Client Portal Routes */}
            <Route
              path="/client"
              element={
                <ProtectedRoute allowedRole="client">
                  <PortalLayout sidebar={<ClientSidebar />}>
                    <ClientDashboard />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/projects"
              element={
                <ProtectedRoute allowedRole="client">
                  <PortalLayout sidebar={<ClientSidebar />}>
                    <ClientProjects />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/submit"
              element={
                <ProtectedRoute allowedRole="client">
                  <PortalLayout sidebar={<ClientSidebar />}>
                    <ClientSubmitRequest />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ProtectedRoute allowedRole="client">
                  <PortalLayout sidebar={<ClientSidebar />}>
                    <ClientProfile />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />

            {/* Employee Portal Routes */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRole="employee">
                  <PortalLayout sidebar={<EmployeeSidebar />}>
                    <EmployeeDashboard />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/tasks"
              element={
                <ProtectedRoute allowedRole="employee">
                  <PortalLayout sidebar={<EmployeeSidebar />}>
                    <EmployeeTasks />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute allowedRole="employee">
                  <PortalLayout sidebar={<EmployeeSidebar />}>
                    <EmployeeProfile />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />

            {/* Manager Portal Routes */}
            <Route
              path="/manager"
              element={
                <ProtectedRoute allowedRole="manager">
                  <PortalLayout sidebar={<ManagerSidebar />}>
                    <ManagerDashboard />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/projects"
              element={
                <ProtectedRoute allowedRole="manager">
                  <PortalLayout sidebar={<ManagerSidebar />}>
                    <ManagerProjects />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/team"
              element={
                <ProtectedRoute allowedRole="manager">
                  <PortalLayout sidebar={<ManagerSidebar />}>
                    <ManagerTeam />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/profile"
              element={
                <ProtectedRoute allowedRole="manager">
                  <PortalLayout sidebar={<ManagerSidebar />}>
                    <ManagerProfile />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/projects/:projectId"
              element={
                <ProtectedRoute allowedRole="manager">
                  <PortalLayout sidebar={<ManagerSidebar />}>
                    <ProjectDetails />
                  </PortalLayout>
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
