import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import type { UserRole } from '@/types';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(() => {
    // Get the last used role from localStorage, default to 'employee' if none exists
    return (localStorage.getItem('lastUserRole') as UserRole) || 'employee';
  });
  const { setUserRole } = useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    setUserRole(selectedRole);
    
    // Navigate to appropriate portal based on role
    switch (selectedRole) {
      case 'client':
        navigate('/client');
        break;
      case 'employee':
        navigate('/employee');
        break;
      case 'manager':
        navigate('/manager');
        break;
      default:
        navigate('/employee');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">Intelliflow Portal</CardTitle>
          <CardDescription>
            Select your role to access your portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role-select" className="text-sm font-medium">
              Login As
            </label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
              <SelectTrigger id="role-select">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleLogin} className="w-full" size="lg">
            Enter Portal
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Demo Mode - No authentication required</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
