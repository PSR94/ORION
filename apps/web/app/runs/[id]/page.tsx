"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  Bot, 
  Wrench, 
  ShieldCheck, 
  AlertTriangle,
  Code,
  ChevronRight,
  Terminal,
  Clock,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "../../../lib/api";

interface Trace {
  id: string;
  step_type: string;
  step_name: string;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | string | null;
  latency_ms: number;
  token_usage: Record<string, unknown> | null;
}

interface RunDetails {
  id: string;
  status: string;
  risk_level: string;
  agent_id: string;
}

export default function TraceViewer() {
  const { id } = useParams();
  const [traces, setTraces] = useState<Trace[]>([]);
  const [run, setRun] = useState<RunDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [runRes, tracesRes] = await Promise.all([
          api.get(`/runs/${id}`),
          api.get(`/runs/${id}/traces`)
        ]);
        setRun(runRes.data);
        setTraces(tracesRes.data);
      } catch (error) {
        console.error("Failed to fetch run details", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading trace data...</div>;
  if (!run) return <div className="p-8 text-center text-red-500">Run not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/runs" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Run Details</h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">{run.id.substring(0,8)}...</span>
            {run.status === "paused" && <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500">• Paused for Approval</span>}
            {run.status === "completed" && <span className="text-[10px] uppercase tracking-widest font-bold text-green-500">• Completed</span>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            {traces.length === 0 ? (
               <div className="p-8 text-center text-muted-foreground border border-white/10 rounded-lg">No traces recorded yet.</div>
            ) : traces.map((trace) => (
              <div key={trace.id} className="glass-panel overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {trace.step_type === "llm" && <Bot className="w-5 h-5 text-purple-500" />}
                    {trace.step_type === "tool" && <Wrench className="w-5 h-5 text-blue-500" />}
                    {trace.step_type === "approval" && <ShieldCheck className="w-5 h-5 text-amber-500" />}
                    <span className="font-bold text-sm uppercase tracking-wide">{trace.step_name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trace.latency_ms}ms</span>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Input</p>
                      <pre className="bg-black/40 p-2 rounded text-[10px] font-mono border border-white/5 overflow-auto max-h-48">
                        {JSON.stringify(trace.input, null, 2)}
                      </pre>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Output</p>
                      <pre className="bg-black/40 p-2 rounded text-[10px] font-mono border border-white/5 overflow-auto max-h-48">
                        {trace.output ? JSON.stringify(trace.output, null, 2) : "// Pending or None"}
                      </pre>
                    </div>
                  </div>

                  {trace.step_type === "approval" && (
                    <div className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg mt-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Human-in-the-Loop Required</p>
                          <p className="text-xs text-muted-foreground mt-1">Check Approval Inbox to decide.</p>
                        </div>
                      </div>
                      <Link href="/approvals" className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold transition-colors">
                        Go to Inbox
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Run Metadata</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-muted-foreground">Agent ID</span>
                <span className="text-xs font-medium">{run.agent_id.substring(0,8)}...</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className="text-xs font-medium uppercase">{run.status}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-amber-500/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Risk Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Detected Risk</span>
                <span className={`font-bold ${run.risk_level === 'critical' ? 'text-red-500' : run.risk_level === 'high' ? 'text-amber-500' : 'text-green-500'}`}>
                  {run.risk_level.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
