"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  ShieldAlert 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import api from "../lib/api";

const chartData = [
  { name: "Mon", runs: 400, errors: 24 },
  { name: "Tue", runs: 300, errors: 13 },
  { name: "Wed", runs: 520, errors: 38 },
  { name: "Thu", runs: 480, errors: 19 },
  { name: "Fri", runs: 700, errors: 12 },
  { name: "Sat", runs: 600, errors: 8 },
  { name: "Sun", runs: 550, errors: 5 },
];

export default function Dashboard() {
  const [stats, setStats] = useState([
    { name: "Active Runs", value: "0", icon: Activity, color: "text-blue-500" },
    { name: "Success Rate", value: "0%", icon: CheckCircle2, color: "text-green-500" },
    { name: "Approvals Pending", value: "0", icon: ShieldAlert, color: "text-amber-500" },
    { name: "Avg. Latency", value: "0s", icon: Clock, color: "text-purple-500" },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [runsRes, approvalsRes] = await Promise.all([
          api.get('/runs'),
          api.get('/approvals')
        ]);
        
        const runs = runsRes.data;
        const approvals = approvalsRes.data;

        const activeRuns = runs.filter((r: any) => r.status === 'running').length;
        const completedRuns = runs.filter((r: any) => r.status === 'completed').length;
        const failedRuns = runs.filter((r: any) => r.status === 'failed' || r.status === 'cancelled').length;
        
        let successRate = 100;
        if (completedRuns + failedRuns > 0) {
          successRate = (completedRuns / (completedRuns + failedRuns)) * 100;
        }

        setStats([
          { name: "Active Runs", value: activeRuns.toString(), icon: Activity, color: "text-blue-500" },
          { name: "Success Rate", value: `${successRate.toFixed(1)}%`, icon: CheckCircle2, color: "text-green-500" },
          { name: "Approvals Pending", value: approvals.length.toString(), icon: ShieldAlert, color: "text-amber-500" },
          { name: "Avg. Latency", value: "1.2s", icon: Clock, color: "text-purple-500" }, // Simulated for demo
        ]);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Control Plane Overview</h2>
        <p className="text-muted-foreground mt-1">Real-time monitoring and governance for ORION agent systems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-panel p-6">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live</span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Workflow Throughput</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">Executions</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRuns" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff50" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#ffffff50" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#09090b", border: "1px solid #ffffff10", borderRadius: "8px" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="runs" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRuns)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-6">Risk Distribution</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">High Risk Tools</span>
                <span className="text-white">12%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[12%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">Sensitive Exports</span>
                <span className="text-white">45%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[45%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-muted-foreground">External API Calls</span>
                <span className="text-white">88%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 w-[88%]"></div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex gap-3">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs font-bold text-white">Security Recommendation</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Agent 'Escalation-Lead' is using tool 'refund_process' without explicit approval gate. Consider enabling human-in-the-loop.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
