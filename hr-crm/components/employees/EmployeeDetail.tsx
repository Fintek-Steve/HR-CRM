"use client";
import { useState } from "react";
import { ArrowLeft, Edit, Phone, Mail, MessageSquare, Building2, Landmark, Check, Plus, KeyRound, Clock, Briefcase, Award, GitBranch, MapPin, FileText, User, Calendar, X, Layers } from "lucide-react";
import { Avatar, StatusBadge, ScopeBadge, Btn, Input, Modal, FormField, Select, Toast } from "@/components/ui/shared";
import { typeColors, Settings, Employee, HistoryEntry, initialEmployees, generateId } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

const typeConfig: Record<string, { icon: any; color: string; label: string }> = {
  hire: { icon: Plus, color: "#0D9F6E", label: "Hired" },
  position: { icon: Briefcase, color: "#2D5BFF", label: "Position Change" },
  rank: { icon: Award, color: "#7C3AED", label: "Rank Change" },
  department: { icon: Building2, color: "#D97706", label: "Department Transfer" },
  branch: { icon: MapPin, color: "#0891B2", label: "Branch Transfer" },
  status: { icon: Clock, color: "#DC2626", label: "Status Change" },
  contract: { icon: FileText, color: "#BE185D", label: "Contract Change" },
  manager: { icon: User, color: "#4F46E5", label: "Manager Change" },
};

