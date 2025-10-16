import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit3, Mail, Building, Save, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Mock data for the client's profile
const defaultProfile = {
  client_name: "DesignX Ltd",
  contact_person: "Priya Sharma",
  email: "priya.sharma@designx.com",
  avatar_initials: "PS",
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [editForm, setEditForm] = useState(defaultProfile);
  const { toast } = useToast();
  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Client Profile</h1>
        <div className="flex space-x-2">
          {!isEditing ? (
            <Button 
              variant="outline" 
              onClick={() => {
                setEditForm(profile);
                setIsEditing(true);
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Information
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4 border-2 border-primary">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${profile.email}`} />
            <AvatarFallback className="text-3xl">{profile.avatar_initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{profile.contact_person}</CardTitle>
          <CardDescription>{profile.client_name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client_name">Company Name</Label>
                <Input
                  id="client_name"
                  value={editForm.client_name}
                  onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={editForm.contact_person}
                  onChange={(e) => setEditForm({ ...editForm, contact_person: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                <Building className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{profile.client_name}</span>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{profile.email}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
