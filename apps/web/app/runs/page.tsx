"use client";

import { useEffect, useState } from "react";
import { 
  Play, 
  Search, 
  Filter, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  PauseCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

const mockRuns = [
  {
    id: "run-9281",
    agent: "Support-Escalator",
    workflow: "Customer Issue Triage",
    status: "completed",
    started_at: "2 mins ago",
    duration: "12.4s",
    risk: "low"
  },
  {
    id: "run-9280",
    agent: "Release-Commander",
    workflow: "Canary Deployment Check",
    status: "paused",
    started_at: "15 mins ago",
    duration: "45.1s",
    risk: "high"
  },
  {
    id: "run-9279",
    agent: "Incident-Responder",
    workflow: "DB Connection Alert",
    status: "failed",
    started_at: "1 hour ago",
    duration: "3.2s",
    risk: "medium"
  },
  {
    id: "run-9278",
    agent: "Metric-Summarizer",
    workflow: "Weekly Finance Report",
    status: "completed",
    started_at: "3 hours ago",
    duration: "8.9s",
    risk: "low"
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, color: "text-green-500", label: "Completed" },
  paused: { icon: PauseCircle, color: "text-amber-500", label: "Awaiting Approval" },
  failed: { icon: XCircle, color: "text-red-500", label: "Failed" },
  running: { icon: Clock, color: "text-blue-500", label: "Running" },
};

const riskConfig = {
  low: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  high: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function RunsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Workflow Runs</h2>
          <p className="text-muted-foreground mt-1">Audit and trace every agent execution in the platform.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Play className="w-4 h-4" />
          Run Workflow
        </button>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Filter runs by ID, agent, or status..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="overflow-hidden glass-panel">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 font-semibold">Run ID</th>
              <th className="px-6 py-4 font-semibold">Agent</th>
              <th className="px-6 py-4 font-semibold">Workflow</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Risk</th>
              <th className="px-6 py-4 font-semibold">Started</th>
              <th className="px-6 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {mockRuns.map((run) => {
              const status = statusConfig[run.status as keyof typeof statusConfig];
              return (
                <tr key={run.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs text-primary">{run.id}</td>
                  <td className="px-6 py-4 font-medium">{run.agent}</td>
                  <td className="px-6 py-4 text-muted-foreground">{run.workflow}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <status.icon className={`w-4 h-4 ${status.color}`} />
                      <span>{status.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${riskConfig[run.risk as keyof typeof riskConfig]}`}>
                      {run.risk.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{run.started_at}</td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/runs/${run.id}`}
                      className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
