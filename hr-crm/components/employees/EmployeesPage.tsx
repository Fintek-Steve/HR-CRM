"use client";
import { useState } from "react";
import { Search, Plus, Building2, Landmark, Mail } from "lucide-react";
import { Avatar, StatusBadge, Btn } from "@/components/ui/shared";
import { Settings, Employee } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

export default function EmployeesPage({ onSelect, settings, employees }: { onSelect: (e: Employee) => void; settings: Settings; employees: Employee[] }) {
  const { theme: t } = useTheme();
  const [q, setQ] = useState(""); const [df, setDf] = useState("All");
  const ds = ["All", ...settings.departments.map(d => d.name)];
  const fl = employees.filter(e => (e.nm.toLowerCase().includes(q.toLowerCase()) || e.role.toLowerCase().includes(q.toLowerCase())) && (df === "All" || e.dept === df));
  return <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, gap: 16, flexWrap: "wrap" as const }}>
      <div style={{ display: "flex", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, flex: 1, maxWidth: 360 }}><Search size={16} color={t.textTertiary} /><input placeholder="Search employees..." value={q} onChange={e => setQ(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, color: t.text, background: "transparent", width: "100%" }} /></div>
        <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, overflow: "auto" }}>{ds.slice(0, 6).map(d => <button key={d} onClick={() => setDf(d)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" as const, background: df === d ? t.accent : "transparent", color: df === d ? "#fff" : t.textSecondary }}>{d}</button>)}</div>
      </div><Btn icon={Plus}>Add Employee</Btn>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
      {fl.map((e, i) => <div key={e.id} onClick={() => onSelect(e)} className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24, cursor: "pointer", transition: "all .2s", animationDelay: `${.03 * i}s` }} onMouseEnter={v => { v.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)"; v.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={v => { v.currentTarget.style.boxShadow = "none"; v.currentTarget.style.transform = "none"; }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><Avatar initials={e.av} size={52} index={i} /><StatusBadge status={e.st} /></div>
        <div style={{ fontSize: 16, fontWeight: 650, color: t.text, marginBottom: 2 }}>{e.nm}</div>
        <div style={{ fontSize: 13, color: t.accent, fontWeight: 500, marginBottom: 4 }}>{e.role}</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: t.purple, background: t.purpleLight, padding: "2px 8px", borderRadius: 6 }}>{e.rank}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: t.textSecondary, background: t.bg, padding: "2px 8px", borderRadius: 6 }}>{e.sub}</span>
          {e.contract !== "Full-time" && <span style={{ fontSize: 11, fontWeight: 600, color: t.warning, background: t.warningLight, padding: "2px 8px", borderRadius: 6 }}>{e.contract}</span>}
        </div>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textSecondary }}><Building2 size={14} color={t.textTertiary} />{e.dept}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textSecondary }}><Landmark size={14} color={t.textTertiary} />{e.branch}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.textSecondary }}><Mail size={14} color={t.textTertiary} />{e.email}</div>
        </div>
      </div>)}
    </div>
  </div>;
}
