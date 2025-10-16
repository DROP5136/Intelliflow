import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { loadProjects, loadEmployees, loadTasks } from '@/utils/dataParser';
import type { Project, Employee, Task } from '@/types';
import { useUser } from "@/contexts/UserContext";

// A simple component to show while data is loading
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  </div>
);

export default function ManagerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<(Employee & { task_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const { setUserRole } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, employeeData, taskData] = await Promise.all([
          loadProjects(),
          loadEmployees(),
          loadTasks()
        ]);

        setProjects(projectData);

        // Simple logic: Assume manager's team is everyone in the 'Project Management' department (ID 7)
        // In a real app, this would be based on the logged-in user.
        const teamMembers = employeeData.filter(e => e.department_id === 7);
        
        const teamWithTaskCounts = teamMembers.map(member => {
          const task_count = taskData.filter(task => task.assigned_to === member.employee_id).length;
          return { ...member, task_count };
        });

        setTeam(teamWithTaskCounts);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingProjects = projects.filter(p => p.status === 'Pending');
  const activeProjects = projects.filter(p => p.status === 'In Progress');

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your projects, team workload, and pending approvals.
          </p>
        </div>
      </div>

      {/* Pending Approvals - This is now dynamic and linked */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Project Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingProjects.length > 0 ? (
            <div className="space-y-4">
              {pendingProjects.map((project) => (
                <div key={project.project_id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{project.project_title}</h3>
                    <p className="text-sm text-muted-foreground">{project.client_name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={project.status} variant="project" />
                    <div className="flex items-center gap-2">
                      <Link to={`/manager/projects/${project.project_id}`}>
                        <Button variant="outline" size="sm">Review</Button>
                      </Link>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No projects are currently pending approval.</p>
          )}
        </CardContent>
      </Card>

      {/* Active Projects - This is now dynamic */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Projects</CardTitle>
          <Link to="/manager/projects">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.project_id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-1">
                  <h3 className="font-semibold">{project.project_title}</h3>
                  <p className="text-sm text-muted-foreground">{project.client_name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={project.status} variant="project" />
                  <Link to={`/manager/projects/${project.project_id}`}>
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Workload - This is now dynamic */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Team Workload</CardTitle>
          <Link to="/manager/team">
            <Button variant="outline" size="sm">Manage Team</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {team.map((member) => (
              <div key={member.employee_id} className="flex items-center justify-between">
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.task_count} tasks</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

