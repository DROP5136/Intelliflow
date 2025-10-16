import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit3, Save, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ManagerProfile() {
    const defaultProfile = {
      name: "Neha Saxena",
      role: "Scrum Master",
      email: "neha.saxena@company.com",
      phone: "+91 123 456 7890"
    };

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
      <h1 className="text-3xl font-bold text-foreground">Profile</h1>
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Personal Information</CardTitle>
                {!isEditing ? (
                    <Button 
                        variant="ghost" 
                        onClick={() => {
                            setEditForm(profile);
                            setIsEditing(true);
                        }}
                    >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                    </Button>
                ) : (
                    <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${profile.email}`} />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-semibold">{profile.name}</h2>
                        <p className="text-muted-foreground">{profile.role}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {isEditing ? (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    value={editForm.role}
                                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={profile.email} disabled />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={profile.phone} disabled />
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}