"use client";
import { useState } from "react";
import { Building2, Briefcase, Award, Landmark, CreditCard, Target, KeyRound, Plus, Trash2, ChevronDown, ChevronUp, GitBranch, FolderTree, Check, X, Globe } from "lucide-react";
import { Btn, Input, Select, Toggle, FormField, Modal, Toast, ScopeBadge } from "@/components/ui/shared";
import { colors, typeColors, Settings, generateId, getTimezone } from "@/lib/data";

export default function SettingsPage({ settings, setSettings }: { settings: Settings; setSettings: (fn: (s: Settings) => Settings) => void }) {
  const [sec, setSec] = useState("departments");
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const sections = [
    { id: "departments", icon: Building2, label: "Departments", count: settings.departments.length },
    { id: "positions", icon: Briefcase, label: "Positions", count: settings.positions.length },
    { id: "ranks", icon: Award, label: "Ranks", count: settings.ranks.length },
    { id: "branches", icon: Landmark, label: "Branches", count: settings.branches.length },
    { id: "comp", icon: CreditCard, label: "Compensation", count: settings.comp.length },
    { id: "kpis", icon: Target, label: "KPI Structure", count: settings.kpis.length },
    { id: "accounts", icon: KeyRound, label: "Accounts / Employee", count: settings.accounts.length },
  ];

  const del = (key: string, id: string) => {
    setSettings((p: Settings) => ({ ...p, [key]: (p as any)[key].filter((i: any) => i.id !== id) }));
    setToast("Item removed");
  };

  const descs: Record<string, string> = {
    departments: "Manage department & sub-department hierarchy.",
    positions: "Job positions mapped to departments & sub-departments.",
    ranks: "Career levels & seniority ranks.",
    branches: "Office locations with auto UTC timezone detection.",
    comp: "Salary components assignable per position, rank, or all employees.",
    kpis: "KPIs assignable per position, rank, or all employees.",
    accounts: "Tools & accounts each employee needs.",
  };

  function DepartmentsSection() {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    const [addSubTo, setAddSubTo] = useState<string | null>(null);
    const [subName, setSubName] = useState("");
    const toggleExpand = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));
    const addSub = (deptId: string) => {
      if (!subName.trim()) return;
      setSettings((p) => ({ ...p, departments: p.departments.map((d) => d.id === deptId ? { ...d, subs: [...d.subs, { id: generateId("sd"), name: subName.trim() }] } : d) }));
      setSubName(""); setAddSubTo(null); setToast("Sub-department added");
    };
    const removeSub = (deptId: string, subId: string) => {
      setSettings((p) => ({ ...p, departments: p.departments.map((d) => d.id === deptId ? { ...d, subs: d.subs.filter((s) => s.id !== subId) } : d) }));
      setToast("Sub-department removed");
    };
    return (
      <div>
        {settings.departments.map((d) => (
          <div key={d.id} style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, marginBottom: 8, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer" }} onClick={() => toggleExpand(d.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FolderTree size={18} color={colors.accent} />
                <span style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>{d.name}</span>
                <span style={{ fontSize: 12, color: colors.textTertiary, background: colors.bg, padding: "2px 8px", borderRadius: 10 }}>{d.subs.length} sub</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={(e) => { e.stopPropagation(); del("departments", d.id); }} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={(e) => (e.currentTarget.style.background = colors.dangerLight)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}><Trash2 size={14} color={colors.danger} /></button>
                {expanded[d.id] ? <ChevronUp size={16} color={colors.textTertiary} /> : <ChevronDown size={16} color={colors.textTertiary} />}
              </div>
            </div>
            {expanded[d.id] && (
              <div style={{ borderTop: `1px solid ${colors.borderLight}`, padding: "12px 18px 14px", background: colors.bg }}>
                {d.subs.map((s) => (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, marginBottom: 4 }} onMouseEnter={(e) => (e.currentTarget.style.background = colors.surface)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}><GitBranch size={14} color={colors.textTertiary} /><span style={{ fontSize: 13, color: colors.text }}>{s.name}</span></div>
                    <button onClick={() => removeSub(d.id, s.id)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = colors.dangerLight; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.background = "transparent"; }}><X size={12} color={colors.danger} /></button>
                  </div>
                ))}
                {addSubTo === d.id ? (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="Sub-department name" autoFocus onKeyDown={(e) => { if (e.key === "Enter") addSub(d.id); if (e.key === "Escape") { setAddSubTo(null); setSubName(""); } }} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${colors.accent}`, fontSize: 13, outline: "none", background: colors.surface }} />
                    <Btn sm onClick={() => addSub(d.id)} icon={Check}>Add</Btn>
                    <Btn sm variant="ghost" onClick={() => { setAddSubTo(null); setSubName(""); }}>Cancel</Btn>
                  </div>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); setAddSubTo(d.id); setSubName(""); }} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "8px 12px", borderRadius: 8, border: `1px dashed ${colors.border}`, background: "transparent", cursor: "pointer", fontSize: 13, color: colors.accent, fontWeight: 500, width: "100%" }}><Plus size={14} /> Add Sub-Department</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  function ListSection({ items, keyName, cols, renderRow }: { items: any[]; keyName: string; cols: string; renderRow: (item: any) => React.ReactNode }) {
    return (
      <div style={{ background: colors.surface, borderRadius: 12, border: `1px solid ${colors.border}`, overflow: "hidden" }}>
        {items.map((it: any, i: number) => (
          <div key={it.id} style={{ display: "grid", gridTemplateColumns: cols, padding: "12px 18px", borderBottom: i < items.length - 1 ? `1px solid ${colors.borderLight}` : "none", alignItems: "center", gap: 8 }} onMouseEnter={(e) => (e.currentTarget.style.background = colors.bg)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
            {renderRow(it)}
            <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={() => del(keyName, it.id)} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={(e) => (e.currentTarget.style.background = colors.dangerLight)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}><Trash2 size={14} color={colors.danger} /></button></div>
          </div>
        ))}
      </div>
    );
  }

  function AddModal() {
    const [f, sF] = useState<Record<string, any>>(sec === "comp" || sec === "kpis" ? { scope: "all", sv: "" } : {});
    const u = (k: string, v: any) => sF((p) => ({ ...p, [k]: v }));
    const selectedDept = settings.departments.find((d) => d.name === f.dept);
    const subOptions = selectedDept ? selectedDept.subs.map((s) => s.name) : [];
    const setCountry = (v: string) => { const tz = getTimezone(v); sF((p) => ({ ...p, country: v, tz: tz || p.tz || "" })); };
    const save = () => {
      if (!f.name) return;
      if (sec === "departments") { setSettings((p) => ({ ...p, departments: [...p.departments, { id: generateId("d"), name: f.name, subs: [] }] })); }
      else { setSettings((p) => ({ ...p, [sec]: [...(p as any)[sec], { id: generateId(sec[0]), ...f }] })); }
      setModal(false); setToast("Added successfully");
    };
    const titles: Record<string, string> = { departments: "Add Department", positions: "Add Position", ranks: "Add Rank", branches: "Add Branch", comp: "Add Compensation Item", kpis: "Add KPI", accounts: "Add Account" };
    const posNames = settings.positions.map((p) => p.name);
    const rankNames = settings.ranks.map((r) => r.name);

    return (
      <Modal title={titles[sec]} onClose={() => setModal(false)} wide={sec === "comp" || sec === "kpis"}>
        <FormField label="Name" required><Input value={f.name || ""} onChange={(v) => u("name", v)} placeholder="Enter name" /></FormField>
        {sec === "positions" && (<>
          <FormField label="Department" required><Select value={f.dept || ""} onChange={(v) => { u("dept", v); u("sub", ""); }} options={settings.departments.map((d) => d.name)} placeholder="Select department" /></FormField>
          <FormField label="Sub-Department" required><Select value={f.sub || ""} onChange={(v) => u("sub", v)} options={subOptions} placeholder={f.dept ? "Select sub-department" : "Select department first"} /></FormField>
        </>)}
        {sec === "ranks" && (<>
          <FormField label="Level" required><Input type="number" value={f.level || ""} onChange={(v) => u("level", parseInt(v))} placeholder="1-10" /></FormField>
          <FormField label="Color"><Input value={f.color || "#2D5BFF"} onChange={(v) => u("color", v)} placeholder="#hex" /></FormField>
        </>)}
        {sec === "branches" && (<>
          <FormField label="Address"><Input value={f.address || ""} onChange={(v) => u("address", v)} placeholder="Street address" /></FormField>
          <FormField label="Country" required><Input value={f.country || ""} onChange={(v) => setCountry(v)} placeholder="e.g. USA, UK, Germany" /></FormField>
          <FormField label="Timezone (UTC)">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Input value={f.tz || ""} onChange={(v) => u("tz", v)} placeholder="Auto from country" disabled={!!getTimezone(f.country)} />
              {f.tz && <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, fontSize: 13, fontWeight: 600, color: colors.accent }}><Globe size={14} />{f.tz}</span>}
            </div>
            {f.country && getTimezone(f.country) ? <span style={{ fontSize: 11, color: colors.success, marginTop: 4, display: "block" }}>Auto-detected from {f.country}</span> : f.country && f.country !== "Global" ? <span style={{ fontSize: 11, color: colors.warning, marginTop: 4, display: "block" }}>Unknown country — enter timezone manually</span> : null}
          </FormField>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Headquarters</span><Toggle checked={f.isHQ || false} onChange={(v) => u("isHQ", v)} /></div>
        </>)}
        {sec === "comp" && (<>
          <FormField label="Type" required><Select value={f.type || ""} onChange={(v) => u("type", v)} options={["fixed", "variable", "equity", "benefit"]} placeholder="Select type" /></FormField>
          <FormField label="Description"><Input value={f.desc || ""} onChange={(v) => u("desc", v)} placeholder="Description" /></FormField>
          <FormField label="Applies To" required><Select value={f.scope || "all"} onChange={(v) => { u("scope", v); u("sv", ""); }} options={[{ value: "all", label: "All Employees" }, { value: "position", label: "Specific Position" }, { value: "rank", label: "Specific Rank" }]} /></FormField>
          {f.scope === "position" && <FormField label="Position"><Select value={f.sv || ""} onChange={(v) => u("sv", v)} options={posNames} placeholder="Select position" /></FormField>}
          {f.scope === "rank" && <FormField label="Rank"><Select value={f.sv || ""} onChange={(v) => u("sv", v)} options={rankNames} placeholder="Select rank" /></FormField>}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}><span style={{ fontSize: 13, fontWeight: 600 }}>Required</span><Toggle checked={f.req || false} onChange={(v) => u("req", v)} /></div>
        </>)}
        {sec === "kpis" && (<>
          <FormField label="Category" required><Select value={f.cat || ""} onChange={(v) => u("cat", v)} options={["Financial", "Customer", "Productivity", "Quality", "HR", "Operations"]} placeholder="Select category" /></FormField>
          <FormField label="Unit"><Input value={f.unit || ""} onChange={(v) => u("unit", v)} placeholder="e.g. $, %, score" /></FormField>
          <FormField label="Description"><Input value={f.desc || ""} onChange={(v) => u("desc", v)} placeholder="What this measures" /></FormField>
          <FormField label="Applies To" required><Select value={f.scope || "all"} onChange={(v) => { u("scope", v); u("sv", ""); }} options={[{ value: "all", label: "All Employees" }, { value: "position", label: "Specific Position" }, { value: "rank", label: "Specific Rank" }]} /></FormField>
          {f.scope === "position" && <FormField label="Position"><Select value={f.sv || ""} onChange={(v) => u("sv", v)} options={posNames} placeholder="Select position" /></FormField>}
          {f.scope === "rank" && <FormField label="Rank"><Select value={f.sv || ""} onChange={(v) => u("sv", v)} options={rankNames} placeholder="Select rank" /></FormField>}
        </>)}
        {sec === "accounts" && (<>
          <FormField label="Provider" required><Input value={f.prov || ""} onChange={(v) => u("prov", v)} placeholder="e.g. Google, Slack" /></FormField>
          <div style={{ display: "flex", gap: 24, padding: "8px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Required</span><Toggle checked={f.req || false} onChange={(v) => u("req", v)} /></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 13, fontWeight: 600 }}>Auto-Provision</span><Toggle checked={f.auto || false} onChange={(v) => u("auto", v)} /></div>
          </div>
        </>)}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${colors.border}` }}>
          <Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn>
          <Btn onClick={save} icon={Plus}>Add</Btn>
        </div>
      </Modal>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 250, flexShrink: 0 }}>
          <div style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 8, position: "sticky" as const, top: 32 }}>
            {sections.map((s) => { const a = sec === s.id; return (
              <button key={s.id} onClick={() => setSec(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: a ? colors.accentLight : "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left" as const, transition: "all 0.15s" }} onMouseEnter={(e) => { if (!a) e.currentTarget.style.background = colors.bg; }} onMouseLeave={(e) => { if (!a) e.currentTarget.style.background = "transparent"; }}>
                <s.icon size={18} color={a ? colors.accent : colors.textTertiary} strokeWidth={1.8} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? colors.accent : colors.text }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: a ? colors.accent : colors.textTertiary, background: a ? colors.accent + "15" : colors.bg, padding: "2px 7px", borderRadius: 6 }}>{s.count}</span>
              </button>
            ); })}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div><h2 style={{ fontSize: 18, fontWeight: 700, color: colors.text, margin: 0 }}>{sections.find((s) => s.id === sec)?.label}</h2><p style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{descs[sec]}</p></div>
            <Btn onClick={() => setModal(true)} icon={Plus}>Add New</Btn>
          </div>
          {sec === "departments" && <DepartmentsSection />}
          {sec === "positions" && <ListSection items={settings.positions} keyName="positions" cols="1fr 1fr 1fr 48px" renderRow={(it) => <><span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{it.name}</span><span style={{ fontSize: 13, color: colors.textSecondary }}>{it.dept}</span><span style={{ fontSize: 12, color: colors.purple, background: colors.purpleLight, padding: "2px 8px", borderRadius: 6, justifySelf: "start" }}>{it.sub || "—"}</span></>} />}
          {sec === "ranks" && <ListSection items={settings.ranks} keyName="ranks" cols="1fr 80px 60px 48px" renderRow={(it) => <><span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{it.name}</span><span style={{ fontSize: 13, color: colors.textSecondary }}>Level {it.level}</span><div style={{ width: 20, height: 20, borderRadius: 6, background: it.color, border: `1px solid ${colors.border}` }} /></>} />}
          {sec === "branches" && <ListSection items={settings.branches} keyName="branches" cols="1fr 100px 100px 48px" renderRow={(it) => <><div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{it.name}</span>{it.isHQ && <span style={{ fontSize: 10, fontWeight: 700, color: colors.accent, background: colors.accentLight, padding: "2px 6px", borderRadius: 4 }}>HQ</span>}</div><span style={{ fontSize: 12, color: colors.textTertiary }}>{it.address}</span></div><span style={{ fontSize: 13, color: colors.textSecondary }}>{it.country}</span><span style={{ fontSize: 13, fontWeight: 600, color: colors.accent, display: "flex", alignItems: "center", gap: 4 }}><Globe size={12} />{it.tz}</span></>} />}
          {sec === "comp" && <ListSection items={settings.comp} keyName="comp" cols="1fr 90px 140px 80px 48px" renderRow={(it) => <><div><span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{it.name}</span><div style={{ fontSize: 12, color: colors.textTertiary }}>{it.desc}</div></div><span style={{ fontSize: 12, fontWeight: 600, color: typeColors[it.type], background: typeColors[it.type] + "15", padding: "3px 8px", borderRadius: 6, textTransform: "capitalize" as const, justifySelf: "start" }}>{it.type}</span><ScopeBadge scope={it.scope} value={it.sv} /><span>{it.req ? <Check size={16} color={colors.success} /> : <span style={{ fontSize: 12, color: colors.textTertiary }}>Optional</span>}</span></>} />}
          {sec === "kpis" && <ListSection items={settings.kpis} keyName="kpis" cols="1fr 100px 50px 140px 48px" renderRow={(it) => <><div><span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{it.name}</span><div style={{ fontSize: 12, color: colors.textTertiary }}>{it.desc}</div></div><span style={{ fontSize: 12, color: colors.textSecondary, background: colors.bg, padding: "3px 8px", borderRadius: 6, justifySelf: "start" }}>{it.cat}</span><span style={{ fontSize: 13, color: colors.textSecondary }}>{it.unit}</span><ScopeBadge scope={it.scope} value={it.sv} /></>} />}
          {sec === "accounts" && <ListSection items={settings.accounts} keyName="accounts" cols="1fr 140px 80px 48px" renderRow={(it) => <><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14, fontWeight: 550, color: colors.text }}>{it.name}</span>{it.auto && <span style={{ fontSize: 10, fontWeight: 600, color: colors.purple, background: colors.purpleLight, padding: "2px 6px", borderRadius: 4 }}>Auto</span>}</div><span style={{ fontSize: 13, color: colors.textSecondary }}>{it.prov}</span><span>{it.req ? <Check size={16} color={colors.success} /> : <span style={{ fontSize: 12, color: colors.textTertiary }}>Optional</span>}</span></>} />}
        </div>
      </div>
      {modal && <AddModal />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
