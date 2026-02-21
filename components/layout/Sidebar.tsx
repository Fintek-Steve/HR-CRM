"use client";

import { LayoutDashboard, Users, Briefcase, Calendar, DollarSign, Settings, LogOut } from "lucide-react";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "employees", icon: Users, label: "Employees" },
  { id: "recruitment", icon: Briefcase, label: "Recruitment" },
  { id: "leave", icon: Calendar, label: "Leave" },
  { id: "payroll", icon: DollarSign, label: "Payroll" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ active, onNavigate }: { active: string; onNavigate: (page: string) => void }) {
  return (
    <div style={{
      width: 240, height: "100vh", background: "#0F0F12",
      display: "flex", flexDirection: "column", padding: "20px 12px",
      flexShrink: 0, position: "fixed", left: 0, top: 0, zIndex: 100,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "8px 8px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg, #2D5BFF, #7C3AED)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800, color: "#fff",
        }}>
          HR
        </div>
        <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>PeopleOS</span>
      </div>

      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px", borderRadius: 10,
                background: isActive ? "rgba(45,91,255,0.15)" : "transparent",
                color: isActive ? "#2D5BFF" : "rgba(255,255,255,0.5)",
                border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                width: "100%", textAlign: "left" as const,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = isActive ? "rgba(45,91,255,0.15)" : "transparent";
                (e.currentTarget as HTMLElement).style.color = isActive ? "#2D5BFF" : "rgba(255,255,255,0.5)";
              }}
            >
              <item.icon size={20} strokeWidth={1.8} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12 }}>
        <button style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px", borderRadius: 10,
          background: "transparent", color: "rgba(255,255,255,0.4)",
          border: "none", cursor: "pointer", fontSize: 14, width: "100%",
        }}>
          <LogOut size={20} strokeWidth={1.8} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
