// --- START OF FILE client/src/pages/Login.tsx ---
import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FlaskConical } from "lucide-react";

// Define the shape of the response from our login API
interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'participant' | 'teacher';
  };
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast(); // <-- Get the toast function
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState<'participant' | 'teacher'>('participant');

  // --- API Mutations with TanStack Query ---
  const authMutation = useMutation({
    mutationFn: (variables: { endpoint: string; body: any }) =>
      apiRequest<AuthResponse>(variables.endpoint, { method: 'POST', body: variables.body }),
    onSuccess: (data: AuthResponse) => {
      toast({ title: "Login Successful", description: `Welcome back, ${data.user.username}!` });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', data.user.role);
      setLocation(data.user.role === 'teacher' ? '/teacher/dashboard' : '/participant/dashboard');
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Login Failed", description: error.message });
    }
  });

  const registerMutation = useMutation({
    mutationFn: (variables: { endpoint: string; body: any }) =>
      apiRequest(variables.endpoint, { method: 'POST', body: variables.body }),
    onSuccess: () => {
      toast({ title: "Registration Successful", description: "Please log in with your new credentials." });
      setActiveTab("login");
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Registration Failed", description: error.message });
    }
  });


  // --- Event Handlers ---
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    if (activeTab === 'login') {
      authMutation.mutate({ endpoint: '/api/auth/login', body: data });
    } else {
      registerMutation.mutate({ endpoint: '/api/auth/register', body: { ...data, role: userType } });
    }
  };

  const isLoading = authMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Cognitive Learning Platform</h1>
          <p className="text-muted-foreground">Research on Learning and Retention</p>
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant={userType === 'participant' ? 'default' : 'outline'}
            onClick={() => setUserType('participant')}
            data-testid="button-select-participant"
            className="gap-2"
          >
            <User className="h-4 w-4" />
            Participant
          </Button>
          <Button
            variant={userType === 'teacher' ? 'default' : 'outline'}
            onClick={() => setUserType('teacher')}
            data-testid="button-select-teacher"
            className="gap-2"
          >
            <FlaskConical className="h-4 w-4" />
            Teacher/Researcher
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{userType === 'teacher' ? "Researcher Portal" : "Participant Portal"}</CardTitle>
            <CardDescription>
              {userType === 'teacher'
                ? "Manage experiments and analyze results."
                : "Participate in cognitive learning studies."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-username">Username or Email</Label>
                    <Input id="login-username" name="username" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input id="login-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Log In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username">Username</Label>
                    <Input id="register-username" name="username" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input id="register-email" name="email" type="email" required disabled={isLoading} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input id="register-password" name="password" type="password" required disabled={isLoading} />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
// --- END OF FILE client/src/pages/Login.tsx ---