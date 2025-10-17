// --- START OF FILE client/src/components/layout/DashboardLayout.tsx ---
import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, FlaskConical, BarChart3, LogOut, User } from 'lucide-react';

const navItems = {
  teacher: [
    { href: "/teacher/dashboard", label: "Dashboard", icon: Home },
    { href: "/teacher/experiments", label: "Experiments", icon: FlaskConical },
    { href: "/teacher/analytics", label: "Analytics", icon: BarChart3 },
  ],
  participant: [
    { href: "/participant/dashboard", label: "Dashboard", icon: Home },
    { href: "/participant/progress", label: "My Progress", icon: User },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const userType = localStorage.getItem('userType') as 'teacher' | 'participant';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setLocation('/');
  };

  const currentNavItems = navItems[userType] || [];

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-4 px-4 sm:py-5">
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg mb-4">
            <FlaskConical className="h-6 w-6" />
            <span>CognitiveLearn</span>
          </Link>
          {currentNavItems.map(item => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
// --- END OF FILE client/src/components/layout/DashboardLayout.tsx ---