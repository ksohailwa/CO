// --- START OF FILE client/src/pages/TeacherDashboard.tsx ---
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/api";
import { IExperiment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";

function ExperimentList() {
  const { data: experiments, isLoading, error } = useQuery<IExperiment[]>({
    queryKey: ['experiments'],
    queryFn: () => apiRequest('/api/experiments'),
  });

  if (isLoading) return <p>Loading experiments...</p>;
  if (error) return <p className="text-destructive">Error: {(error as Error).message}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Experiments</CardTitle>
        <CardDescription>Manage your research studies here.</CardDescription>
      </CardHeader>
      <CardContent>
        {experiments && experiments.length > 0 ? (
          <div className="space-y-4">
            {experiments.map(exp => (
              <div key={exp._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">{exp.title}</h4>
                  <p className="text-sm text-muted-foreground">{exp.targetWords.length} target words</p>
                </div>
                <Button variant="outline" size="sm">Manage</Button>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't created any experiments yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function TeacherDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Researcher Dashboard</h1>
          <p className="text-muted-foreground">Oversee your studies and analyze data.</p>
        </div>
        <Button onClick={() => setLocation('/teacher/experiments/new')} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Experiment
        </Button>
      </div>
      <ExperimentList />
    </div>
  );
}
// --- END OF FILE client/src/pages/TeacherDashboard.tsx ---