"use client";

import { 
  ShieldCheck, 
  AlertTriangle, 
  User, 
  Clock, 
  Check, 
  X,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const mockApprovals = [
  {
    id: "appr_991",
    run_id: "run-9280",
    agent: "Release-Commander",
    tool: "trigger_production_deploy",
    requested_by: "system",
    time: "4 mins ago",
    context: { service: "auth-api", cluster: "prod-us-east-1", version: "v2.4.1" },
    risk: "critical"
  },
  {
    id: "appr_992",
    run_id: "run-9281",
    agent: "Support-Escalator",
    tool: "escalate_to_human",
    requested_by: "system",
    time: "12 mins ago",
    context: { reason: "Customer requested refund above threshold ($500)", priority: "high" },
    risk: "high"
  }
];

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Approval Inbox</h2>
        <p className="text-muted-foreground mt-1">Human-in-the-loop gates for sensitive agent actions.</p>
      </div>

      <div className="space-y-4">
        {mockApprovals.map((approval) => (
          <div key={approval.id} className="glass-panel overflow-hidden">
            <div className={`h-1 w-full ${approval.risk === "critical" ? "bg-red-500" : "bg-amber-500"}`}></div>
            <div className="p-6 flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${approval.risk === "critical" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      {approval.tool}
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded border font-bold ${approval.risk === "critical" ? "border-red-500/30 text-red-500" : "border-amber-500/30 text-amber-500"}`}>
                        {approval.risk}
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground">Requested by <span className="text-white font-medium">{approval.agent}</span> • {approval.time}</p>
                  </div>
                </div>

                <div className="bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-[11px]">
                  <p className="text-muted-foreground mb-2 flex items-center gap-2">
                    <MessageSquare className="w-3 h-3" /> REQUEST CONTEXT
                  </p>
                  {JSON.stringify(approval.context, null, 2)}
                </div>
              </div>

              <div className="w-full md:w-64 flex flex-col justify-between items-end border-l border-white/10 pl-8">
                <div className="text-right space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Run Reference</p>
                  <Link href={`/runs/${approval.run_id}`} className="text-xs text-primary flex items-center gap-1 justify-end hover:underline">
                    {approval.run_id} <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="flex gap-3 w-full mt-8 md:mt-0">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                    <Check className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {mockApprovals.length === 0 && (
          <div className="py-20 text-center">
            <ShieldCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No pending approvals</h3>
            <p className="text-sm text-muted-foreground/60 mt-1">All agent actions are currently governed or compliant.</p>
          </div>
        )}
      </div>
    </div>
  );
}
