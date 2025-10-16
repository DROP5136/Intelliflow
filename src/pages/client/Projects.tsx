import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Projects() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">My Projects</h1>
      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A detailed list of all your projects will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
