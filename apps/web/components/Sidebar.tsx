"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  PlayCircle, 
  ShieldCheck, 
  Wrench, 
  History, 
  AlertTriangle,
  FileText,
  Settings,
  Activity
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Agent Registry", href: "/agents", icon: Users },
  { name: "Workflows", href: "/workflows", icon: PlayCircle },
  { name: "Workflow Runs", href: "/runs", icon: History },
  { name: "Approval Inbox", href: "/approvals", icon: ShieldCheck },
  { name: "Tool Registry", href: "/tools", icon: Wrench },
  { name: "Risk Dashboard", href: "/risk", icon: AlertTriangle },
  { name: "Audit Log", href: "/audit", icon: FileText },
  { name: "Provider Status", href: "/status", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-white/10 bg-black/20 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white text-xs font-bold">O</span>
          </div>
          ORION
        </h1>
        <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase">AgentOps Control Plane</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </div>
  );
}
