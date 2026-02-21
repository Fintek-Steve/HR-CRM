"use client";

import { Users, Briefcase, Calendar, DollarSign, ChevronRight, TrendingUp } from "lucide-react";
import { Avatar } from "@/components/ui/shared";
import { colors } from "@/lib/data";

const stats = [
  { icon: Users, label: "Total Employees", value: "247", change: "+12", color: "#2D5BFF" },
  { icon: Briefcase, label: "Open Positions", value: "18", change: "+3", color: "#7C3AED" },
  { icon: Calendar, label: "Pending Leaves", value: "3", change: "", color: "#D97706" },
  { icon: DollarSign, label: "Monthly Payroll", value: "$1.2M", change: "+4.2%", color: "#0D9F6E" },
];

const leaves = [
  { id: 1, emp: "James O'Brien", type: "Annual Leave", from: "Feb 24", to: "Feb 28", days: 5 },
  { id: 2, emp: "Elena Rodriguez", type: "Sick Leave", from: "Feb 21", to: "Feb 21", days: 1 },
  { id: 3, emp: "Kai Nakamura", type: "Personal", from: "Mar 3", to: "Mar 4", days: 2 },
];

export default function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div
            key={i}
            className="animate-fade-slide-up"
            style={{
              background: colors.surface, borderRadius: 16, padding: 24,
              border: `1px solid ${colors.border}`,
              animationDelay: `${0.05 * (i + 1)}s`,
              cursor: "default", transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <s.icon size={22} color={s.color} strokeWidth={1.8} />
              </div>
              {s.change && (
                <div style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: 600, color: colors.success }}>
                  <TrendingUp size={14} />{s.change}
                </div>
              )}
            </div>
            <div style={{ fontSize: 30, fontWeight: 700, color: colors.text, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginTop: 6, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${colors.borderLight}` }}>
          <h3 style={{ fontSize: 16, fontWeight: 650, color: colors.text, margin: 0 }}>Pending Leave Requests</h3>
          <button onClick={() => onNavigate("leave")} style={{ fontSize: 13, color: colors.accent, fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        {leaves.map((r, i) => (
          <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: i < 2 ? `1px solid ${colors.borderLight}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar initials={r.emp.split(" ").map((n) => n[0]).join("")} size={36} index={i + 3} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{r.emp}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary }}>{r.type} • {r.from} – {r.to} ({r.days}d)</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "6px 14px", borderRadius: 8, background: colors.success, color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Approve</button>
              <button style={{ padding: "6px 14px", borderRadius: 8, background: colors.surface, color: colors.textSecondary, border: `1px solid ${colors.border}`, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
