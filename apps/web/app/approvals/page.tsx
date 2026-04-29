"use client";

import { useEffect, useState } from "react";
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
import api from "../../lib/api";

interface Approval {
  id: string;
  run_id: string;
  trace_id: string;
  requested_action: string;
  context: Record<string, unknown> | null;
  status: string;
  created_at: string;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const response = await api.get('/approvals');
      setApprovals(response.data);
    } catch (error) {
      console.error("Failed to fetch approvals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleDecide = async (id: string, approved: boolean) => {
    try {
      await api.post(`/approvals/${id}/decide?approved=${approved}&approver=human_operator`);
      fetchApprovals(); // Refresh the list
    } catch (error) {
      console.error("Failed to decide approval", error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Approval Inbox</h2>
        <p className="text-muted-foreground mt-1">Human-in-the-loop gates for sensitive agent actions.</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading approvals...</div>
        ) : approvals.map((approval) => {
          // Determine mock risk level based on action for demo visual purposes
          const risk = approval.requested_action.includes("escalate") ? "high" : "critical";
          return (
            <div key={approval.id} className="glass-panel overflow-hidden">
              <div className={`h-1 w-full ${risk === "critical" ? "bg-red-500" : "bg-amber-500"}`}></div>
              <div className="p-6 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${risk === "critical" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"}`}>
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold flex items-center gap-2">
                        {approval.requested_action}
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded border font-bold ${risk === "critical" ? "border-red-500/30 text-red-500" : "border-amber-500/30 text-amber-500"}`}>
                          {risk}
                        </span>
                      </h3>
                      <p className="text-xs text-muted-foreground">Created at <span className="text-white font-medium">{new Date(approval.created_at).toLocaleString()}</span></p>
                    </div>
                  </div>

                  <div className="bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-[11px] overflow-auto">
                    <p className="text-muted-foreground mb-2 flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> REQUEST CONTEXT
                    </p>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(approval.context, null, 2)}</pre>
                  </div>
                </div>

                <div className="w-full md:w-64 flex flex-col justify-between items-end border-l border-white/10 pl-8">
                  <div className="text-right space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Run Reference</p>
                    <Link href={`/runs/${approval.run_id}`} className="text-xs text-primary flex items-center gap-1 justify-end hover:underline">
                      {approval.run_id.substring(0,8)}... <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  <div className="flex gap-3 w-full mt-8 md:mt-0">
                    <button 
                      onClick={() => handleDecide(approval.id, false)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-xs font-bold hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      onClick={() => handleDecide(approval.id, true)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && approvals.length === 0 && (
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
