import { useState } from "react"
import { LayoutDashboard, FolderKanban, Users, User, Menu, X, LogOut } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/UserContext";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/manager",
    icon: LayoutDashboard,
    description: "Overview & Approvals",
    exact: true
  },
  {
    title: "Projects",
    url: "/manager/projects",
    icon: FolderKanban,
    description: "Project Management",
    exact: true
  },
  {
    title: "My Team",
    url: "/manager/team",
    icon: Users,
    description: "Team Members",
    exact: true
  },
  {
    title: "Profile",
    url: "/manager/profile",
    icon: User,
    description: "Personal Settings",
    exact: true
  },
]

export function ManagerSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate();
  const { setUserRole } = useUser();

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  return (
    <div className={cn(
      "flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out",
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-primary">Manager Portal</h1>}
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu /> : <X />}
        </Button>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.exact}
            className={({ isActive: navIsActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group",
                "hover:bg-accent hover:text-accent-foreground",
                navIsActive
                  ? "bg-primary text-primary-foreground shadow-sm font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className={cn(
              "transition-all",
              collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
            )} />
            {!collapsed && (
              <div className="flex-1">
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs opacity-75">{item.description}</div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left p-3" 
          onClick={handleLogout}
        >
          <LogOut className={cn(
            "transition-all",
            collapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
          )} />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </Button>
      </div>
    </div>
  )
}