"use client";
import { LayoutDashboard, Users, Briefcase, Calendar, DollarSign, Settings, LogOut, Moon, Sun, FileText } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

const navItems = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "employees", icon: Users, label: "Employees" },
  { id: "recruitment", icon: Briefcase, label: "Recruitment" },
  { id: "leave", icon: Calendar, label: "Leave" },
  { id: "payroll", icon: DollarSign, label: "Payroll" },
  { id: "documents", icon: FileText, label: "Documents" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ active, onNavigate }: { active: string; onNavigate: (page: string) => void }) {
  const { theme: t, isDark, toggle } = useTheme();
  return (
    <div style={{ width: 240, height: "100vh", background: t.sidebar, display: "flex", flexDirection: "column", padding: "20px 12px", flexShrink: 0, position: "fixed", left: 0, top: 0, zIndex: 100 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 8px 24px", borderBottom: `1px solid ${t.sidebarBorder}`, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2D5BFF, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, color: "#fff" }}>HR</div>
        <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>PeopleOS</span>
      </div>
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
        {navItems.map(item => {
          const a = active === item.id;
          return <button key={item.id} onClick={() => onNavigate(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: a ? t.sidebarActiveBg : "transparent", color: a ? t.sidebarTextActive : t.sidebarText, border: "none", cursor: "pointer", fontSize: 14, fontWeight: a ? 600 : 500, width: "100%", textAlign: "left" as const, transition: "all 0.15s" }} onMouseEnter={e => { if (!a) { e.currentTarget.style.background = t.sidebarHoverBg; e.currentTarget.style.color = t.sidebarHoverText; } }} onMouseLeave={e => { e.currentTarget.style.background = a ? t.sidebarActiveBg : "transparent"; e.currentTarget.style.color = a ? t.sidebarTextActive : t.sidebarText; }}><item.icon size={20} strokeWidth={1.8} />{item.label}</button>;
        })}
      </nav>
      <div style={{ borderTop: `1px solid ${t.sidebarBorder}`, paddingTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
        <button onClick={toggle} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "transparent", color: t.sidebarText, border: "none", cursor: "pointer", fontSize: 14, width: "100%", transition: "all 0.15s" }} onMouseEnter={e => { e.currentTarget.style.background = t.sidebarHoverBg; e.currentTarget.style.color = t.sidebarHoverText; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.sidebarText; }}>
          {isDark ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}{isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "transparent", color: "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", fontSize: 14, width: "100%" }}><LogOut size={20} strokeWidth={1.8} />Sign Out</button>
      </div>
    </div>
  );
}
