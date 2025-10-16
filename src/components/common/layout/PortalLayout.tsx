import { ReactNode } from 'react';

interface PortalLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

export function PortalLayout({ children, sidebar }: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar - injected based on role */}
      {sidebar}
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
