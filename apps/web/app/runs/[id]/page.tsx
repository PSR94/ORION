"use client";

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

const mockTraces = [
  {
    type: "llm",
    name: "Intent Analysis",
    content: "The user is reporting a recurring billing error. I should investigate the payment history and then escalate to a human supervisor for a refund authorization.",
    thought: "Analyzing sentiment... Frustration detected. High priority workflow triggered.",
    latency: "842ms",
    tokens: 452
  },
  {
    type: "tool",
    name: "query_billing_history",
    input: { customer_id: "cust_8821", limit: 5 },
    output: { status: "success", records: [ { id: "inv_1", amount: "$99.00", date: "2024-03-01" } ] },
    latency: "321ms"
  },
  {
    type: "approval",
    name: "escalate_to_human",
    context: { reason: "Billing discrepancy detected, user requested supervisor.", priority: "high" },
    status: "pending",
    latency: "N/A"
  }
];

export default function TraceViewer() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/runs" className="p-2 rounded-lg hover:bg-white/5 text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Run Details</h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className="font-mono text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10">{id}</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-500">• Paused for Approval</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            {mockTraces.map((trace, index) => (
              <div key={index} className="glass-panel overflow-hidden">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {trace.type === "llm" && <Bot className="w-5 h-5 text-purple-500" />}
                    {trace.type === "tool" && <Wrench className="w-5 h-5 text-blue-500" />}
                    {trace.type === "approval" && <ShieldCheck className="w-5 h-5 text-amber-500" />}
                    <span className="font-bold text-sm uppercase tracking-wide">{trace.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {trace.latency}</span>
                    {trace.tokens && <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {trace.tokens} tokens</span>}
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {trace.type === "llm" && (
                    <>
                      <div className="bg-purple-500/5 border border-purple-500/10 rounded p-3">
                        <p className="text-[10px] text-purple-400 font-bold uppercase tracking-tighter mb-1 flex items-center gap-1">
                          <Terminal className="w-3 h-3" /> Chain of Thought
                        </p>
                        <p className="text-sm italic text-muted-foreground">{trace.thought}</p>
                      </div>
                      <p className="text-sm text-foreground">{trace.content}</p>
                    </>
                  )}

                  {trace.type === "tool" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Input</p>
                        <pre className="bg-black/40 p-2 rounded text-[10px] font-mono border border-white/5">
                          {JSON.stringify(trace.input, null, 2)}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Output</p>
                        <pre className="bg-black/40 p-2 rounded text-[10px] font-mono border border-white/5">
                          {JSON.stringify(trace.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  {trace.type === "approval" && (
                    <div className="flex items-center justify-between p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                          <AlertTriangle className="w-5 h-5 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Human-in-the-Loop Required</p>
                          <p className="text-xs text-muted-foreground mt-1">This tool has been flagged for sensitive data access.</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors">
                          Reject
                        </button>
                        <button className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg text-xs font-bold transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                          Approve
                        </button>
                      </div>
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
                <span className="text-xs text-muted-foreground">Agent</span>
                <span className="text-xs font-medium">Support-Escalator (v1.0.2)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-muted-foreground">Workflow</span>
                <span className="text-xs font-medium">Triage & Escalation</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-muted-foreground">Provider</span>
                <span className="text-xs font-medium flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  Mock-GPT4
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-xs text-muted-foreground">Cost Estim.</span>
                <span className="text-xs font-medium text-green-400">$0.0012</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 border-amber-500/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Risk Analysis
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Tool Risk</span>
                <span className="text-amber-500 font-bold">Medium</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Data Privacy</span>
                <span className="text-red-500 font-bold">High</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Compliance</span>
                <span className="text-green-500 font-bold">Passed</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-muted-foreground leading-relaxed">
              Execution contains a call to 'query_billing_history' which involves PII. Ensure data masking is active.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
