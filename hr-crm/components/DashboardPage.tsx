"use client";
import { useState, useMemo } from "react";
import { Megaphone, Users, UserCheck, Send, GraduationCap, UserPlus, TrendingUp, TrendingDown, Minus, Filter, AlertCircle, FileText, Mail, UserCog, Eye, Calendar } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

const recruiters = ["Rachel Green", "Tom Fischer", "Diana Costa"];
const ads = [
  { id: "ad1", title: "Senior Frontend Developer", recruiter: "Rachel Green", cost: 1200, status: "active", posted: "2026-01-15" },
  { id: "ad2", title: "Sales Manager", recruiter: "Tom Fischer", cost: 800, status: "active", posted: "2026-01-20" },
  { id: "ad3", title: "UX Designer", recruiter: "Rachel Green", cost: 600, status: "active", posted: "2026-02-01" },
  { id: "ad4", title: "DevOps Engineer", recruiter: "Diana Costa", cost: 950, status: "active", posted: "2026-02-05" },
  { id: "ad5", title: "Product Manager", recruiter: "Rachel Green", cost: 1100, status: "paused", posted: "2026-01-10" },
  { id: "ad6", title: "Data Analyst", recruiter: "Tom Fischer", cost: 500, status: "closed", posted: "2025-12-15" },
  { id: "ad7", title: "HR Coordinator", recruiter: "Diana Costa", cost: 400, status: "active", posted: "2026-02-10" },
];

function genData(seed: number) {
  const s = (a: number, b: number) => Math.floor((Math.sin(seed * a + b) * 0.5 + 0.5) * (b - a) + a);
  const activeAds = 4 + s(1, 3); const adCost = 2800 + s(2, 2200);
  const totalCand = 85 + s(3, 80); const screened = 40 + s(4, 35);
  const intSched = 28 + s(5, 15); const intArr = intSched - s(6, 6);
  const offerSent = 8 + s(7, 8); const offerAcc = offerSent - s(8, 4);
  const trSched = 6 + s(9, 6); const trArr = trSched - s(10, 3);
  const hired = offerAcc - s(11, 2); const costPerHire = 800 + s(12, 1200);
  return { activeAds, adCost, candTotal: totalCand, candScreened: screened, candNeedScreen: totalCand - screened, intSched, intArr, intNoShow: intSched - intArr, offerSent, offerAcc, trSched, trArr, trNoShow: trSched - trArr, hired, costPerHire };
}

const pendingActions = [
  { id: 1, cat: "ad_review", icon: Megaphone, title: "Senior Frontend Developer", desc: "Ad performance review — 14 days active, 12 candidates", urgency: "high", assignee: "Rachel Green", date: "2026-02-20" },
  { id: 2, cat: "ad_review", icon: Megaphone, title: "Sales Manager", desc: "Ad budget 80% spent — decision needed on renewal", urgency: "high", assignee: "Tom Fischer", date: "2026-02-19" },
  { id: 3, cat: "screen", icon: Users, title: "5 candidates unscreened", desc: "UX Designer (3) & DevOps Engineer (2) — applied 3+ days ago", urgency: "high", assignee: "Rachel Green", date: "2026-02-18" },
  { id: 4, cat: "screen", icon: Users, title: "Interview no-shows follow-up", desc: "2 candidates didn't arrive to scheduled interview", urgency: "medium", assignee: "Diana Costa", date: "2026-02-21" },
  { id: 5, cat: "offer", icon: Send, title: "Offer pending response", desc: "Marcus Webb — Sales Manager offer sent 5 days ago", urgency: "high", assignee: "Tom Fischer", date: "2026-02-17" },
  { id: 6, cat: "offer", icon: Send, title: "Offer pending response", desc: "Lena Park — Frontend Developer, sent 2 days ago", urgency: "low", assignee: "Rachel Green", date: "2026-02-20" },
  { id: 7, cat: "trainee", icon: GraduationCap, title: "Create user accounts", desc: "3 new trainees starting next week — accounts not created", urgency: "high", assignee: "Diana Costa", date: "2026-02-22" },
  { id: 8, cat: "docs", icon: FileText, title: "Missing documents", desc: "James O'Brien — ID copy & signed contract not uploaded", urgency: "medium", assignee: "Rachel Green", date: "2026-02-15" },
  { id: 9, cat: "docs", icon: FileText, title: "Missing documents", desc: "Aisha Mohammed — Work permit expiring in 30 days", urgency: "high", assignee: "Diana Costa", date: "2026-02-10" },
  { id: 10, cat: "request", icon: Mail, title: "Employee request", desc: "Priya Patel — Equipment request pending 4 days", urgency: "medium", assignee: "Rachel Green", date: "2026-02-18" },
  { id: 11, cat: "request", icon: Mail, title: "Employee request", desc: "Kai Nakamura — WFH policy clarification", urgency: "low", assignee: "Tom Fischer", date: "2026-02-21" },
];

