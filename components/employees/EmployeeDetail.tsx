"use client";
import { useState } from "react";
import { ArrowLeft, Edit, Phone, Mail, MessageSquare, Building2, Landmark, Check, Plus, KeyRound } from "lucide-react";
import { Avatar, StatusBadge, ScopeBadge, Btn } from "@/components/ui/shared";
import { colors, typeColors, Settings, Employee, initialEmployees } from "@/lib/data";

export default function EmployeeDetail({ emp, onBack, settings }: { emp: Employee; onBack: () => void; settings: Settings }) {
  const [tab, setTab] = useState("overview");
  const idx = initialEmployees.findIndex((e) => e.id === emp.id);
  const tabs = ["Overview", "Compensation", "KPIs", "Accounts", "Documents", "Notes"];
  const amounts: Record<string, string> = { "Base Salary": "$185,000", "Housing Allowance": "$24,000", "Transport Allowance": "$6,000", "Annual Bonus": "$37,000", "Stock Options": "5,000 shares", "Health Insurance": "$12,000", "Retirement (401k)": "6% match", "Sales Commission": "10%", "Senior Quarterly Bonus": "$5,000/qtr" };
  const empComp = settings.comp.filter((c) => c.scope === "all" || (c.scope === "position" && c.sv === emp.role) || (c.scope === "rank" && c.sv === emp.rank));
  const empKpis = settings.kpis.filter((k) => k.scope === "all" || (k.scope === "position" && k.sv === emp.role) || (k.scope === "rank" && k.sv === emp.rank));

  return (
    <div className="animate-fade-slide-up" style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: colors.textSecondary, background: "none", border: "none", cursor: "pointer", marginBottom: 20, fontWeight: 500 }}><ArrowLeft size={16} /> Back to Directory</button>

      <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 32, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 16 }}>
          <div style={{ display: "flex", gap: 20 }}>
            <Avatar initials={emp.av} size={72} index={idx} />
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>{emp.nm}</h2>
              <div style={{ fontSize: 15, color: colors.accent, fontWeight: 500, marginTop: 4 }}>{emp.role}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" as const }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.purple, background: colors.purpleLight, padding: "3px 10px", borderRadius: 6 }}>{emp.rank}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: colors.textSecondary, background: colors.bg, padding: "3px 10px", borderRadius: 6 }}><Building2 size={12} />{emp.dept} / {emp.sub}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: colors.textSecondary, background: colors.bg, padding: "3px 10px", borderRadius: 6 }}><Landmark size={12} />{emp.branch}</span>
                <StatusBadge status={emp.st} />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            <Btn variant="secondary" icon={Phone} sm>Call</Btn><Btn variant="secondary" icon={Mail} sm>Email</Btn><Btn variant="secondary" icon={MessageSquare} sm>Message</Btn><Btn icon={Edit} sm>Edit</Btn>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", marginBottom: 20, borderBottom: `2px solid ${colors.border}`, overflow: "auto" }}>
        {tabs.map((t) => { const a = tab === t.toLowerCase(); return <button key={t} onClick={() => setTab(t.toLowerCase())} style={{ padding: "12px 20px", fontSize: 14, fontWeight: a ? 600 : 500, color: a ? colors.accent : colors.textSecondary, background: "none", border: "none", borderBottom: a ? `2px solid ${colors.accent}` : "2px solid transparent", cursor: "pointer", marginBottom: -2, whiteSpace: "nowrap" as const }}>{t}</button>; })}
      </div>

      {tab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 650, color: colors.text, margin: "0 0 20px" }}>Personal Information</h3>
            {[{ l: "Employee ID", v: emp.eid }, { l: "Email", v: emp.email }, { l: "Phone", v: emp.ph }, { l: "Location", v: emp.loc }, { l: "Type", v: emp.tp }].map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? `1px solid ${colors.borderLight}` : "none" }}><span style={{ fontSize: 13, color: colors.textSecondary }}>{f.l}</span><span style={{ fontSize: 13, color: colors.text, fontWeight: 550 }}>{f.v}</span></div>
            ))}
          </div>
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 650, color: colors.text, margin: "0 0 20px" }}>Employment Details</h3>
            {[{ l: "Department", v: emp.dept }, { l: "Sub-Dept", v: emp.sub }, { l: "Position", v: emp.role }, { l: "Rank", v: emp.rank }, { l: "Branch", v: emp.branch }, { l: "Manager", v: emp.mgr }, { l: "Hire Date", v: new Date(emp.hire).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) }].map((f, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 6 ? `1px solid ${colors.borderLight}` : "none" }}><span style={{ fontSize: 13, color: colors.textSecondary }}>{f.l}</span><span style={{ fontSize: 13, color: colors.text, fontWeight: 550 }}>{f.v}</span></div>
            ))}
          </div>
        </div>
      )}

      {tab === "compensation" && (
        <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: colors.text, margin: 0 }}>Compensation Breakdown</h3><Btn sm variant="secondary" icon={Edit}>Edit</Btn></div>
          <p style={{ fontSize: 12, color: colors.textTertiary, marginBottom: 16 }}>Filtered by position ({emp.role}) and rank ({emp.rank})</p>
          {empComp.map((c, i) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < empComp.length - 1 ? `1px solid ${colors.borderLight}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                <span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{c.name}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: typeColors[c.type], background: typeColors[c.type] + "15", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" as const }}>{c.type}</span>
                <ScopeBadge scope={c.scope} value={c.sv} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{amounts[c.name] || "—"}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0 0", marginTop: 8, borderTop: `2px solid ${colors.border}` }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>Total Package</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: colors.accent }}>$264,000+</span>
          </div>
        </div>
      )}

      {tab === "kpis" && (
        <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: colors.text, margin: 0 }}>Key Performance Indicators</h3><Btn sm variant="secondary" icon={Edit}>Set Targets</Btn></div>
          <p style={{ fontSize: 12, color: colors.textTertiary, marginBottom: 16 }}>Filtered by position ({emp.role}) and rank ({emp.rank})</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {empKpis.map((k, i) => { const p = [78, 92, 85, 95, 60, 88, 72][i % 7]; const pc = p >= 90 ? colors.success : p >= 70 ? colors.accent : colors.warning; return (
              <div key={k.id} style={{ padding: 18, borderRadius: 12, border: `1px solid ${colors.borderLight}`, background: colors.bg }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>{k.name}</span><span style={{ fontSize: 11, color: colors.textSecondary, background: colors.surface, padding: "2px 8px", borderRadius: 6 }}>{k.cat}</span></div>
                <div style={{ marginBottom: 8 }}><ScopeBadge scope={k.scope} value={k.sv} /></div>
                <div style={{ fontSize: 12, color: colors.textTertiary, marginBottom: 12 }}>{k.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ flex: 1, height: 6, borderRadius: 3, background: colors.border }}><div style={{ height: 6, borderRadius: 3, background: pc, width: `${p}%` }} /></div><span style={{ fontSize: 13, fontWeight: 700, color: pc }}>{p}%</span></div>
              </div>
            ); })}
          </div>
        </div>
      )}

      {tab === "accounts" && (
        <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: colors.text, margin: 0 }}>Assigned Accounts</h3><Btn sm variant="secondary" icon={Plus}>Assign</Btn></div>
          {settings.accounts.map((a, i) => { const prov = [true, true, true, true, false, true, true, false][i % 8]; return (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < settings.accounts.length - 1 ? `1px solid ${colors.borderLight}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: colors.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><KeyRound size={16} color={colors.accent} /></div>
                <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{a.name}</span>{a.req && <span style={{ fontSize: 10, fontWeight: 600, color: colors.danger, background: colors.dangerLight, padding: "1px 5px", borderRadius: 4 }}>Required</span>}{a.auto && <span style={{ fontSize: 10, fontWeight: 600, color: colors.purple, background: colors.purpleLight, padding: "1px 5px", borderRadius: 4 }}>Auto</span>}</div><span style={{ fontSize: 12, color: colors.textTertiary }}>{a.prov}</span></div>
              </div>
              {prov ? <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: colors.success }}><Check size={14} />Provisioned</span> : <Btn sm variant="secondary">Provision</Btn>}
            </div>
          ); })}
        </div>
      )}

      {(tab === "documents" || tab === "notes") && (
        <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 48, textAlign: "center" as const }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚧</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: colors.text, marginBottom: 4 }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</div>
          <div style={{ fontSize: 14, color: colors.textSecondary }}>Coming in the next development phase.</div>
        </div>
      )}
    </div>
  );
}
