import type { 
  Project, 
  Employee, 
  Task, 
  Sprint, 
  Role, 
  Department, 
  TaskWithDetails 
} from '@/types';

/**
 * Generic CSV parser function - handles all CSV file parsing
 * Automatically converts numeric fields and removes BOM characters
 */
async function parseCsv<T>(filePath: string): Promise<T[]> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      console.error(`Failed to fetch ${filePath}: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch ${filePath}`);
    }
    
    const text = await response.text();
    const normalizedText = text.replace(/\r\n/g, '\n');
    const lines = normalizedText.trim().split('\n');
    
    // Remove BOM and parse headers
    const headers = lines[0].split(',').map(h => h.trim().replace(/^\uFEFF/, ''));

    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const entry: any = {};
      
      headers.forEach((header, i) => {
        const value = values[i];
        // Convert numeric fields to numbers
        const numericHeaders = [
          'department_id', 'role_id', 'employee_id', 
          'project_id', 'sprint_id', 'task_id', 'assigned_to'
        ];
        
        if (numericHeaders.includes(header) && !isNaN(Number(value)) && value !== '') {
          entry[header] = Number(value);
        } else {
          entry[header] = value;
        }
      });
      
      return entry as T;
    });
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return [];
  }
}

// ============================================
// Basic Data Loaders - Standardized to /public/*.csv
// ============================================

export const loadProjects = (): Promise<Project[]> => 
  parseCsv<Project>('/Projects.csv');

export const loadEmployees = (): Promise<Employee[]> => 
  parseCsv<Employee>('/employee.csv');

export const loadTasks = (): Promise<Task[]> => 
  parseCsv<Task>('/Tasks.csv');

export const loadSprints = (): Promise<Sprint[]> => 
  parseCsv<Sprint>('/Sprints.csv');

export const loadRoles = (): Promise<Role[]> => 
  parseCsv<Role>('/Roles.csv');

export const loadDepartments = (): Promise<Department[]> => 
  parseCsv<Department>('/Departments.csv');

// ============================================
// Utility Functions
// ============================================

/**
 * Get a single employee by ID
 */
export async function getEmployeeById(id: number): Promise<Employee | null> {
  const employees = await loadEmployees();
  return employees.find(emp => emp.employee_id === id) || null;
}

/**
 * Get a single project by ID
 */
export async function getProjectById(id: number): Promise<Project | null> {
  const projects = await loadProjects();
  return projects.find(proj => proj.project_id === id) || null;
}

// ============================================
// Enhanced Data Functions with Relationships
// ============================================

/**
 * Load tasks with detailed information (unified approach)
 * Includes both object references AND string properties for flexibility
 */
export async function loadTasksWithDetails(): Promise<TaskWithDetails[]> {
  const [tasks, employees, departments, roles, projects, sprints] = await Promise.all([
    loadTasks(),
    loadEmployees(),
    loadDepartments(),
    loadRoles(),
    loadProjects(),
    loadSprints()
  ]);

  return tasks.map(task => {
    const employee = employees.find(emp => emp.employee_id === task.assigned_to);
    const department = departments.find(dept => dept.department_id === task.department_id);
    const role = roles.find(r => r.role_id === task.role_id);
    const sprint = sprints.find(s => s.sprint_id === task.sprint_id);
    const project = projects.find(p => {
      const sprintMatch = sprints.find(s => s.sprint_id === task.sprint_id);
      return sprintMatch && p.project_id === sprintMatch.project_id;
    });

    return {
      ...task,
      // Object reference (Manager's approach)
      assigned_employee: employee || null,
      // String properties (Client/Employee approach)
      employee_name: employee?.name || 'Unknown',
      department_name: department?.department_name || 'Unknown',
      role_name: role?.role_name || 'Unknown',
      project_title: project?.project_title || 'Unknown',
      sprint_name: sprint?.sprint_name || 'Unknown'
    };
  });
}

/**
 * Get all tasks assigned to a specific employee
 */
export async function getTasksForEmployee(employeeId: number): Promise<TaskWithDetails[]> {
  const tasksWithDetails = await loadTasksWithDetails();
  return tasksWithDetails.filter(task => task.assigned_to === employeeId);
}

/**
 * Get all projects for a specific client
 */
export async function getProjectsForClient(clientName: string): Promise<Project[]> {
  const projects = await loadProjects();
  return projects.filter(p => p.client_name === clientName);
}

/**
 * Get comprehensive project details including sprints, tasks, and team
 * (Used by Manager portal)
 */
export async function getProjectDetails(projectId: number) {
  const [projects, sprints, tasks, employees] = await Promise.all([
    loadProjects(),
    loadSprints(),
    loadTasks(),
    loadEmployees()
  ]);

  const project = projects.find(p => p.project_id === projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  // Get all sprints for this project
  const projectSprints = sprints.filter(s => s.project_id === projectId);
  const sprintIds = projectSprints.map(s => s.sprint_id);
  
  // Get all tasks for these sprints
  const projectTasks = tasks.filter(t => sprintIds.includes(t.sprint_id));

  // Create tasks with employee details
  const tasksWithDetails: TaskWithDetails[] = projectTasks.map(task => ({
    ...task,
    assigned_employee: employees.find(e => e.employee_id === task.assigned_to) || null,
  }));

  // Get unique team members
  const teamMemberIds = new Set(projectTasks.map(t => t.assigned_to));
  const teamMembers = employees.filter(e => teamMemberIds.has(e.employee_id));

  return {
    project,
    sprints: projectSprints,
    tasks: tasksWithDetails,
    teamMembers
  };
}

/**
 * Get team members by department (useful for Manager portal)
 */
export async function getTeamByDepartment(departmentId: number): Promise<Employee[]> {
  const employees = await loadEmployees();
  return employees.filter(emp => emp.department_id === departmentId);
}

/**
 * Get task statistics for an employee
 */
export async function getEmployeeTaskStats(employeeId: number) {
  const tasks = await getTasksForEmployee(employeeId);
  
  return {
    total: tasks.length,
    done: tasks.filter(t => t.status === 'Done').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    pending: tasks.filter(t => t.status === 'Pending').length
  };
}

/**
 * Get project statistics
 */
export async function getProjectStats(projectId: number) {
  const details = await getProjectDetails(projectId);
  
  return {
    totalTasks: details.tasks.length,
    completedTasks: details.tasks.filter(t => t.status === 'Done').length,
    inProgressTasks: details.tasks.filter(t => t.status === 'In Progress').length,
    totalSprints: details.sprints.length,
    teamSize: details.teamMembers.length
  };
}