const periods = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "year", label: "This Year" },
];

const cats = [
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

  const curr = useMemo(() => genData(period === "week" ? 1 : period === "month" ? 2 : period === "quarter" ? 3 : 4), [period]);
  const prev = useMemo(() => genData(period === "week" ? 11 : period === "month" ? 12 : period === "quarter" ? 13 : 14), [period]);
  const fActions = pendingActions.filter(a => actionCat === "all" || a.cat === actionCat);

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

  const urgCol: Record<string, string> = { high: t.danger, medium: t.warning, low: t.textTertiary };
  const urgBg: Record<string, string> = { high: t.dangerLight, medium: t.warningLight, low: t.bg };
  const pill = (active: boolean) => ({ padding: "5px 12px", borderRadius: 8, border: `1px solid ${active ? t.accent : t.border}`, background: active ? t.accentLight : t.surface, color: active ? t.accent : t.textSecondary, fontSize: 12, fontWeight: 600 as const, cursor: "pointer" as const });

  return <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
    {/* FILTERS */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 12, flexWrap: "wrap" as const }}>
      <div style={{ display: "flex", gap: 6 }}>{periods.map(p => <button key={p.value} onClick={() => setPeriod(p.value)} style={pill(period === p.value)}>{p.label}</button>)}</div>
      <button onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: (filterAd || filterRecruiter) ? t.accentLight : t.surface, color: (filterAd || filterRecruiter) ? t.accent : t.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
        <Filter size={14} />Filters{(filterAd || filterRecruiter) ? <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }} /> : null}
      </button>
    </div>

    {showFilters && <div className="animate-fade-slide-up" style={{ display: "flex", gap: 12, marginBottom: 20, padding: 16, background: t.surface, borderRadius: 12, border: `1px solid ${t.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Ad</div>
        <select value={filterAd} onChange={e => setFilterAd(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }}>
          <option value="">All Ads</option>{ads.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Recruiter</div>
        <select value={filterRecruiter} onChange={e => setFilterRecruiter(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }}>
          <option value="">All Recruiters</option>{recruiters.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {(filterAd || filterRecruiter) && <button onClick={() => { setFilterAd(""); setFilterRecruiter(""); }} style={{ alignSelf: "flex-end", padding: "8px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, color: t.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>}
    </div>}

    {/* CUBES ROW 1 */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 16 }}>
      {/* Active Ads */}
      <div className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, animationDelay: ".05s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#2D5BFF15", display: "flex", alignItems: "center", justifyContent: "center" }}><Megaphone size={20} color="#2D5BFF" /></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Active Ads</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{curr.activeAds}</span><Chg c={curr.activeAds} p={prev.activeAds} /></div>
        <Row label="Total Cost" val={curr.adCost} pVal={prev.adCost} fmt={n => "$" + n.toLocaleString()} inv />
      </div>

      {/* Candidates */}
      <div className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, animationDelay: ".1s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#7C3AED15", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={20} color="#7C3AED" /></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Candidates</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{curr.candTotal}</span><Chg c={curr.candTotal} p={prev.candTotal} /></div>
        <Row label="Screened" val={curr.candScreened} pVal={prev.candScreened} />
        <Row label="Need to Screen" val={curr.candNeedScreen} pVal={prev.candNeedScreen} inv />
      </div>

      {/* Frontal Interview */}
      <div className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, animationDelay: ".15s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0891B215", display: "flex", alignItems: "center", justifyContent: "center" }}><UserCheck size={20} color="#0891B2" /></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Frontal Interview</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{curr.intSched}</span><span style={{ fontSize: 12, color: t.textTertiary }}>scheduled</span></div>
        <Row label="Arrived" val={curr.intArr} pVal={prev.intArr} />
        <Row label="No-Show %" val={curr.intSched > 0 ? Math.round((curr.intNoShow / curr.intSched) * 100) : 0} pVal={prev.intSched > 0 ? Math.round((prev.intNoShow / prev.intSched) * 100) : 0} inv fmt={n => n + "%"} />
      </div>
    </div>

    {/* CUBES ROW 2 */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 32 }}>
      {/* Offers */}
      <div className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, animationDelay: ".2s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#D9760615", display: "flex", alignItems: "center", justifyContent: "center" }}><Send size={20} color="#D97706" /></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Offers</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{curr.offerSent}</span><span style={{ fontSize: 12, color: t.textTertiary }}>sent</span></div>
        <Row label="Accepted" val={curr.offerAcc} pVal={prev.offerAcc} />
        <Row label="Accept %" val={curr.offerSent > 0 ? Math.round((curr.offerAcc / curr.offerSent) * 100) : 0} pVal={prev.offerSent > 0 ? Math.round((prev.offerAcc / prev.offerSent) * 100) : 0} fmt={n => n + "%"} />
      </div>

      {/* Trainees */}
      <div className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, animationDelay: ".25s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#BE185D15", display: "flex", alignItems: "center", justifyContent: "center" }}><GraduationCap size={20} color="#BE185D" /></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Trainees</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{curr.trSched}</span><span style={{ fontSize: 12, color: t.textTertiary }}>scheduled</span></div>
        <Row label="Arrived" val={curr.trArr} pVal={prev.trArr} />
        <Row label="No-Show %" val={curr.trSched > 0 ? Math.round((curr.trNoShow / curr.trSched) * 100) : 0} pVal={prev.trSched > 0 ? Math.round((prev.trNoShow / prev.trSched) * 100) : 0} inv fmt={n => n + "%"} />
      </div>

      {/* Hired */}
      <div className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, padding: 20, border: `1px solid ${t.border}`, animationDelay: ".3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0D9F6E15", display: "flex", alignItems: "center", justifyContent: "center" }}><UserPlus size={20} color="#0D9F6E" /></div>
          <span style={{ fontSize: 13, fontWeight: 600, color: t.textSecondary }}>Hired</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ fontSize: 28, fontWeight: 700, color: t.text }}>{curr.hired}</span><Chg c={curr.hired} p={prev.hired} /></div>
        <Row label="Cost per Hire" val={curr.costPerHire} pVal={prev.costPerHire} inv fmt={n => "$" + n.toLocaleString()} />
      </div>
    </div>

    {/* PENDING ACTIONS */}
    <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: `1px solid ${t.borderLight}`, flexWrap: "wrap" as const, gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={18} color={t.danger} />
          <h3 style={{ fontSize: 16, fontWeight: 650, color: t.text, margin: 0 }}>Pending Actions</h3>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: t.danger, padding: "2px 8px", borderRadius: 10 }}>{fActions.length}</span>
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
          {cats.map(c => <button key={c.value} onClick={() => setActionCat(c.value)} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${actionCat === c.value ? t.accent : t.borderLight}`, background: actionCat === c.value ? t.accentLight : "transparent", color: actionCat === c.value ? t.accent : t.textTertiary, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{c.label}</button>)}
        </div>
      </div>
      {fActions.length === 0 ? <div style={{ padding: 40, textAlign: "center" as const, color: t.textTertiary }}>No pending actions</div>
      : fActions.map((a, i) => (
        <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderBottom: i < fActions.length - 1 ? `1px solid ${t.borderLight}` : "none", cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: urgBg[a.urgency], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><a.icon size={16} color={urgCol[a.urgency]} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{a.title}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: urgCol[a.urgency], background: urgBg[a.urgency], padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" as const }}>{a.urgency}</span>
            </div>
            <div style={{ fontSize: 12, color: t.textTertiary, marginTop: 2 }}>{a.desc}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 2, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: t.textTertiary, display: "flex", alignItems: "center", gap: 4 }}><UserCog size={11} />{a.assignee}</span>
            <span style={{ fontSize: 11, color: t.textTertiary, display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} />{a.date}</span>
          </div>
          <button style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, color: t.accent, fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}><Eye size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />View</button>
        </div>
      ))}
    </div>
  </div>;
}
