import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data based on your employees.csv
const teamMembers = [
    { id: 2, name: 'Komal Iyer', role: 'Scrum Master', tasks: 5, status: 'Busy' },
    { id: 7, name: 'Ananya Aggarwal', role: 'Frontend Engineer', tasks: 3, status: 'Available' },
    { id: 11, name: 'Rohan Verma', role: 'Frontend Engineer', tasks: 8, status: 'Available' },
    { id: 4, name: 'Nikita Nanda', role: 'Hardware Engineer', tasks: 2, status: 'Available' },
];

export default function ManagerTeam() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-foreground">My Team</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage src={`https://i.pravatar.cc/150?u=${member.id}`} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{member.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <p className="text-sm">Assigned Tasks: {member.tasks}</p>
                <Badge variant={member.status === 'Available' ? 'default' : 'destructive'}>{member.status}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}