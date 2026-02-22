"use client";
import { useState, useMemo } from "react";
import { Megaphone, Users, UserCheck, Send, GraduationCap, UserPlus, TrendingUp, TrendingDown, Minus, Filter, AlertCircle, FileText, Mail, UserCog, Eye, Calendar } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

// ─── PER-AD PIPELINE DATA (current period + previous period) ───
const recruiters = ["Rachel Green", "Tom Fischer", "Diana Costa"];

interface AdPipeline {
  id: string; title: string; recruiter: string; cost: number; status: "active" | "paused" | "closed";
  curr: { cand: number; screened: number; intSched: number; intArr: number; offerSent: number; offerAcc: number; trSched: number; trArr: number; hired: number; costPerHire: number; };
  prev: { cand: number; screened: number; intSched: number; intArr: number; offerSent: number; offerAcc: number; trSched: number; trArr: number; hired: number; costPerHire: number; };
}

const adsPipeline: Record<string, AdPipeline[]> = {
  week: [
    { id:"ad1", title:"Senior Frontend Developer", recruiter:"Rachel Green", cost:320, status:"active",
      curr:{ cand:12, screened:8, intSched:5, intArr:4, offerSent:1, offerAcc:1, trSched:1, trArr:1, hired:1, costPerHire:950 },
      prev:{ cand:9, screened:6, intSched:4, intArr:3, offerSent:1, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 }},
    { id:"ad2", title:"Sales Manager", recruiter:"Tom Fischer", cost:210, status:"active",
      curr:{ cand:18, screened:10, intSched:7, intArr:5, offerSent:2, offerAcc:1, trSched:1, trArr:1, hired:0, costPerHire:0 },
      prev:{ cand:14, screened:8, intSched:5, intArr:4, offerSent:1, offerAcc:1, trSched:1, trArr:0, hired:0, costPerHire:0 }},
    { id:"ad3", title:"UX Designer", recruiter:"Rachel Green", cost:180, status:"active",
      curr:{ cand:8, screened:3, intSched:2, intArr:2, offerSent:0, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 },
      prev:{ cand:5, screened:2, intSched:1, intArr:1, offerSent:0, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 }},
    { id:"ad4", title:"DevOps Engineer", recruiter:"Diana Costa", cost:250, status:"active",
      curr:{ cand:15, screened:9, intSched:6, intArr:5, offerSent:2, offerAcc:1, trSched:1, trArr:1, hired:1, costPerHire:1100 },
      prev:{ cand:11, screened:7, intSched:4, intArr:3, offerSent:1, offerAcc:1, trSched:1, trArr:1, hired:1, costPerHire:1200 }},
    { id:"ad5", title:"Product Manager", recruiter:"Rachel Green", cost:0, status:"paused",
      curr:{ cand:3, screened:2, intSched:1, intArr:1, offerSent:0, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 },
      prev:{ cand:6, screened:4, intSched:2, intArr:2, offerSent:1, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 }},
    { id:"ad6", title:"Data Analyst", recruiter:"Tom Fischer", cost:0, status:"closed",
      curr:{ cand:0, screened:0, intSched:0, intArr:0, offerSent:0, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 },
      prev:{ cand:2, screened:2, intSched:1, intArr:1, offerSent:1, offerAcc:1, trSched:1, trArr:1, hired:1, costPerHire:850 }},
    { id:"ad7", title:"HR Coordinator", recruiter:"Diana Costa", cost:110, status:"active",
      curr:{ cand:6, screened:4, intSched:3, intArr:2, offerSent:1, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 },
      prev:{ cand:3, screened:1, intSched:0, intArr:0, offerSent:0, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 }},
  ],
  month: [
    { id:"ad1", title:"Senior Frontend Developer", recruiter:"Rachel Green", cost:1200, status:"active",
      curr:{ cand:42, screened:30, intSched:18, intArr:15, offerSent:4, offerAcc:3, trSched:3, trArr:2, hired:2, costPerHire:920 },
      prev:{ cand:35, screened:25, intSched:14, intArr:11, offerSent:3, offerAcc:2, trSched:2, trArr:2, hired:2, costPerHire:1050 }},
    { id:"ad2", title:"Sales Manager", recruiter:"Tom Fischer", cost:800, status:"active",
      curr:{ cand:55, screened:35, intSched:22, intArr:17, offerSent:5, offerAcc:3, trSched:3, trArr:2, hired:1, costPerHire:1400 },
      prev:{ cand:48, screened:30, intSched:18, intArr:15, offerSent:4, offerAcc:3, trSched:2, trArr:2, hired:2, costPerHire:1100 }},
    { id:"ad3", title:"UX Designer", recruiter:"Rachel Green", cost:600, status:"active",
      curr:{ cand:28, screened:12, intSched:8, intArr:6, offerSent:2, offerAcc:1, trSched:1, trArr:1, hired:0, costPerHire:0 },
      prev:{ cand:18, screened:10, intSched:5, intArr:4, offerSent:1, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 }},
    { id:"ad4", title:"DevOps Engineer", recruiter:"Diana Costa", cost:950, status:"active",
      curr:{ cand:38, screened:28, intSched:16, intArr:13, offerSent:4, offerAcc:3, trSched:2, trArr:2, hired:2, costPerHire:1050 },
      prev:{ cand:30, screened:22, intSched:12, intArr:10, offerSent:3, offerAcc:2, trSched:2, trArr:1, hired:1, costPerHire:1300 }},
    { id:"ad5", title:"Product Manager", recruiter:"Rachel Green", cost:0, status:"paused",
      curr:{ cand:10, screened:7, intSched:4, intArr:3, offerSent:1, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 },
      prev:{ cand:22, screened:15, intSched:8, intArr:7, offerSent:3, offerAcc:1, trSched:1, trArr:1, hired:1, costPerHire:1500 }},
    { id:"ad6", title:"Data Analyst", recruiter:"Tom Fischer", cost:0, status:"closed",
      curr:{ cand:0, screened:0, intSched:0, intArr:0, offerSent:0, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 },
      prev:{ cand:15, screened:12, intSched:8, intArr:7, offerSent:3, offerAcc:2, trSched:2, trArr:2, hired:2, costPerHire:800 }},
    { id:"ad7", title:"HR Coordinator", recruiter:"Diana Costa", cost:400, status:"active",
      curr:{ cand:20, screened:14, intSched:9, intArr:7, offerSent:2, offerAcc:1, trSched:1, trArr:1, hired:1, costPerHire:880 },
      prev:{ cand:8, screened:4, intSched:2, intArr:1, offerSent:0, offerAcc:0, trSched:0, trArr:0, hired:0, costPerHire:0 }},
  ],
  quarter: [
    { id:"ad1", title:"Senior Frontend Developer", recruiter:"Rachel Green", cost:3200, status:"active",
      curr:{ cand:120, screened:90, intSched:52, intArr:44, offerSent:12, offerAcc:9, trSched:8, trArr:7, hired:6, costPerHire:880 },
      prev:{ cand:95, screened:70, intSched:40, intArr:32, offerSent:9, offerAcc:6, trSched:5, trArr:4, hired:4, costPerHire:1020 }},
    { id:"ad2", title:"Sales Manager", recruiter:"Tom Fischer", cost:2400, status:"active",
      curr:{ cand:160, screened:100, intSched:65, intArr:50, offerSent:15, offerAcc:10, trSched:8, trArr:6, hired:5, costPerHire:1250 },
      prev:{ cand:130, screened:85, intSched:50, intArr:40, offerSent:12, offerAcc:8, trSched:6, trArr:5, hired:4, costPerHire:1400 }},
    { id:"ad3", title:"UX Designer", recruiter:"Rachel Green", cost:1800, status:"active",
      curr:{ cand:75, screened:40, intSched:22, intArr:18, offerSent:5, offerAcc:3, trSched:3, trArr:2, hired:2, costPerHire:1100 },
      prev:{ cand:50, screened:28, intSched:14, intArr:11, offerSent:3, offerAcc:1, trSched:1, trArr:1, hired:1, costPerHire:1500 }},
    { id:"ad4", title:"DevOps Engineer", recruiter:"Diana Costa", cost:2800, status:"active",
      curr:{ cand:100, screened:75, intSched:45, intArr:38, offerSent:10, offerAcc:8, trSched:7, trArr:6, hired:5, costPerHire:980 },
      prev:{ cand:80, screened:60, intSched:35, intArr:28, offerSent:8, offerAcc:5, trSched:4, trArr:3, hired:3, costPerHire:1200 }},
    { id:"ad5", title:"Product Manager", recruiter:"Rachel Green", cost:1100, status:"paused",
      curr:{ cand:35, screened:25, intSched:14, intArr:12, offerSent:4, offerAcc:2, trSched:2, trArr:1, hired:1, costPerHire:1600 },
      prev:{ cand:60, screened:42, intSched:24, intArr:20, offerSent:8, offerAcc:4, trSched:3, trArr:3, hired:3, costPerHire:1400 }},
    { id:"ad6", title:"Data Analyst", recruiter:"Tom Fischer", cost:500, status:"closed",
      curr:{ cand:15, screened:12, intSched:8, intArr:7, offerSent:3, offerAcc:2, trSched:2, trArr:2, hired:2, costPerHire:800 },
      prev:{ cand:40, screened:30, intSched:18, intArr:15, offerSent:5, offerAcc:4, trSched:3, trArr:3, hired:3, costPerHire:750 }},
    { id:"ad7", title:"HR Coordinator", recruiter:"Diana Costa", cost:1200, status:"active",
      curr:{ cand:55, screened:40, intSched:25, intArr:20, offerSent:6, offerAcc:4, trSched:3, trArr:3, hired:3, costPerHire:900 },
      prev:{ cand:25, screened:15, intSched:8, intArr:6, offerSent:2, offerAcc:1, trSched:1, trArr:0, hired:0, costPerHire:0 }},
  ],
  year: [
    { id:"ad1", title:"Senior Frontend Developer", recruiter:"Rachel Green", cost:12000, status:"active",
      curr:{ cand:450, screened:340, intSched:200, intArr:170, offerSent:45, offerAcc:35, trSched:30, trArr:26, hired:24, costPerHire:850 },
      prev:{ cand:380, screened:280, intSched:160, intArr:130, offerSent:38, offerAcc:28, trSched:24, trArr:20, hired:18, costPerHire:950 }},
    { id:"ad2", title:"Sales Manager", recruiter:"Tom Fischer", cost:9500, status:"active",
      curr:{ cand:600, screened:380, intSched:240, intArr:190, offerSent:55, offerAcc:38, trSched:30, trArr:24, hired:20, costPerHire:1200 },
      prev:{ cand:500, screened:320, intSched:200, intArr:160, offerSent:48, offerAcc:32, trSched:25, trArr:20, hired:16, costPerHire:1350 }},
    { id:"ad3", title:"UX Designer", recruiter:"Rachel Green", cost:7200, status:"active",
      curr:{ cand:280, screened:160, intSched:90, intArr:72, offerSent:20, offerAcc:14, trSched:12, trArr:10, hired:8, costPerHire:1050 },
      prev:{ cand:200, screened:110, intSched:60, intArr:48, offerSent:14, offerAcc:8, trSched:7, trArr:5, hired:4, costPerHire:1400 }},
    { id:"ad4", title:"DevOps Engineer", recruiter:"Diana Costa", cost:11000, status:"active",
      curr:{ cand:380, screened:290, intSched:170, intArr:145, offerSent:40, offerAcc:30, trSched:26, trArr:22, hired:20, costPerHire:950 },
      prev:{ cand:300, screened:220, intSched:130, intArr:105, offerSent:30, offerAcc:20, trSched:18, trArr:14, hired:12, costPerHire:1150 }},
    { id:"ad5", title:"Product Manager", recruiter:"Rachel Green", cost:4400, status:"paused",
      curr:{ cand:140, screened:100, intSched:55, intArr:45, offerSent:15, offerAcc:8, trSched:7, trArr:5, hired:4, costPerHire:1500 },
      prev:{ cand:180, screened:130, intSched:70, intArr:58, offerSent:20, offerAcc:12, trSched:10, trArr:8, hired:7, costPerHire:1350 }},
    { id:"ad6", title:"Data Analyst", recruiter:"Tom Fischer", cost:2000, status:"closed",
      curr:{ cand:60, screened:48, intSched:30, intArr:26, offerSent:10, offerAcc:8, trSched:7, trArr:6, hired:6, costPerHire:780 },
      prev:{ cand:90, screened:68, intSched:42, intArr:35, offerSent:15, offerAcc:10, trSched:8, trArr:7, hired:6, costPerHire:820 }},
    { id:"ad7", title:"HR Coordinator", recruiter:"Diana Costa", cost:4800, status:"active",
      curr:{ cand:200, screened:150, intSched:95, intArr:78, offerSent:22, offerAcc:16, trSched:14, trArr:12, hired:10, costPerHire:870 },
      prev:{ cand:100, screened:60, intSched:35, intArr:28, offerSent:8, offerAcc:5, trSched:4, trArr:3, hired:2, costPerHire:1100 }},
  ],
};

