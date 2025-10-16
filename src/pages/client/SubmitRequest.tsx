import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SubmitRequest() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Submit a New Request</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">A form for submitting new project requests will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
