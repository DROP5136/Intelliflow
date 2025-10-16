import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from 'lucide-react';
import { getProjectDetails } from '@/utils/dataParser';
import type { Project, Sprint, Employee, TaskWithDetails } from '@/types';

// Combined type for the detailed project data
interface ProjectDetailsData {
  project: Project;
  sprints: Sprint[];
  tasks: TaskWithDetails[];
  teamMembers: Employee[];
}

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const [details, setDetails] = useState<ProjectDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchData = async () => {
      try {
        const projectDetails = await getProjectDetails(Number(projectId));
        setDetails(projectDetails);
      } catch (error) {
        console.error("Failed to load project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (loading) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  if (!details) {
    return <div className="p-8 text-center text-muted-foreground">Project not found.</div>;
  }

  const { project, sprints, tasks, teamMembers } = details;

  return (
    <div className="p-8 space-y-8">
      <Link to="/manager/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to All Projects
      </Link>
      
      {/* Project Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{project.project_title}</CardTitle>
          <CardDescription>Client: {project.client_name}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Badge>{project.framework}</Badge>
          <Badge variant="secondary">{project.status}</Badge>
          <Badge variant="outline">{project.category}</Badge>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sprints and Tasks Column */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold">Sprints & Tasks</h2>
          {sprints.map(sprint => {
            const sprintTasks = tasks.filter(t => t.sprint_id === sprint.sprint_id);
            return (
              <Card key={sprint.sprint_id}>
                <CardHeader>
                  <CardTitle>{sprint.sprint_name}</CardTitle>
                  <Badge variant={sprint.status === 'Completed' ? 'default' : 'secondary'} className="w-fit">{sprint.status}</Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {sprintTasks.map(task => (
                      <li key={task.task_id} className="flex items-center justify-between p-3 rounded-md border">
                        <div>
                          <p className="font-medium">{task.task_name}</p>
                          <p className="text-xs text-muted-foreground">Assigned to: {task.assigned_employee?.name || 'Unassigned'}</p>
                        </div>
                        <Badge variant="outline">{task.status}</Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Members Column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Project Team</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {teamMembers.map(member => (
                <div key={member.employee_id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${member.employee_id}`} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.email}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