const allPendingActions = [
  { id:1, cat:"ad_review", icon:Megaphone, title:"Senior Frontend Developer", desc:"Ad performance review — 14 days active, 12 candidates", urgency:"high", assignee:"Rachel Green", adId:"ad1", date:"2026-02-20" },
  { id:2, cat:"ad_review", icon:Megaphone, title:"Sales Manager", desc:"Ad budget 80% spent — decision needed on renewal", urgency:"high", assignee:"Tom Fischer", adId:"ad2", date:"2026-02-19" },
  { id:3, cat:"screen", icon:Users, title:"5 candidates unscreened", desc:"UX Designer (3) & DevOps Engineer (2) — applied 3+ days ago", urgency:"high", assignee:"Rachel Green", adId:"ad3", date:"2026-02-18" },
  { id:4, cat:"screen", icon:Users, title:"Interview no-shows follow-up", desc:"2 candidates didn't arrive to scheduled interview", urgency:"medium", assignee:"Diana Costa", adId:"ad4", date:"2026-02-21" },
  { id:5, cat:"offer", icon:Send, title:"Offer pending response", desc:"Marcus Webb — Sales Manager offer sent 5 days ago", urgency:"high", assignee:"Tom Fischer", adId:"ad2", date:"2026-02-17" },
  { id:6, cat:"offer", icon:Send, title:"Offer pending response", desc:"Lena Park — Frontend Developer, sent 2 days ago", urgency:"low", assignee:"Rachel Green", adId:"ad1", date:"2026-02-20" },
  { id:7, cat:"trainee", icon:GraduationCap, title:"Create user accounts", desc:"3 new trainees starting next week — accounts not created", urgency:"high", assignee:"Diana Costa", adId:"ad4", date:"2026-02-22" },
  { id:8, cat:"docs", icon:FileText, title:"Missing documents", desc:"James O'Brien — ID copy & signed contract not uploaded", urgency:"medium", assignee:"Rachel Green", adId:"", date:"2026-02-15" },
  { id:9, cat:"docs", icon:FileText, title:"Missing documents", desc:"Aisha Mohammed — Work permit expiring in 30 days", urgency:"high", assignee:"Diana Costa", adId:"", date:"2026-02-10" },
  { id:10, cat:"request", icon:Mail, title:"Employee request", desc:"Priya Patel — Equipment request pending 4 days", urgency:"medium", assignee:"Rachel Green", adId:"", date:"2026-02-18" },
  { id:11, cat:"request", icon:Mail, title:"Employee request", desc:"Kai Nakamura — WFH policy clarification", urgency:"low", assignee:"Tom Fischer", adId:"", date:"2026-02-21" },
];

