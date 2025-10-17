// --- START OF FILE client/src/App.tsx ---
import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

// Layouts and Components
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Login from "@/pages/Login";
import TeacherDashboard from "@/pages/TeacherDashboard";
import CreateExperiment from "@/pages/CreateExperiment";
import ExperimentFlow from "@/pages/participant/ExperimentFlow"; // <-- Import the flow controller

// A simple hook to check authentication status
const useAuth = () => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');
  return { isAuthenticated: !!token, userType };
};

// A protected route component
const ProtectedRoute = ({ component: Component, role, useLayout = true }: { component: React.ComponentType, role: 'teacher' | 'participant', useLayout?: boolean }) => {
  const { isAuthenticated, userType } = useAuth();
  if (!isAuthenticated || userType !== role) {
    return <Redirect to="/" />;
  }
  if (useLayout) {
    return (
      <DashboardLayout>
        <Component />
      </DashboardLayout>
    );
  }
  return <Component />;
};

// Placeholder for Participant Dashboard
const ParticipantDashboard = () => <div>Participant Dashboard</div>;


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-background text-foreground">
        <Switch>
          <Route path="/" component={Login} />
          
          {/* Teacher Routes */}
          <Route path="/teacher/dashboard">
            <ProtectedRoute component={TeacherDashboard} role="teacher" />
          </Route>
          <Route path="/teacher/experiments/new">
             <ProtectedRoute component={CreateExperiment} role="teacher" />
          </Route>

          {/* Participant Routes */}
          <Route path="/participant/dashboard">
            <ProtectedRoute component={ParticipantDashboard} role="participant" />
          </Route>
          
          {/* The Main Experiment Route */}
          <Route path="/experiment">
             <ProtectedRoute component={ExperimentFlow} role="participant" useLayout={false} />
          </Route>
          
          {/* Default 404 route */}
          <Route>404: Not Found!</Route>
        </Switch>
      </main>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App;
// --- END OF FILE client/src/App.tsx ---