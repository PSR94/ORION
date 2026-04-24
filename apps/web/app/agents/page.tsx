"use client";

import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Settings2, 
  Cpu, 
  Activity, 
  Shield, 
  Trash2,
  Copy
} from "lucide-react";

const mockAgents = [
  {
    id: "agent_001",
    name: "Support-Escalator",
    role: "Senior Support Agent",
    version: "1.2.0",
    status: "active",
    tools: 5,
    runs: 1242,
    reliability: "99.8%"
  },
  {
    id: "agent_002",
    name: "Release-Commander",
    role: "DevOps Engineer",
    version: "2.0.1",
    status: "active",
    tools: 8,
    runs: 450,
    reliability: "100%"
  },
  {
    id: "agent_003",
    name: "Incident-Responder",
    role: "SRE Agent",
    version: "1.0.5",
    status: "maintenance",
    tools: 12,
    runs: 89,
    reliability: "96.4%"
  },
  {
    id: "agent_004",
    name: "Metric-Summarizer",
    role: "Data Analyst",
    version: "0.9.0",
    status: "active",
    tools: 3,
    runs: 5621,
    reliability: "99.9%"
  }
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agent Registry</h2>
          <p className="text-muted-foreground mt-1">Manage and govern your enterprise AI agents.</p>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Register Agent
        </button>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-white/10">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search agents by name, role, or ID..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg text-sm hover:bg-white/5 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockAgents.map((agent) => (
          <div key={agent.id} className="glass-panel group p-6 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{agent.name}</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/10 text-muted-foreground">{agent.version}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                  <Copy className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground hover:text-white transition-colors">
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Tools</p>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span className="text-sm font-bold">{agent.tools}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Total Runs</p>
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-purple-400" />
                  <span className="text-sm font-bold">{agent.runs}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Reliability</p>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  <span className="text-sm font-bold">{agent.reliability}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${agent.status === "active" ? "bg-green-500" : "bg-amber-500"}`}></div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{agent.status}</span>
              </div>
              <button className="text-[10px] uppercase font-bold tracking-widest text-red-400 hover:text-red-500 transition-colors flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Decommission
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
