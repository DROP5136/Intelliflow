import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

// Layouts
import { PortalLayout } from "./components/common/layout/PortalLayout";
import { ManagerLayout } from "./components/manager/ManagerLayout";

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
                <PortalLayout sidebar={<ClientSidebar />}>
                  <ClientDashboard />
                </PortalLayout>
              }
            />
            <Route
              path="/client/projects"
              element={
                <PortalLayout sidebar={<ClientSidebar />}>
                  <ClientProjects />
                </PortalLayout>
              }
            />
            <Route
              path="/client/submit"
              element={
                <PortalLayout sidebar={<ClientSidebar />}>
                  <ClientSubmitRequest />
                </PortalLayout>
              }
            />
            <Route
              path="/client/profile"
              element={
                <PortalLayout sidebar={<ClientSidebar />}>
                  <ClientProfile />
                </PortalLayout>
              }
            />

            {/* Employee Portal Routes */}
            <Route
              path="/employee"
              element={
                <PortalLayout sidebar={<EmployeeSidebar />}>
                  <EmployeeDashboard />
                </PortalLayout>
              }
            />
            <Route
              path="/employee/tasks"
              element={
                <PortalLayout sidebar={<EmployeeSidebar />}>
                  <EmployeeTasks />
                </PortalLayout>
              }
            />
            <Route
              path="/employee/profile"
              element={
                <PortalLayout sidebar={<EmployeeSidebar />}>
                  <EmployeeProfile />
                </PortalLayout>
              }
            />

            {/* Manager Portal Routes */}
            <Route
              path="/manager"
              element={
                <ManagerLayout>
                  <ManagerDashboard />
                </ManagerLayout>
              }
            />
            <Route
              path="/manager/projects"
              element={
                <ManagerLayout>
                  <ManagerProjects />
                </ManagerLayout>
              }
            />
            <Route
              path="/manager/team"
              element={
                <ManagerLayout>
                  <ManagerTeam />
                </ManagerLayout>
              }
            />
            <Route
              path="/manager/profile"
              element={
                <ManagerLayout>
                  <ManagerProfile />
                </ManagerLayout>
              }
            />
            <Route
              path="/manager/projects/:projectId"
              element={
                <ManagerLayout>
                  <ProjectDetails />
                </ManagerLayout>
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
