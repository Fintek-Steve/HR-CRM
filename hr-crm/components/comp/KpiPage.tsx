"use client";
import { useState } from "react";
import { Plus, Trash2, Layers } from "lucide-react";
import { Btn, Input, MiniInput, Select, FormField, Modal, Toast, ScopeBadge } from "@/components/ui/shared";
import { Settings, Tier, generateId } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

export default function KpiPage({ settings, setSettings }: { settings: Settings; setSettings: (fn: (s: Settings) => Settings) => void }) {
  const { theme: t } = useTheme();
  const [addModal, setAddModal] = useState(false);
  const [editTiersId, setEditTiersId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const accentColor = t.purple;

  const del = (id: string) => { setSettings(p => ({ ...p, kpis: p.kpis.filter(i => i.id !== id) })); setToast("Removed"); };

  function TierEditor() {
    if (!editTiersId) return null;
    const item = settings.kpis.find(i => i.id === editTiersId);
    if (!item) return null;
    const tiers: Tier[] = item.tiers || [];
    const basis = item.tierBasis || "";
    const upd = (u: any) => setSettings(p => ({ ...p, kpis: p.kpis.map(i => i.id === editTiersId ? { ...i, ...u } : i) }));
    const addTier = () => { const lm = tiers.length>0?(tiers[tiers.length-1].max??0)+1:0; upd({ tiers: [...tiers, { id: generateId("tr"), min: lm, max: null, label: "", rewardType: "percentage", rewardValue: 10 }] }); };
    const updTier = (tid: string, u: Partial<Tier>) => upd({ tiers: tiers.map(tr => tr.id===tid?{...tr,...u}:tr) });
    const remTier = (tid: string) => upd({ tiers: tiers.filter(tr => tr.id!==tid) });
    return (
      <Modal title={`Tiers — ${item.name}`} onClose={() => setEditTiersId(null)} wide>
        <FormField label="Tiers based on"><Select value={basis} onChange={v => upd({ tierBasis: v })} options={[{ value: "", label: "Default (KPI unit: "+(item.unit||"—")+")" }, ...settings.commissionBases.map(cb => ({ value: cb.name, label: cb.name }))]} /></FormField>
        <div style={{ marginTop:16,marginBottom:8 }}>
          <div style={{ display:"grid",gridTemplateColumns:"65px 10px 65px 1fr 1fr 90px 36px",gap:8,alignItems:"center",marginBottom:8 }}>
            {["From","","To","Label","Reward","Value",""].map((h,i) => <span key={i} style={{ fontSize:11,fontWeight:700,color:t.textTertiary,textTransform:"uppercase" as const }}>{h}</span>)}
          </div>
          {tiers.map((tr,i) => (
            <div key={tr.id} style={{ display:"grid",gridTemplateColumns:"65px 10px 65px 1fr 1fr 90px 36px",gap:8,alignItems:"center",marginBottom:8,padding:"8px 0",borderBottom:i<tiers.length-1?`1px solid ${t.borderLight}`:"none" }}>
              <MiniInput type="number" value={tr.min} onChange={v => updTier(tr.id,{min:parseInt(v)||0})} style={{ textAlign:"center" }} />
              <span style={{ textAlign:"center" as const,color:t.textTertiary,fontSize:13 }}>—</span>
              <MiniInput type="number" value={tr.max??""} onChange={v => updTier(tr.id,{max:v===""?null:parseInt(v)})} placeholder="∞" style={{ textAlign:"center" }} />
              <MiniInput value={tr.label} onChange={v => updTier(tr.id,{label:v})} placeholder="e.g. On target" />
              <Select value={tr.rewardType} onChange={v => updTier(tr.id,{rewardType:v as any})} options={[{value:"none",label:"No reward"},{value:"percentage",label:"% bonus"},{value:"fixed",label:"Fixed ($)"}]} />
              {tr.rewardType!=="none"?<div style={{ display:"flex",alignItems:"center",gap:4 }}><span style={{ color:t.textTertiary,fontSize:13 }}>{tr.rewardType==="percentage"?"%":"$"}</span><MiniInput type="number" value={tr.rewardValue} onChange={v => updTier(tr.id,{rewardValue:parseFloat(v)||0})} style={{ textAlign:"center" }} /></div>:<span style={{ fontSize:12,color:t.textTertiary,textAlign:"center" as const }}>—</span>}
              <button onClick={() => remTier(tr.id)} style={{ width:28,height:28,borderRadius:6,border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }} onMouseEnter={e => e.currentTarget.style.background=t.dangerLight} onMouseLeave={e => e.currentTarget.style.background="transparent"}><Trash2 size={14} color={t.danger} /></button>
            </div>
          ))}
        </div>
        <button onClick={addTier} style={{ display:"flex",alignItems:"center",gap:6,padding:"10px 16px",borderRadius:8,border:`1px dashed ${t.border}`,background:"transparent",cursor:"pointer",fontSize:13,color:t.accent,fontWeight:500,width:"100%" }}><Plus size={14} /> Add Tier</button>
        {tiers.length>0&&<div style={{ marginTop:20,padding:16,borderRadius:12,background:t.bg,border:`1px solid ${t.borderLight}` }}>
          <div style={{ fontSize:12,fontWeight:700,color:t.textTertiary,marginBottom:10,textTransform:"uppercase" as const }}>Preview</div>
          {tiers.map(tr => { const range=tr.max!==null?`${tr.min}–${tr.max}`:`${tr.min}+`; const reward=tr.rewardType==="percentage"?`${tr.rewardValue}% bonus`:tr.rewardType==="fixed"?`$${tr.rewardValue.toLocaleString()}`:"No reward"; const lC=tr.rewardType==="none"?t.textTertiary:tr.rewardType==="percentage"?t.accent:t.success; return <div key={tr.id} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",fontSize:13 }}><span style={{ color:t.textSecondary }}>{range}</span><span style={{ fontWeight:600,color:t.text }}>{tr.label||"—"}</span><span style={{ fontWeight:600,color:lC }}>{reward}</span></div>; })}
        </div>}
        <div style={{ display:"flex",justifyContent:"flex-end",gap:8,marginTop:20,paddingTop:16,borderTop:`1px solid ${t.border}` }}><Btn onClick={() => setEditTiersId(null)}>Done</Btn></div>
      </Modal>
    );
  }

  function AddModal() {
    const [f, sF] = useState<Record<string,any>>({ scope:"position_rank",sv:"",sv2:"",tiers:[],tierBasis:"" });
    const u = (k: string, v: any) => sF(p => ({ ...p, [k]: v }));
    const posN = settings.positions.map(p => p.name); const rkN = settings.ranks.map(r => r.name);
    const empN = ["Sarah Chen","Marcus Williams","Priya Patel","James O'Brien","Aisha Mohammed","Tom Fischer","Elena Rodriguez","Kai Nakamura","Diana Costa","Alex Thompson"];
    const save = () => { if(!f.name) return; setSettings(p => ({ ...p, kpis: [...p.kpis, { id: generateId("k"), tiers:[], tierBasis:"", ...f }] })); setAddModal(false); setToast("Added"); };
    return (<Modal title="Add KPI" onClose={() => setAddModal(false)} wide>
      <FormField label="Name" required><Input value={f.name||""} onChange={v => u("name",v)} placeholder="e.g. Revenue Target" /></FormField>
      <FormField label="Category" required><Select value={f.cat||""} onChange={v => u("cat",v)} options={["Financial","Customer","Productivity","Quality","HR","Operations"]} placeholder="Category" /></FormField>
      <FormField label="Unit"><Input value={f.unit||""} onChange={v => u("unit",v)} placeholder="e.g. $, %, score" /></FormField>
      <FormField label="Description"><Input value={f.desc||""} onChange={v => u("desc",v)} placeholder="Description" /></FormField>
      <FormField label="Applies To" required><Select value={f.scope||"position_rank"} onChange={v => { u("scope",v); u("sv",""); u("sv2",""); }} options={[{value:"position_rank",label:"Per Position & Rank"},{value:"employee",label:"Per Employee"}]} /></FormField>
      {f.scope==="position_rank"&&<><FormField label="Position"><Select value={f.sv||""} onChange={v => u("sv",v)} options={posN} placeholder="All positions" /></FormField><FormField label="Rank"><Select value={f.sv2||""} onChange={v => u("sv2",v)} options={rkN} placeholder="All ranks" /></FormField></>}
      {f.scope==="employee"&&<FormField label="Employee"><Select value={f.sv||""} onChange={v => u("sv",v)} options={empN} placeholder="Select employee" /></FormField>}
      <div style={{ padding:"12px 16px",borderRadius:10,background:t.purpleLight,border:`1px solid ${t.purple}30`,marginTop:8 }}><div style={{ fontSize:13,fontWeight:600,color:t.purple,marginBottom:4 }}>Tiers</div><div style={{ fontSize:12,color:t.textSecondary }}>Save first, then click the tiers icon to configure performance tiers.</div></div>
      <div style={{ display:"flex",justifyContent:"flex-end",gap:8,marginTop:20,paddingTop:16,borderTop:`1px solid ${t.border}` }}><Btn variant="secondary" onClick={() => setAddModal(false)}>Cancel</Btn><Btn onClick={save} icon={Plus}>Add</Btn></div>
    </Modal>);
  }

  return <div style={{ padding:32,maxWidth:1100,margin:"0 auto" }}>
    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}><div><h2 style={{ fontSize:18,fontWeight:700,color:t.text,margin:0 }}>KPI Structure</h2><p style={{ fontSize:13,color:t.textTertiary,margin:"4px 0 0" }}>{settings.kpis.length} KPIs configured</p></div><Btn onClick={() => setAddModal(true)} icon={Plus}>Add KPI</Btn></div>
    <div style={{ background:t.surface,borderRadius:12,border:`1px solid ${t.border}`,overflow:"hidden" }}>
      {settings.kpis.map((it,i) => (
        <div key={it.id} style={{ padding:"12px 18px",borderBottom:i<settings.kpis.length-1?`1px solid ${t.borderLight}`:"none" }} onMouseEnter={e => e.currentTarget.style.background=t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ flex:1,minWidth:0 }}><div style={{ display:"flex",alignItems:"center",gap:8 }}><span style={{ fontSize:14,fontWeight:550,color:t.text }}>{it.name}</span>{it.tiers&&it.tiers.length>0&&<span style={{ display:"flex",alignItems:"center",gap:3,fontSize:10,fontWeight:700,color:accentColor,background:accentColor+"15",padding:"2px 6px",borderRadius:4 }}><Layers size={10} />{it.tiers.length} tiers</span>}</div><div style={{ fontSize:12,color:t.textTertiary }}>{it.desc}</div></div>
            <span style={{ fontSize:12,color:t.textSecondary,background:t.bg,padding:"3px 8px",borderRadius:6,flexShrink:0 }}>{it.cat}</span>
            <span style={{ fontSize:13,color:t.textSecondary,flexShrink:0 }}>{it.unit}</span>
            <ScopeBadge scope={it.scope} value={it.sv} value2={it.sv2} />
            <button onClick={() => setEditTiersId(it.id)} style={{ width:32,height:32,borderRadius:8,border:`1px solid ${it.tiers&&it.tiers.length>0?accentColor+"40":t.border}`,background:it.tiers&&it.tiers.length>0?accentColor+"15":"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }} title="Edit tiers"><Layers size={14} color={accentColor} /></button>
            <button onClick={() => del(it.id)} style={{ width:28,height:28,borderRadius:6,border:"none",background:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }} onMouseEnter={e => e.currentTarget.style.background=t.dangerLight} onMouseLeave={e => e.currentTarget.style.background="transparent"}><Trash2 size={14} color={t.danger} /></button>
          </div>
          {it.tiers&&it.tiers.length>0&&<div style={{ marginTop:8,padding:"8px 12px",borderRadius:8,background:t.bg,display:"flex",gap:8,flexWrap:"wrap" as const }}>
            {it.tiers.map((tr: Tier) => { const range=tr.max!==null?`${tr.min}–${tr.max}`:`${tr.min}+`; const reward=tr.rewardType==="percentage"?`${tr.rewardValue}%`:tr.rewardType==="fixed"?`$${tr.rewardValue.toLocaleString()}`:""; const lC=tr.rewardType==="none"?t.textTertiary:tr.rewardType==="percentage"?t.accent:t.success; return <span key={tr.id} style={{ fontSize:11,color:t.textSecondary,background:t.surface,padding:"3px 8px",borderRadius:6,border:`1px solid ${t.borderLight}` }}>{range}: <span style={{ fontWeight:600,color:t.text }}>{tr.label||"—"}</span>{reward&&<span style={{ color:lC,marginLeft:4 }}>{reward}</span>}</span>; })}
          </div>}
        </div>
      ))}
    </div>
    {addModal&&<AddModal />}
    {editTiersId&&<TierEditor />}
    {toast&&<Toast message={toast} onClose={() => setToast(null)} />}
  </div>;
}
