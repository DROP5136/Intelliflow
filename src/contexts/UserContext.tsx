import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getEmployeeById } from '@/utils/dataParser';
import type { Employee, UserRole } from '@/types';

// Function to get the last used role from localStorage
const getLastUsedRole = (): UserRole | null => {
  const lastRole = localStorage.getItem('lastUserRole');
  return lastRole as UserRole | null;
};

// For development/demo purposes
const CURRENT_EMPLOYEE_ID = 1;

// Fallback data for development
const fallbackEmployee: Employee = {
  employee_id: 1,
  name: "Neha Saxena (Sample)",
  email: "neha.saxena.sample@example.com",
  department_id: 1,
  role_id: 1,
  availability: 'Available',
};

interface UserContextType {
  employee: Employee | null;
  userRole: UserRole | null;
  loading: boolean;
  updateEmployee: (updatedInfo: Partial<Employee>) => void;
  setUserRole: (role: UserRole | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(() => getLastUsedRole());
  const [loading, setLoading] = useState(true);

  // Save role to localStorage whenever it changes
  useEffect(() => {
    if (userRole) {
      localStorage.setItem('lastUserRole', userRole);
    }
  }, [userRole]);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        console.log("Current user role:", userRole); // Debug log
        
        // If no role is set (logged out), clear employee data
        if (!userRole) {
          console.log("No user role set, clearing employee data"); // Debug log
          setEmployee(null);
          setLoading(false);
          return;
        }
        
        // For employee and manager roles, fetch employee data
        if (userRole === 'employee' || userRole === 'manager') {
          console.log("Fetching employee data..."); // Debug log
          
          // Using ID 1 for now - you can change this to any valid employee ID from your CSV
          const employeeId = 1;
          
          try {
            let emp = await getEmployeeById(employeeId);
            console.log("Fetched employee data:", emp);

            if (!emp) {
              console.log("No employee found, using fallback data");
              emp = fallbackEmployee;
            }
            
            setEmployee(emp);
          } catch (error) {
            console.error("Error fetching employee:", error);
            setEmployee(fallbackEmployee);
          }
        } else if (userRole === 'client') {
          console.log("Client role detected, no employee data needed"); // Debug log
          // For clients, we might not have employee data
          // Could load client-specific data here if needed
          setEmployee(null);
        }

      } catch (error) {
        console.error("Failed to fetch user data:", error);
        console.warn("Using fallback data due to an error.");
        setEmployee(fallbackEmployee);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userRole]); // Re-fetch when role changes

  const updateEmployee = (updatedInfo: Partial<Employee>) => {
    if (employee) {
      setEmployee(prevEmployee => ({ ...prevEmployee!, ...updatedInfo }));
    }
  };

  return (
    <UserContext.Provider value={{ employee, userRole, loading, updateEmployee, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
