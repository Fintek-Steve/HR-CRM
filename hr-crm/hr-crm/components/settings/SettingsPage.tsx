"use client";
import { useState, useEffect } from "react";
import { Building2, Briefcase, Award, Landmark, CreditCard, Target, KeyRound, Plus, Trash2, ChevronDown, ChevronUp, GitBranch, FolderTree, Check, X, Globe, Clock, FileText } from "lucide-react";
import { Btn, Input, Select, Toggle, FormField, Modal, Toast, ScopeBadge } from "@/components/ui/shared";
import { typeColors, Settings, generateId, getTimezone, getLiveTime } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

export default function SettingsPage({ settings, setSettings }: { settings: Settings; setSettings: (fn: (s: Settings) => Settings) => void }) {
  const { theme: t } = useTheme();
  const [sec, setSec] = useState("departments");
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Update live times every 30s
  useEffect(() => { const i = setInterval(() => setTick(p => p + 1), 30000); return () => clearInterval(i); }, []);

  const sections = [
    { id: "departments", icon: Building2, label: "Departments", count: settings.departments.length },
    { id: "positions", icon: Briefcase, label: "Positions", count: settings.positions.length },
    { id: "ranks", icon: Award, label: "Ranks", count: settings.ranks.length },
    { id: "branches", icon: Landmark, label: "Branches", count: settings.branches.length },
    { id: "comp", icon: CreditCard, label: "Compensation", count: settings.comp.length },
    { id: "kpis", icon: Target, label: "KPI Structure", count: settings.kpis.length },
    { id: "accounts", icon: KeyRound, label: "Accounts", count: settings.accounts.length },
    { id: "contractTypes", icon: FileText, label: "Contract Types", count: settings.contractTypes.length },
  ];

  const del = (key: string, id: string) => { setSettings((p: any) => ({ ...p, [key]: p[key].filter((i: any) => i.id !== id) })); setToast("Removed"); };

  // ─── DEPARTMENTS (fix #2: stays open) ───
  function DeptSec() {
    const [ex, setEx] = useState<Record<string, boolean>>({});
    const [at, setAt] = useState<string | null>(null);
    const [sn, setSn] = useState("");
    const tog = (id: string) => setEx(p => ({ ...p, [id]: !p[id] }));
    const addS = (did: string) => {
      if (!sn.trim()) return;
      setSettings(p => ({ ...p, departments: p.departments.map(d => d.id === did ? { ...d, subs: [...d.subs, { id: generateId("sd"), name: sn.trim() }] } : d) }));
      setSn(""); setAt(null); setToast("Sub-department added");
      // Keep dept open — don't change ex state
    };
    const remS = (did: string, sid: string) => {
      setSettings(p => ({ ...p, departments: p.departments.map(d => d.id === did ? { ...d, subs: d.subs.filter(s => s.id !== sid) } : d) }));
      setToast("Sub-department removed");
      // Keep dept open — don't change ex state
    };
    return <div>{settings.departments.map(d => (
      <div key={d.id} style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, marginBottom: 8, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer" }} onClick={() => tog(d.id)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><FolderTree size={18} color={t.accent} /><span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{d.name}</span><span style={{ fontSize: 12, color: t.textTertiary, background: t.bg, padding: "2px 8px", borderRadius: 10 }}>{d.subs.length} sub</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={e => { e.stopPropagation(); del("departments", d.id); }} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = t.dangerLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Trash2 size={14} color={t.danger} /></button>
            {ex[d.id] ? <ChevronUp size={16} color={t.textTertiary} /> : <ChevronDown size={16} color={t.textTertiary} />}
          </div>
        </div>
        {ex[d.id] && <div style={{ borderTop: `1px solid ${t.borderLight}`, padding: "12px 18px 14px", background: t.bg }}>
          {d.subs.map(s => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, marginBottom: 4 }} onMouseEnter={e => e.currentTarget.style.background = t.surface} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><GitBranch size={14} color={t.textTertiary} /><span style={{ fontSize: 13, color: t.text }}>{s.name}</span></div>
              <button onClick={() => remS(d.id, s.id)} style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }} onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.background = t.dangerLight; }} onMouseLeave={e => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.background = "transparent"; }}><X size={12} color={t.danger} /></button>
            </div>
          ))}
          {at === d.id ? (
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input value={sn} onChange={e => setSn(e.target.value)} placeholder="Sub-department name" autoFocus onKeyDown={e => { if (e.key === "Enter") addS(d.id); if (e.key === "Escape") { setAt(null); setSn(""); } }} style={{ flex: 1, padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.accent}`, fontSize: 13, outline: "none", background: t.inputBg, color: t.text }} />
              <Btn sm onClick={() => addS(d.id)} icon={Check}>Add</Btn>
              <Btn sm variant="ghost" onClick={() => { setAt(null); setSn(""); }}>Cancel</Btn>
            </div>
          ) : (
            <button onClick={e => { e.stopPropagation(); setAt(d.id); setSn(""); }} style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, padding: "8px 12px", borderRadius: 8, border: `1px dashed ${t.border}`, background: "transparent", cursor: "pointer", fontSize: 13, color: t.accent, fontWeight: 500, width: "100%" }}><Plus size={14} /> Add Sub-Department</button>
          )}
        </div>}
      </div>
    ))}</div>;
  }

  function Lst({ items, k, cols, render }: any) {
    return <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, overflow: "hidden" }}>{items.map((it: any, i: number) => (
      <div key={it.id} style={{ display: "grid", gridTemplateColumns: cols, padding: "12px 18px", borderBottom: i < items.length - 1 ? `1px solid ${t.borderLight}` : "none", alignItems: "center", gap: 8 }} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
        {render(it)}
        <div style={{ display: "flex", justifyContent: "flex-end" }}><button onClick={() => del(k, it.id)} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = t.dangerLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Trash2 size={14} color={t.danger} /></button></div>
      </div>
    ))}</div>;
  }

  // ─── ADD MODAL (fixes #3 #4 #5 #6) ───
  function AMod() {
    const [f, sF] = useState<Record<string, any>>(sec === "comp" || sec === "kpis" ? { scope: "position_rank", sv: "", sv2: "" } : {});
    const u = (k: string, v: any) => sF(p => ({ ...p, [k]: v }));
    const selD = settings.departments.find(d => d.name === f.dept);
    const subO = selD ? selD.subs.map(s => s.name) : [];
    const setCo = (v: string) => { const tz = getTimezone(v); sF(p => ({ ...p, country: v, tz: tz || p.tz || "" })); };
    const save = () => {
      if (!f.name) return;
      if (sec === "departments") { setSettings(p => ({ ...p, departments: [...p.departments, { id: generateId("d"), name: f.name, subs: [] }] })); }
      else { setSettings(p => ({ ...p, [sec]: [...(p as any)[sec], { id: generateId(sec[0]), ...f }] })); }
      setModal(false); setToast("Added successfully");
    };
    const titles: Record<string, string> = { departments: "Add Department", positions: "Add Position", ranks: "Add Rank", branches: "Add Branch", comp: "Add Compensation", kpis: "Add KPI", accounts: "Add Account", contractTypes: "Add Contract Type" };
    const posN = settings.positions.map(p => p.name);
    const rkN = settings.ranks.map(r => r.name);
    const empN = ["Sarah Chen", "Marcus Williams", "Priya Patel", "James O'Brien", "Aisha Mohammed", "Tom Fischer", "Elena Rodriguez", "Kai Nakamura", "Diana Costa", "Alex Thompson"];
    const scopeOpts = [{ value: "position_rank", label: "Per Position & Rank" }, { value: "employee", label: "Per Employee" }];

    return (
      <Modal title={titles[sec]} onClose={() => setModal(false)} wide={sec === "comp" || sec === "kpis"}>
        <FormField label="Name" required><Input value={f.name || ""} onChange={v => u("name", v)} placeholder="Enter name" /></FormField>
        {sec === "positions" && <><FormField label="Department" required><Select value={f.dept || ""} onChange={v => { u("dept", v); u("sub", ""); }} options={settings.departments.map(d => d.name)} placeholder="Select department" /></FormField><FormField label="Sub-Department" required><Select value={f.sub || ""} onChange={v => u("sub", v)} options={subO} placeholder={f.dept ? "Select sub-department" : "Select department first"} /></FormField></>}
        {sec === "ranks" && <><FormField label="Level" required><Input type="number" value={f.level || ""} onChange={v => u("level", parseInt(v))} placeholder="1-10" /></FormField><FormField label="Color"><Input value={f.color || "#2D5BFF"} onChange={v => u("color", v)} placeholder="#hex" /></FormField></>}
        {sec === "branches" && <><FormField label="Address"><Input value={f.address || ""} onChange={v => u("address", v)} placeholder="Address" /></FormField><FormField label="Country" required><Input value={f.country || ""} onChange={v => setCo(v)} placeholder="e.g. USA, UK, Germany" /></FormField><FormField label="Timezone (UTC)"><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Input value={f.tz || ""} onChange={v => u("tz", v)} placeholder="Auto from country" disabled={!!getTimezone(f.country)} />{f.tz && <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, fontSize: 13, fontWeight: 600, color: t.accent }}><Globe size={14} />{f.tz}</span>}{f.tz && getLiveTime(f.tz) && <span style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0, fontSize: 12, color: t.textSecondary }}><Clock size={12} />{getLiveTime(f.tz)}</span>}</div>{f.country && getTimezone(f.country) ? <span style={{ fontSize: 11, color: t.success, marginTop: 4, display: "block" }}>Auto-detected from {f.country}</span> : f.country && f.country !== "Global" ? <span style={{ fontSize: 11, color: t.warning, marginTop: 4, display: "block" }}>Unknown — enter manually</span> : null}</FormField><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}><span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Headquarters</span><Toggle checked={f.isHQ || false} onChange={v => u("isHQ", v)} /></div></>}
        {(sec === "comp" || sec === "kpis") && <>
          {sec === "comp" && <FormField label="Type" required><Select value={f.type || ""} onChange={v => u("type", v)} options={["fixed", "variable", "equity", "benefit"]} placeholder="Select type" /></FormField>}
          {sec === "kpis" && <><FormField label="Category" required><Select value={f.cat || ""} onChange={v => u("cat", v)} options={["Financial", "Customer", "Productivity", "Quality", "HR", "Operations"]} placeholder="Category" /></FormField><FormField label="Unit"><Input value={f.unit || ""} onChange={v => u("unit", v)} placeholder="e.g. $, %, score" /></FormField></>}
          <FormField label="Description"><Input value={f.desc || ""} onChange={v => u("desc", v)} placeholder="Description" /></FormField>
          <FormField label="Applies To" required><Select value={f.scope || "position_rank"} onChange={v => { u("scope", v); u("sv", ""); u("sv2", ""); }} options={scopeOpts} /></FormField>
          {f.scope === "position_rank" && <><FormField label="Position"><Select value={f.sv || ""} onChange={v => u("sv", v)} options={posN} placeholder="Select position (blank = all)" /></FormField><FormField label="Rank"><Select value={f.sv2 || ""} onChange={v => u("sv2", v)} options={rkN} placeholder="Select rank (blank = all)" /></FormField></>}
          {f.scope === "employee" && <FormField label="Employee"><Select value={f.sv || ""} onChange={v => u("sv", v)} options={empN} placeholder="Select employee" /></FormField>}
          {sec === "comp" && <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0" }}><span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Required</span><Toggle checked={f.req || false} onChange={v => u("req", v)} /></div>}
        </>}
        {sec === "accounts" && <><FormField label="Provider" required><Input value={f.prov || ""} onChange={v => u("prov", v)} placeholder="e.g. Google, Slack" /></FormField><div style={{ display: "flex", gap: 24, padding: "8px 0" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Required</span><Toggle checked={f.req || false} onChange={v => u("req", v)} /></div><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>Auto-Provision</span><Toggle checked={f.auto || false} onChange={v => u("auto", v)} /></div></div></>}
        {sec === "contractTypes" && <><FormField label="Description"><Input value={f.desc || ""} onChange={v => u("desc", v)} placeholder="Description" /></FormField><FormField label="Duration"><Input value={f.duration || ""} onChange={v => u("duration", v)} placeholder="e.g. Indefinite, Fixed, 3-6 months" /></FormField><FormField label="Color"><Input value={f.color || "#2D5BFF"} onChange={v => u("color", v)} placeholder="#hex" /></FormField></>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.border}` }}><Btn variant="secondary" onClick={() => setModal(false)}>Cancel</Btn><Btn onClick={save} icon={Plus}>Add</Btn></div>
      </Modal>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ width: 250, flexShrink: 0 }}>
          <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 8, position: "sticky" as const, top: 32 }}>
            {sections.map(s => { const a = sec === s.id; return (
              <button key={s.id} onClick={() => setSec(s.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, background: a ? t.accentLight : "transparent", border: "none", cursor: "pointer", width: "100%", textAlign: "left" as const, transition: "all 0.15s" }} onMouseEnter={e => { if (!a) e.currentTarget.style.background = t.surfaceHover; }} onMouseLeave={e => { if (!a) e.currentTarget.style.background = "transparent"; }}>
                <s.icon size={18} color={a ? t.accent : t.textTertiary} strokeWidth={1.8} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: a ? 600 : 500, color: a ? t.accent : t.text }}>{s.label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: a ? t.accent : t.textTertiary, background: a ? t.accent + "15" : t.bg, padding: "2px 7px", borderRadius: 6 }}>{s.count}</span>
              </button>); })}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>{sections.find(s => s.id === sec)?.label}</h2><Btn onClick={() => setModal(true)} icon={Plus}>Add New</Btn></div>

          {sec === "departments" && <DeptSec />}
          {sec === "positions" && <Lst items={settings.positions} k="positions" cols="1fr 1fr 1fr 48px" render={(it: any) => <><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{it.name}</span><span style={{ fontSize: 13, color: t.textSecondary }}>{it.dept}</span><span style={{ fontSize: 12, color: t.purple, background: t.purpleLight, padding: "2px 8px", borderRadius: 6, justifySelf: "start" }}>{it.sub || "—"}</span></>} />}
          {sec === "ranks" && <Lst items={settings.ranks} k="ranks" cols="1fr 80px 60px 48px" render={(it: any) => <><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{it.name}</span><span style={{ fontSize: 13, color: t.textSecondary }}>Level {it.level}</span><div style={{ width: 20, height: 20, borderRadius: 6, background: it.color, border: `1px solid ${t.border}` }} /></>} />}
          {sec === "branches" && <Lst items={settings.branches} k="branches" cols="1fr 90px 130px 48px" render={(it: any) => { const lt = getLiveTime(it.tz); return <><div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{it.name}</span>{it.isHQ && <span style={{ fontSize: 10, fontWeight: 700, color: t.accent, background: t.accentLight, padding: "2px 6px", borderRadius: 4 }}>HQ</span>}</div><span style={{ fontSize: 12, color: t.textTertiary }}>{it.address}</span></div><span style={{ fontSize: 13, color: t.textSecondary }}>{it.country}</span><div><span style={{ fontSize: 13, fontWeight: 600, color: t.accent, display: "flex", alignItems: "center", gap: 4 }}><Globe size={12} />{it.tz}</span>{lt && <span style={{ fontSize: 11, color: t.textTertiary, display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}><Clock size={10} />{lt}</span>}</div></>; }} />}
          {sec === "comp" && <Lst items={settings.comp} k="comp" cols="1fr 80px 150px 60px 48px" render={(it: any) => <><div><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{it.name}</span><div style={{ fontSize: 12, color: t.textTertiary }}>{it.desc}</div></div><span style={{ fontSize: 12, fontWeight: 600, color: typeColors[it.type], background: typeColors[it.type] + "15", padding: "3px 8px", borderRadius: 6, textTransform: "capitalize" as const, justifySelf: "start" }}>{it.type}</span><ScopeBadge scope={it.scope} value={it.sv} value2={it.sv2} /><span>{it.req ? <Check size={16} color={t.success} /> : <span style={{ fontSize: 12, color: t.textTertiary }}>Opt</span>}</span></>} />}
          {sec === "kpis" && <Lst items={settings.kpis} k="kpis" cols="1fr 90px 40px 150px 48px" render={(it: any) => <><div><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{it.name}</span><div style={{ fontSize: 12, color: t.textTertiary }}>{it.desc}</div></div><span style={{ fontSize: 12, color: t.textSecondary, background: t.bg, padding: "3px 8px", borderRadius: 6, justifySelf: "start" }}>{it.cat}</span><span style={{ fontSize: 13, color: t.textSecondary }}>{it.unit}</span><ScopeBadge scope={it.scope} value={it.sv} value2={it.sv2} /></>} />}
          {sec === "accounts" && <Lst items={settings.accounts} k="accounts" cols="1fr 140px 80px 48px" render={(it: any) => <><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{it.name}</span>{it.auto && <span style={{ fontSize: 10, fontWeight: 600, color: t.purple, background: t.purpleLight, padding: "2px 6px", borderRadius: 4 }}>Auto</span>}</div><span style={{ fontSize: 13, color: t.textSecondary }}>{it.prov}</span><span>{it.req ? <Check size={16} color={t.success} /> : <span style={{ fontSize: 12, color: t.textTertiary }}>Opt</span>}</span></>} />}
          {sec === "contractTypes" && <Lst items={settings.contractTypes} k="contractTypes" cols="1fr 120px 100px 48px" render={(it: any) => <><div><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: it.color }} /><span style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{it.name}</span></div><span style={{ fontSize: 12, color: t.textTertiary }}>{it.desc}</span></div><span style={{ fontSize: 12, color: t.textSecondary }}>{it.duration}</span><span style={{ fontSize: 12, fontWeight: 600, color: it.color, background: it.color + "15", padding: "2px 8px", borderRadius: 6 }}>{it.name}</span></>} />}
        </div>
      </div>
      {modal && <AMod />}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
