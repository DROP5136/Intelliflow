import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { loadProjects } from '@/utils/dataParser';
import type { Project } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For demonstration, we'll show projects for a specific client.
        // In a real app, this would be determined by the logged-in user.
        const allProjects = await loadProjects();
        const clientProjects = allProjects.filter(p => p.client_name === 'DesignX Ltd');
        setProjects(clientProjects);
      } catch (error) {
        console.error("Failed to load client projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeProjects = projects.filter(p => p.status === 'In Progress');
  const completedProjects = projects.filter(p => p.status === 'Completed');

  if (loading) {
    return (
        <div className="p-8 space-y-8">
            <Skeleton className="h-12 w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, DesignX Ltd</h1>
          <p className="text-muted-foreground">Here's a summary of your projects with us.</p>
        </div>
        <Link to="/client/submit">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Submit New Request
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Projects that are currently in progress.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeProjects.length > 0 ? (
              <div className="space-y-4">
                {activeProjects.map(project => (
                  <div key={project.project_id} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{project.project_title}</h3>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{project.category}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">You have no active projects.</p>
            )}
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Completed Projects</CardTitle>
            <CardDescription>A history of your successfully completed projects.</CardDescription>
          </CardHeader>
          <CardContent>
            {completedProjects.length > 0 ? (
              <div className="space-y-4">
                {completedProjects.map(project => (
                  <div key={project.project_id} className="p-4 rounded-lg border">
                    <h3 className="font-semibold">{project.project_title}</h3>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No projects have been completed yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