const periodOpts = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
];

const catOpts = [
  { value: "all", label: "All" },
  { value: "ad_review", label: "Ad Review" },
  { value: "screen", label: "Screening" },
  { value: "offer", label: "Offers" },
  { value: "trainee", label: "Trainees" },
  { value: "docs", label: "Documents" },
  { value: "request", label: "Requests" },
];

export default function DashboardPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const { theme: t } = useTheme();
  const [period, setPeriod] = useState("month");
  const [filterAd, setFilterAd] = useState("");
  const [filterRecruiter, setFilterRecruiter] = useState("");
  const [actionCat, setActionCat] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // ─── AGGREGATE FILTERED DATA ───
  const { curr, prev: prv, activeAds, totalCost } = useMemo(() => {
    const allAds = adsPipeline[period] || adsPipeline.month;
    const filtered = allAds.filter(a => {
      if (filterAd && a.id !== filterAd) return false;
      if (filterRecruiter && a.recruiter !== filterRecruiter) return false;
      return true;
    });
    const activeCount = filtered.filter(a => a.status === "active").length;
    const cost = filtered.reduce((s, a) => s + a.cost, 0);
    const sum = (key: string, which: "curr" | "prev") => filtered.reduce((s, a) => s + (a[which] as any)[key], 0);
    const avgNonZero = (key: string, which: "curr" | "prev") => {
      const vals = filtered.map(a => (a[which] as any)[key]).filter((v: number) => v > 0);
      return vals.length > 0 ? Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length) : 0;
    };
    return {
      activeAds: activeCount, totalCost: cost,
      curr: { cand: sum("cand","curr"), screened: sum("screened","curr"), intSched: sum("intSched","curr"), intArr: sum("intArr","curr"), offerSent: sum("offerSent","curr"), offerAcc: sum("offerAcc","curr"), trSched: sum("trSched","curr"), trArr: sum("trArr","curr"), hired: sum("hired","curr"), costPerHire: avgNonZero("costPerHire","curr") },
      prev: { cand: sum("cand","prev"), screened: sum("screened","prev"), intSched: sum("intSched","prev"), intArr: sum("intArr","prev"), offerSent: sum("offerSent","prev"), offerAcc: sum("offerAcc","prev"), trSched: sum("trSched","prev"), trArr: sum("trArr","prev"), hired: sum("hired","prev"), costPerHire: avgNonZero("costPerHire","prev") },
    };
  }, [period, filterAd, filterRecruiter]);

  const prevActiveAds = useMemo(() => {
    const allAds = adsPipeline[period] || adsPipeline.month;
    return allAds.filter(a => {
      if (filterAd && a.id !== filterAd) return false;
      if (filterRecruiter && a.recruiter !== filterRecruiter) return false;
      return a.status === "active";
    }).length;
  }, [period, filterAd, filterRecruiter]);

  // ─── FILTER PENDING ACTIONS ───
  const fActions = useMemo(() => {
    let list = allPendingActions;
    if (filterRecruiter) list = list.filter(a => a.assignee === filterRecruiter);
    if (filterAd) list = list.filter(a => a.adId === filterAd || a.adId === "");
    if (actionCat !== "all") list = list.filter(a => a.cat === actionCat);
    return list;
  }, [filterRecruiter, filterAd, actionCat]);

  const adOptions = useMemo(() => {
    const allAds = adsPipeline[period] || adsPipeline.month;
    let filtered = allAds;
    if (filterRecruiter) filtered = filtered.filter(a => a.recruiter === filterRecruiter);
    return filtered;
  }, [period, filterRecruiter]);

  const pct = (c: number, p: number) => { if (p === 0) return c > 0 ? 100 : 0; return Math.round(((c - p) / p) * 100); };

  function Chg({ c, p, inv }: { c: number; p: number; inv?: boolean }) {
    const v = pct(c, p); const up = v > 0; const good = inv ? !up : up;
    const col = v === 0 ? t.textTertiary : good ? t.success : t.danger;
    const I = v > 0 ? TrendingUp : v < 0 ? TrendingDown : Minus;
    return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: col }}><I size={12} />{v > 0 ? "+" : ""}{v}%</span>;
  }

  function Row({ label, val, pVal, fmt, inv }: { label: string; val: number; pVal: number; fmt?: (n: number) => string; inv?: boolean }) {
    return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
      <span style={{ fontSize: 12, color: t.textTertiary }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{fmt ? fmt(val) : val}</span>
        <Chg c={val} p={pVal} inv={inv} />
      </div>
    </div>;
  }

  const urgCol: Record<string,string> = { high: t.danger, medium: t.warning, low: t.textTertiary };
  const urgBg: Record<string,string> = { high: t.dangerLight, medium: t.warningLight, low: t.bg };
  const pill = (a: boolean) => ({ padding:"5px 12px", borderRadius:8, border:`1px solid ${a?t.accent:t.border}`, background:a?t.accentLight:t.surface, color:a?t.accent:t.textSecondary, fontSize:12, fontWeight:600 as const, cursor:"pointer" as const });

  const noShowPct = (ns: number, total: number) => total > 0 ? Math.round((ns / total) * 100) : 0;
  const accPct = (acc: number, sent: number) => sent > 0 ? Math.round((acc / sent) * 100) : 0;

  return <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
    {/* FILTERS */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, gap:12, flexWrap:"wrap" as const }}>
      <div style={{ display:"flex", gap:6 }}>{periodOpts.map(p => <button key={p.value} onClick={() => setPeriod(p.value)} style={pill(period === p.value)}>{p.label}</button>)}</div>
      <button onClick={() => setShowFilters(!showFilters)} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px", borderRadius:8, border:`1px solid ${t.border}`, background:(filterAd||filterRecruiter)?t.accentLight:t.surface, color:(filterAd||filterRecruiter)?t.accent:t.textSecondary, fontSize:12, fontWeight:600, cursor:"pointer" }}>
        <Filter size={14} />Filters{(filterAd||filterRecruiter)?<span style={{ width:6,height:6,borderRadius:3,background:t.accent }} />:null}
      </button>
    </div>

    {showFilters && <div className="animate-fade-slide-up" style={{ display:"flex", gap:12, marginBottom:20, padding:16, background:t.surface, borderRadius:12, border:`1px solid ${t.border}` }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11, fontWeight:700, color:t.textTertiary, marginBottom:6, textTransform:"uppercase" as const }}>Recruiter</div>
        <select value={filterRecruiter} onChange={e => { setFilterRecruiter(e.target.value); setFilterAd(""); }} style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${t.border}`, fontSize:13, color:t.text, background:t.inputBg, outline:"none" }}>
          <option value="">All Recruiters</option>{recruiters.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11, fontWeight:700, color:t.textTertiary, marginBottom:6, textTransform:"uppercase" as const }}>Ad</div>
        <select value={filterAd} onChange={e => setFilterAd(e.target.value)} style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:`1px solid ${t.border}`, fontSize:13, color:t.text, background:t.inputBg, outline:"none" }}>
          <option value="">All Ads</option>{adOptions.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </div>
      {(filterAd||filterRecruiter) && <button onClick={() => { setFilterAd(""); setFilterRecruiter(""); }} style={{ alignSelf:"flex-end", padding:"8px 14px", borderRadius:8, border:`1px solid ${t.border}`, background:t.surface, color:t.textSecondary, fontSize:12, fontWeight:600, cursor:"pointer" }}>Clear</button>}
    </div>}

    {/* CUBES ROW 1 */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:16 }}>
      <div className="animate-fade-slide-up" style={{ background:t.surface, borderRadius:16, padding:20, border:`1px solid ${t.border}`, animationDelay:".05s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><div style={{ width:38,height:38,borderRadius:10,background:"#2D5BFF15",display:"flex",alignItems:"center",justifyContent:"center" }}><Megaphone size={20} color="#2D5BFF" /></div><span style={{ fontSize:13,fontWeight:600,color:t.textSecondary }}>Active Ads</span></div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}><span style={{ fontSize:28,fontWeight:700,color:t.text }}>{activeAds}</span></div>
        <Row label="Total Cost" val={totalCost} pVal={totalCost} fmt={n => "$"+n.toLocaleString()} inv />
      </div>
      <div className="animate-fade-slide-up" style={{ background:t.surface, borderRadius:16, padding:20, border:`1px solid ${t.border}`, animationDelay:".1s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><div style={{ width:38,height:38,borderRadius:10,background:"#7C3AED15",display:"flex",alignItems:"center",justifyContent:"center" }}><Users size={20} color="#7C3AED" /></div><span style={{ fontSize:13,fontWeight:600,color:t.textSecondary }}>Candidates</span></div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}><span style={{ fontSize:28,fontWeight:700,color:t.text }}>{curr.cand}</span><Chg c={curr.cand} p={prv.cand} /></div>
        <Row label="Screened" val={curr.screened} pVal={prv.screened} />
        <Row label="Need to Screen" val={curr.cand - curr.screened} pVal={prv.cand - prv.screened} inv />
      </div>
      <div className="animate-fade-slide-up" style={{ background:t.surface, borderRadius:16, padding:20, border:`1px solid ${t.border}`, animationDelay:".15s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><div style={{ width:38,height:38,borderRadius:10,background:"#0891B215",display:"flex",alignItems:"center",justifyContent:"center" }}><UserCheck size={20} color="#0891B2" /></div><span style={{ fontSize:13,fontWeight:600,color:t.textSecondary }}>Frontal Interview</span></div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}><span style={{ fontSize:28,fontWeight:700,color:t.text }}>{curr.intSched}</span><span style={{ fontSize:12,color:t.textTertiary }}>scheduled</span></div>
        <Row label="Arrived" val={curr.intArr} pVal={prv.intArr} />
        <Row label="No-Show %" val={noShowPct(curr.intSched-curr.intArr, curr.intSched)} pVal={noShowPct(prv.intSched-prv.intArr, prv.intSched)} inv fmt={n=>n+"%"} />
      </div>
    </div>

    {/* CUBES ROW 2 */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:32 }}>
      <div className="animate-fade-slide-up" style={{ background:t.surface, borderRadius:16, padding:20, border:`1px solid ${t.border}`, animationDelay:".2s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><div style={{ width:38,height:38,borderRadius:10,background:"#D9760615",display:"flex",alignItems:"center",justifyContent:"center" }}><Send size={20} color="#D97706" /></div><span style={{ fontSize:13,fontWeight:600,color:t.textSecondary }}>Offers</span></div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}><span style={{ fontSize:28,fontWeight:700,color:t.text }}>{curr.offerSent}</span><span style={{ fontSize:12,color:t.textTertiary }}>sent</span></div>
        <Row label="Accepted" val={curr.offerAcc} pVal={prv.offerAcc} />
        <Row label="Accept %" val={accPct(curr.offerAcc,curr.offerSent)} pVal={accPct(prv.offerAcc,prv.offerSent)} fmt={n=>n+"%"} />
      </div>
      <div className="animate-fade-slide-up" style={{ background:t.surface, borderRadius:16, padding:20, border:`1px solid ${t.border}`, animationDelay:".25s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><div style={{ width:38,height:38,borderRadius:10,background:"#BE185D15",display:"flex",alignItems:"center",justifyContent:"center" }}><GraduationCap size={20} color="#BE185D" /></div><span style={{ fontSize:13,fontWeight:600,color:t.textSecondary }}>Trainees</span></div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}><span style={{ fontSize:28,fontWeight:700,color:t.text }}>{curr.trSched}</span><span style={{ fontSize:12,color:t.textTertiary }}>scheduled</span></div>
        <Row label="Arrived" val={curr.trArr} pVal={prv.trArr} />
        <Row label="No-Show %" val={noShowPct(curr.trSched-curr.trArr,curr.trSched)} pVal={noShowPct(prv.trSched-prv.trArr,prv.trSched)} inv fmt={n=>n+"%"} />
      </div>
      <div className="animate-fade-slide-up" style={{ background:t.surface, borderRadius:16, padding:20, border:`1px solid ${t.border}`, animationDelay:".3s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><div style={{ width:38,height:38,borderRadius:10,background:"#0D9F6E15",display:"flex",alignItems:"center",justifyContent:"center" }}><UserPlus size={20} color="#0D9F6E" /></div><span style={{ fontSize:13,fontWeight:600,color:t.textSecondary }}>Hired</span></div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}><span style={{ fontSize:28,fontWeight:700,color:t.text }}>{curr.hired}</span><Chg c={curr.hired} p={prv.hired} /></div>
        <Row label="Cost per Hire" val={curr.costPerHire} pVal={prv.costPerHire} inv fmt={n=>"$"+n.toLocaleString()} />
      </div>
    </div>

    {/* PENDING ACTIONS */}
    <div style={{ background:t.surface, borderRadius:16, border:`1px solid ${t.border}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 24px", borderBottom:`1px solid ${t.borderLight}`, flexWrap:"wrap" as const, gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <AlertCircle size={18} color={t.danger} />
          <h3 style={{ fontSize:16, fontWeight:650, color:t.text, margin:0 }}>Pending Actions</h3>
          <span style={{ fontSize:12, fontWeight:700, color:"#fff", background:t.danger, padding:"2px 8px", borderRadius:10 }}>{fActions.length}</span>
          {(filterRecruiter || filterAd) && <span style={{ fontSize:11, color:t.accent, fontWeight:600 }}>Filtered</span>}
        </div>
        <div style={{ display:"flex", gap:4, flexWrap:"wrap" as const }}>
          {catOpts.map(c => <button key={c.value} onClick={() => setActionCat(c.value)} style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${actionCat===c.value?t.accent:t.borderLight}`, background:actionCat===c.value?t.accentLight:"transparent", color:actionCat===c.value?t.accent:t.textTertiary, fontSize:11, fontWeight:600, cursor:"pointer" }}>{c.label}</button>)}
        </div>
      </div>
      {fActions.length === 0 ? <div style={{ padding:40, textAlign:"center" as const, color:t.textTertiary }}>No pending actions{(filterRecruiter||filterAd)?" for this filter":""}</div>
      : fActions.map((a, i) => (
        <div key={a.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 24px", borderBottom:i<fActions.length-1?`1px solid ${t.borderLight}`:"none", cursor:"pointer" }} onMouseEnter={e => e.currentTarget.style.background=t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background="transparent"}>
          <div style={{ width:34, height:34, borderRadius:8, background:urgBg[a.urgency], display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}><a.icon size={16} color={urgCol[a.urgency]} /></div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:13, fontWeight:600, color:t.text }}>{a.title}</span>
              <span style={{ fontSize:10, fontWeight:700, color:urgCol[a.urgency], background:urgBg[a.urgency], padding:"2px 6px", borderRadius:4, textTransform:"uppercase" as const }}>{a.urgency}</span>
            </div>
            <div style={{ fontSize:12, color:t.textTertiary, marginTop:2 }}>{a.desc}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column" as const, alignItems:"flex-end", gap:2, flexShrink:0 }}>
            <span style={{ fontSize:11, color:t.textTertiary, display:"flex", alignItems:"center", gap:4 }}><UserCog size={11} />{a.assignee}</span>
            <span style={{ fontSize:11, color:t.textTertiary, display:"flex", alignItems:"center", gap:4 }}><Calendar size={11} />{a.date}</span>
          </div>
          <button style={{ padding:"6px 12px", borderRadius:8, border:`1px solid ${t.border}`, background:t.surface, color:t.accent, fontSize:11, fontWeight:600, cursor:"pointer", flexShrink:0 }}><Eye size={12} style={{ marginRight:4, verticalAlign:"middle" }} />View</button>
        </div>
      ))}
    </div>
  </div>;
}
