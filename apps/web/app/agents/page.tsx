"use client";

import { useEffect, useState } from "react";
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
  Copy,
  CheckCircle2
} from "lucide-react";
import api from "../../lib/api";

interface Agent {
  id: string;
  name: string;
  role: string;
  version: string;
  status: string;
  tools: number;
  runs: number;
  reliability: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await api.get('/agents');
        // Map backend Agent model to frontend representation
        const fetchedAgents = response.data.map((a: any) => ({
          id: a.id,
          name: a.name,
          role: a.role,
          version: a.version,
          status: "active", // Default status for demo
          tools: 4, // Simulated count
          runs: 120, // Simulated count
          reliability: "99.9%"
        }));
        setAgents(fetchedAgents);
      } catch (error) {
        console.error("Failed to fetch agents", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

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

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Loading agents...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {agents.map((agent) => (
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
      )}
    </div>
  );
}