export default function EmployeeDetail({ emp: initEmp, onBack, settings }: { emp: Employee; onBack: () => void; settings: Settings }) {
  const { theme: t } = useTheme();
  const [tab, setTab] = useState("overview");
  const [emp, setEmp] = useState(initEmp);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const idx = initialEmployees.findIndex(e => e.id === emp.id);
  const tabs = ["Overview", "History", "Compensation", "KPIs", "Accounts", "Documents", "Notes"];
  const amounts: Record<string, string> = { "Base Salary": "$185,000", "Housing Allowance": "$24,000", "Annual Bonus": "$37,000", "Stock Options": "5,000 shares", "Health Insurance": "$12,000", "Sales Commission": "10%", "Sr Eng Bonus": "$5,000/qtr" };

  const matchScope = (item: { scope: string; sv: string; sv2: string }) => {
    if (item.scope === "position_rank") return (!item.sv || item.sv === emp.role) && (!item.sv2 || item.sv2 === emp.rank);
    if (item.scope === "employee") return item.sv === emp.nm;
    return true;
  };
  const empComp = settings.comp.filter(matchScope);
  const empKpis = settings.kpis.filter(matchScope);
  const ct = settings.contractTypes.find(c => c.name === emp.contract);

  const sortedHistory = [...emp.history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const startEdit = (h: HistoryEntry) => { setEditingId(h.id); setEditDate(h.date); setEditNote(h.note); };

  const saveEdit = () => {
    if (!editingId) return;
    setEmp(prev => ({ ...prev, history: prev.history.map(h => h.id === editingId ? { ...h, date: editDate, note: editNote } : h) }));
    setEditingId(null); setToast("History entry updated");
  };

  const deleteHistory = (id: string) => {
    setEmp(prev => ({ ...prev, history: prev.history.filter(h => h.id !== id) }));
    setToast("History entry removed");
  };

  function AddHistoryModal() {
    const [f, sF] = useState<Record<string, string>>({ type: "position", date: new Date().toISOString().split("T")[0], from: "", to: "", note: "" });
    const u = (k: string, v: string) => sF(p => ({ ...p, [k]: v }));
    const save = () => {
      if (!f.date || !f.type) return;
      const entry: HistoryEntry = { id: generateId("h"), date: f.date, type: f.type as any, from: f.from, to: f.to, note: f.note };
      setEmp(prev => ({ ...prev, history: [...prev.history, entry] }));
      setShowAddHistory(false); setToast("History entry added");
    };
    return (
      <Modal title="Add History Entry" onClose={() => setShowAddHistory(false)}>
        <FormField label="Type" required><Select value={f.type} onChange={v => u("type", v)} options={[{value:"position",label:"Position Change"},{value:"rank",label:"Rank Change"},{value:"department",label:"Department Transfer"},{value:"branch",label:"Branch Transfer"},{value:"status",label:"Status Change"},{value:"contract",label:"Contract Change"},{value:"manager",label:"Manager Change"}]} /></FormField>
        <FormField label="Date" required><Input type="date" value={f.date} onChange={v => u("date", v)} /></FormField>
        <FormField label="From"><Input value={f.from} onChange={v => u("from", v)} placeholder="Previous value" /></FormField>
        <FormField label="To"><Input value={f.to} onChange={v => u("to", v)} placeholder="New value" /></FormField>
        <FormField label="Note"><Input value={f.note} onChange={v => u("note", v)} placeholder="Optional note" /></FormField>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
          <Btn variant="secondary" onClick={() => setShowAddHistory(false)}>Cancel</Btn>
          <Btn onClick={save} icon={Plus}>Add Entry</Btn>
        </div>
      </Modal>
    );
  }

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  return <div className="animate-fade-slide-up" style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
    <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: t.textSecondary, background: "none", border: "none", cursor: "pointer", marginBottom: 20, fontWeight: 500 }}><ArrowLeft size={16} /> Back to Directory</button>

    {/* Header */}
    <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 32, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 16 }}>
        <div style={{ display: "flex", gap: 20 }}><Avatar initials={emp.av} size={72} index={idx} /><div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: t.text, margin: 0 }}>{emp.nm}</h2>
          <div style={{ fontSize: 15, color: t.accent, fontWeight: 500, marginTop: 4 }}>{emp.role}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" as const }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: t.purple, background: t.purpleLight, padding: "3px 10px", borderRadius: 6 }}>{emp.rank}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: t.textSecondary, background: t.bg, padding: "3px 10px", borderRadius: 6 }}><Building2 size={12} />{emp.dept}/{emp.sub}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: t.textSecondary, background: t.bg, padding: "3px 10px", borderRadius: 6 }}><Landmark size={12} />{emp.branch}</span>
            {ct && <span style={{ fontSize: 12, fontWeight: 600, color: ct.color, background: ct.color + "15", padding: "3px 10px", borderRadius: 6 }}>{ct.name}</span>}
            <StatusBadge status={emp.st} />
          </div>
        </div></div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}><Btn variant="secondary" icon={Phone} sm>Call</Btn><Btn variant="secondary" icon={Mail} sm>Email</Btn><Btn variant="secondary" icon={MessageSquare} sm>Message</Btn><Btn icon={Edit} sm>Edit</Btn></div>
      </div>
    </div>

    {/* Tabs */}
    <div style={{ display: "flex", marginBottom: 20, borderBottom: `2px solid ${t.border}`, overflow: "auto" }}>{tabs.map(tb => { const a = tab === tb.toLowerCase(); return <button key={tb} onClick={() => setTab(tb.toLowerCase())} style={{ padding: "12px 20px", fontSize: 14, fontWeight: a ? 600 : 500, color: a ? t.accent : t.textSecondary, background: "none", border: "none", borderBottom: a ? `2px solid ${t.accent}` : "2px solid transparent", cursor: "pointer", marginBottom: -2, whiteSpace: "nowrap" as const }}>{tb}</button>; })}</div>

    {/* Overview */}
    {tab === "overview" && <div style={{ display: "flex", flexDirection: "column" as const, gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: "0 0 20px" }}>Personal Contact</h3>{[{l:"Personal Email",v:emp.email},{l:"Personal Phone",v:emp.ph},{l:"Location",v:emp.loc}].map((f,i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${t.borderLight}` : "none" }}><span style={{ fontSize: 13, color: t.textSecondary }}>{f.l}</span><span style={{ fontSize: 13, color: t.text, fontWeight: 550 }}>{f.v}</span></div>)}</div>
        <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: "0 0 20px" }}>Company Contact</h3>{[{l:"Company Email",v:emp.compEmail},{l:"Company Phone",v:emp.compPhone},{l:"Extension",v:emp.compExt}].map((f,i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${t.borderLight}` : "none" }}><span style={{ fontSize: 13, color: t.textSecondary }}>{f.l}</span><span style={{ fontSize: 13, color: t.text, fontWeight: 550 }}>{f.v}</span></div>)}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: "0 0 20px" }}>Personal Information</h3>{[{l:"Employee ID",v:emp.eid},{l:"Contract Type",v:emp.contract},{l:"Hire Date",v:fmtDate(emp.hire)}].map((f,i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${t.borderLight}` : "none" }}><span style={{ fontSize: 13, color: t.textSecondary }}>{f.l}</span><span style={{ fontSize: 13, color: t.text, fontWeight: 550 }}>{f.v}</span></div>)}</div>
        <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: "0 0 20px" }}>Employment Details</h3>{[{l:"Department",v:emp.dept},{l:"Sub-Dept",v:emp.sub},{l:"Position",v:emp.role},{l:"Rank",v:emp.rank},{l:"Branch",v:emp.branch},{l:"Manager",v:emp.mgr}].map((f,i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 5 ? `1px solid ${t.borderLight}` : "none" }}><span style={{ fontSize: 13, color: t.textSecondary }}>{f.l}</span><span style={{ fontSize: 13, color: t.text, fontWeight: 550 }}>{f.v}</span></div>)}</div>
      </div>
    </div>}

    {/* ─── HISTORY TAB ─── */}
    {tab === "history" && <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: 0 }}>Employment History</h3><p style={{ fontSize: 12, color: t.textTertiary, marginTop: 4 }}>{sortedHistory.length} entries — click the date or note to edit</p></div>
        <Btn sm icon={Plus} onClick={() => setShowAddHistory(true)}>Add Entry</Btn>
      </div>

      {/* Timeline */}
      <div style={{ position: "relative" as const, paddingLeft: 32 }}>
        {/* Vertical line */}
        <div style={{ position: "absolute" as const, left: 15, top: 8, bottom: 8, width: 2, background: t.border, borderRadius: 1 }} />

        {sortedHistory.map((h, i) => {
          const cfg = typeConfig[h.type] || typeConfig.hire;
          const Icon = cfg.icon;
          const isEditing = editingId === h.id;

          return <div key={h.id} style={{ position: "relative" as const, marginBottom: i < sortedHistory.length - 1 ? 24 : 0 }}>
            {/* Dot */}
            <div style={{ position: "absolute" as const, left: -25, top: 4, width: 22, height: 22, borderRadius: 11, background: cfg.color + "20", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${cfg.color}` }}>
              <Icon size={10} color={cfg.color} strokeWidth={2.5} />
            </div>

            <div style={{ background: t.bg, borderRadius: 12, padding: "14px 18px", border: `1px solid ${t.borderLight}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" as const }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, background: cfg.color + "15", padding: "2px 8px", borderRadius: 6 }}>{cfg.label}</span>
                    {h.type === "hire" && <span style={{ fontSize: 11, fontWeight: 600, color: t.success, background: t.successLight, padding: "2px 6px", borderRadius: 4 }}>Start</span>}
                  </div>

                  {h.from && h.to ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: t.text }}>
                      <span style={{ color: t.textTertiary, textDecoration: "line-through" as const }}>{h.from}</span>
                      <span style={{ color: t.textTertiary }}>→</span>
                      <span style={{ fontWeight: 600 }}>{h.to}</span>
                    </div>
                  ) : h.to ? (
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{h.to}</div>
                  ) : null}

                  {isEditing ? (
                    <div style={{ marginTop: 10, display: "flex", flexDirection: "column" as const, gap: 8 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <label style={{ fontSize: 12, color: t.textSecondary, width: 40 }}>Date</label>
                        <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${t.accent}`, fontSize: 13, background: t.inputBg, color: t.text, outline: "none" }} />
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <label style={{ fontSize: 12, color: t.textSecondary, width: 40 }}>Note</label>
                        <input value={editNote} onChange={e => setEditNote(e.target.value)} style={{ flex: 1, padding: "6px 10px", borderRadius: 8, border: `1px solid ${t.accent}`, fontSize: 13, background: t.inputBg, color: t.text, outline: "none" }} />
                      </div>
                      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                        <Btn sm onClick={saveEdit} icon={Check}>Save</Btn>
                        <Btn sm variant="ghost" onClick={() => setEditingId(null)}>Cancel</Btn>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: 6 }}>
                      {h.note && <div style={{ fontSize: 12, color: t.textTertiary, fontStyle: "italic" as const }}>{h.note}</div>}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {!isEditing && <>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: t.textSecondary }}><Calendar size={12} />{fmtDate(h.date)}</span>
                    <button onClick={() => startEdit(h)} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = t.accentLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"} title="Edit date & note"><Edit size={12} color={t.accent} /></button>
                    {h.type !== "hire" && <button onClick={() => deleteHistory(h.id)} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = t.dangerLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"} title="Delete entry"><X size={12} color={t.danger} /></button>}
                  </>}
                </div>
              </div>
            </div>
          </div>;
        })}
      </div>
    </div>}

    {/* Compensation */}
    {tab === "compensation" && <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: 0 }}>Compensation</h3><Btn sm variant="secondary" icon={Edit}>Edit</Btn></div>
      <p style={{ fontSize: 12, color: t.textTertiary, marginBottom: 16 }}>Filtered by position ({emp.role}), rank ({emp.rank})</p>
      {empComp.map((c, i) => <div key={c.id} style={{ padding: "14px 0", borderBottom: i < empComp.length - 1 ? `1px solid ${t.borderLight}` : "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{c.name}</span><span style={{ fontSize: 10, fontWeight: 600, color: typeColors[c.type], background: typeColors[c.type] + "15", padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" as const }}>{c.type}</span><ScopeBadge scope={c.scope} value={c.sv} value2={c.sv2} /></div>
          <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{amounts[c.name] || "—"}</span>
        </div>
        {c.tiers && c.tiers.length > 0 && <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: t.bg, border: `1px solid ${t.borderLight}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}><span style={{ fontSize: 11, fontWeight: 700, color: t.warning, textTransform: "uppercase" as const }}>Commission Tiers</span><span style={{ fontSize: 11, color: t.textTertiary }}>Based on {c.tierBasis || "deals"}</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {c.tiers.map(tr => {
              const range = tr.max !== null ? `${tr.min}–${tr.max}` : `${tr.min}+`;
              const reward = tr.rewardType === "percentage" ? `${tr.rewardValue}% of volume` : `$${tr.rewardValue.toLocaleString()} per ${c.tierBasis === "deals" ? "deal" : "unit"}`;
              return <div key={tr.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", borderRadius: 6, background: t.surface, border: `1px solid ${t.borderLight}` }}>
                <span style={{ fontSize: 12, color: t.textSecondary }}>{range} {c.tierBasis || "deals"}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: tr.rewardType === "percentage" ? t.accent : t.success }}>{reward}</span>
              </div>;
            })}
          </div>
        </div>}
      </div>)}
    </div>}

    {/* KPIs */}
    {tab === "kpis" && <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: 0 }}>KPIs</h3><Btn sm variant="secondary" icon={Edit}>Targets</Btn></div>
      <p style={{ fontSize: 12, color: t.textTertiary, marginBottom: 16 }}>Filtered by position ({emp.role}), rank ({emp.rank})</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{empKpis.map((k, i) => { const p = [78,92,85,95,60,88,72][i%7]; const pc = p >= 90 ? t.success : p >= 70 ? t.accent : t.warning; const activeTier = k.tiers && k.tiers.length > 0 ? k.tiers.find(tr => p >= tr.min && (tr.max === null || p <= tr.max)) : null; return <div key={k.id} style={{ padding: 18, borderRadius: 12, border: `1px solid ${t.borderLight}`, background: t.bg }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{k.name}</span><span style={{ fontSize: 11, color: t.textSecondary, background: t.surface, padding: "2px 8px", borderRadius: 6 }}>{k.cat}</span></div>
        <div style={{ marginBottom: 8 }}><ScopeBadge scope={k.scope} value={k.sv} value2={k.sv2} /></div>
        <div style={{ fontSize: 12, color: t.textTertiary, marginBottom: 12 }}>{k.desc}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: k.tiers && k.tiers.length > 0 ? 12 : 0 }}><div style={{ flex: 1, height: 6, borderRadius: 3, background: t.border }}><div style={{ height: 6, borderRadius: 3, background: pc, width: `${p}%` }} /></div><span style={{ fontSize: 13, fontWeight: 700, color: pc }}>{p}%</span></div>
        {k.tiers && k.tiers.length > 0 && <div style={{ padding: "8px 10px", borderRadius: 8, background: t.surface, border: `1px solid ${t.borderLight}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: t.purple, textTransform: "uppercase" as const, marginBottom: 6 }}>Performance Tiers{k.tierBasis ? ` (${k.tierBasis})` : ""}</div>
          {k.tiers.map(tr => {
            const range = tr.max !== null ? `${tr.min}–${tr.max}` : `${tr.min}+`;
            const reward = tr.rewardType === "percentage" ? `${tr.rewardValue}% bonus` : tr.rewardType === "fixed" ? `$${tr.rewardValue.toLocaleString()}` : "";
            const isActive = activeTier && activeTier.id === tr.id;
            return <div key={tr.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 6px", borderRadius: 4, fontSize: 11, background: isActive ? t.accentLight : "transparent", border: isActive ? `1px solid ${t.accent}30` : "1px solid transparent" }}>
              <span style={{ color: t.textSecondary }}>{range}{k.unit ? ` ${k.unit}` : ""}</span>
              <span style={{ fontWeight: 600, color: isActive ? t.accent : t.text }}>{tr.label}</span>
              {reward && <span style={{ color: tr.rewardType === "percentage" ? t.accent : t.success, fontWeight: 600 }}>{reward}</span>}
            </div>;
          })}
          {activeTier && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: t.accent }}>Current: {activeTier.label}{activeTier.rewardType !== "none" ? ` → ${activeTier.rewardType === "percentage" ? activeTier.rewardValue + "% bonus" : "$" + activeTier.rewardValue.toLocaleString()}` : ""}</div>}
        </div>}
      </div>; })}</div>
    </div>}

    {/* Accounts */}
    {tab === "accounts" && <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h3 style={{ fontSize: 15, fontWeight: 650, color: t.text, margin: 0 }}>Accounts</h3><Btn sm variant="secondary" icon={Plus}>Assign</Btn></div>
      {settings.accounts.map((a, i) => { const pv = [1,1,1,1,0,1,1,0][i%8]; return <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: i < settings.accounts.length - 1 ? `1px solid ${t.borderLight}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: t.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><KeyRound size={16} color={t.accent} /></div><div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{a.name}</span>{a.req && <span style={{ fontSize: 10, fontWeight: 600, color: t.danger, background: t.dangerLight, padding: "1px 5px", borderRadius: 4 }}>Req</span>}{a.auto && <span style={{ fontSize: 10, fontWeight: 600, color: t.purple, background: t.purpleLight, padding: "1px 5px", borderRadius: 4 }}>Auto</span>}</div><span style={{ fontSize: 12, color: t.textTertiary }}>{a.prov}</span></div></div>
        {pv ? <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: t.success }}><Check size={14} />Provisioned</span> : <Btn sm variant="secondary">Provision</Btn>}
      </div>; })}
    </div>}

    {/* Placeholders */}
    {(tab === "documents" || tab === "notes") && <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 48, textAlign: "center" as const }}><div style={{ fontSize: 40, marginBottom: 16 }}>🚧</div><div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</div><div style={{ fontSize: 14, color: t.textSecondary }}>Coming in the next phase.</div></div>}

    {showAddHistory && <AddHistoryModal />}
    {toast && <Toast message={toast} onClose={() => setToast(null)} />}
  </div>;
}
