"use client";
import { useState, useMemo } from "react";
import { Search, Plus, Building2, Landmark, Mail, GitBranch, Users, TrendingUp, TrendingDown, Minus, Cake, ChevronDown, Filter } from "lucide-react";
import { Avatar, StatusBadge, Btn } from "@/components/ui/shared";
import { Settings, Employee } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

// Parse dob as local date (avoid UTC offset issues)
function parseDob(dob: string): { month: number; day: number } | null {
  if (!dob) return null;
  const parts = dob.split("-");
  if (parts.length < 3) return null;
  return { month: parseInt(parts[1]) - 1, day: parseInt(parts[2]) };
}

function isBirthdayInRange(dob: string, daysAhead: number): boolean {
  const p = parseDob(dob);
  if (!p) return false;
  const today = new Date(); today.setHours(0,0,0,0);
  const bday = new Date(today.getFullYear(), p.month, p.day);
  if (bday < today) bday.setFullYear(bday.getFullYear() + 1);
  const diff = (bday.getTime() - today.getTime()) / (1000*60*60*24);
  return diff >= 0 && diff <= daysAhead;
}

function isBirthdayToday(dob: string): boolean {
  const p = parseDob(dob);
  if (!p) return false;
  const today = new Date();
  return p.month === today.getMonth() && p.day === today.getDate();
}

function daysUntilBirthday(dob: string): number {
  const p = parseDob(dob);
  if (!p) return 999;
  const today = new Date(); today.setHours(0,0,0,0);
  const bday = new Date(today.getFullYear(), p.month, p.day);
  if (bday < today) bday.setFullYear(bday.getFullYear() + 1);
  return Math.round((bday.getTime() - today.getTime()) / (1000*60*60*24));
}

function formatDob(dob: string): string {
  const p = parseDob(dob);
  if (!p) return "";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[p.month]} ${p.day}`;
}

export default function EmployeesPage({ onSelect, settings, employees }: { onSelect: (e: Employee) => void; settings: Settings; employees: Employee[] }) {
  const { theme: t } = useTheme();
  const [q, setQ] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [subFilter, setSubFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const depts = ["All", ...settings.departments.map(d => d.name)];
  const subs = useMemo(() => {
    if (deptFilter === "All") return ["All"];
    const dept = settings.departments.find(d => d.name === deptFilter);
    return ["All", ...(dept ? dept.subs.map(s => s.name) : [])];
  }, [deptFilter, settings.departments]);

  const filtered = useMemo(() => employees.filter(e => {
    if (q && !e.nm.toLowerCase().includes(q.toLowerCase()) && !e.role.toLowerCase().includes(q.toLowerCase()) && !e.eid.toLowerCase().includes(q.toLowerCase())) return false;
    if (deptFilter !== "All" && e.dept !== deptFilter) return false;
    if (subFilter !== "All" && e.sub !== subFilter) return false;
    if (statusFilter !== "All" && e.st !== statusFilter) return false;
    return true;
  }), [employees, q, deptFilter, subFilter, statusFilter]);

  // Headcount stats (based on filtered results)
  const totalActive = filtered.filter(e => e.st === "active").length;
  const totalOnLeave = filtered.filter(e => e.st === "on_leave").length;
  const totalInactive = filtered.filter(e => e.st === "inactive").length;
  // Mock: 1 month ago headcount (assume 1 less active per filter scope)
  const prevMonthActive = Math.max(0, totalActive - 1);
  const headcountChange = totalActive - prevMonthActive;

  // Upcoming birthdays (next 7 days, from filtered employees)
  const upcomingBdays = filtered.filter(e => e.st !== "inactive" && isBirthdayInRange(e.dob, 7)).sort((a, b) => daysUntilBirthday(a.dob) - daysUntilBirthday(b.dob));

  const hasFilters = deptFilter !== "All" || subFilter !== "All" || statusFilter !== "All";

  const selStyle = (active: boolean) => ({
    padding: "5px 12px", borderRadius: 8,
    border: `1px solid ${active ? t.accent : t.border}`,
    background: active ? t.accentLight : t.surface,
    color: active ? t.accent : t.textSecondary,
    fontSize: 12, fontWeight: 600 as const, cursor: "pointer" as const,
    whiteSpace: "nowrap" as const,
  });

  return <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
    {/* HEADCOUNT BAR */}
    <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, flex: 1 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: t.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={20} color={t.accent} /></div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text }}>{totalActive}</div>
          <div style={{ fontSize: 12, color: t.textTertiary }}>Active Employees</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: headcountChange > 0 ? t.success : headcountChange < 0 ? t.danger : t.textTertiary }}>
          {headcountChange > 0 ? <TrendingUp size={14} /> : headcountChange < 0 ? <TrendingDown size={14} /> : <Minus size={14} />}
          {headcountChange > 0 ? "+" : ""}{headcountChange}
          <span style={{ fontWeight: 400, color: t.textTertiary, marginLeft: 2 }}>vs last month</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: t.surface, borderRadius: 12, border: `1px solid ${t.border}` }}>
        <div style={{ textAlign: "center" as const }}><div style={{ fontSize: 18, fontWeight: 700, color: t.warning }}>{totalOnLeave}</div><div style={{ fontSize: 11, color: t.textTertiary }}>On Leave</div></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: t.surface, borderRadius: 12, border: `1px solid ${t.border}` }}>
        <div style={{ textAlign: "center" as const }}><div style={{ fontSize: 18, fontWeight: 700, color: t.textTertiary }}>{totalInactive}</div><div style={{ fontSize: 11, color: t.textTertiary }}>Inactive</div></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: t.surface, borderRadius: 12, border: `1px solid ${t.border}` }}>
        <div style={{ textAlign: "center" as const }}><div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>{filtered.length}</div><div style={{ fontSize: 11, color: t.textTertiary }}>Total</div></div>
      </div>
    </div>

    {/* BIRTHDAY BANNER */}
    {upcomingBdays.length > 0 && <div className="animate-fade-slide-up" style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: `linear-gradient(135deg, #FEF3C7, #FDEBD0)`, borderRadius: 12, border: `1px solid #F6D365`, marginBottom: 20 }}>
      <Cake size={22} color="#D97706" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#92400E" }}>
          {upcomingBdays.some(e => isBirthdayToday(e.dob)) ? "🎂 " : "🎈 "}
          Upcoming Birthdays
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 4, flexWrap: "wrap" as const }}>
          {upcomingBdays.map(e => {
            const isToday = isBirthdayToday(e.dob);
            const days = daysUntilBirthday(e.dob);
            return <span key={e.id} style={{ fontSize: 12, color: "#78350F", fontWeight: isToday ? 700 : 500 }}>
              {e.nm} — {isToday ? "Today! 🎉" : days === 1 ? "Tomorrow" : `in ${days} days`} ({formatDob(e.dob)})
            </span>;
          })}
        </div>
      </div>
    </div>}

    {/* SEARCH + FILTER BAR */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" as const }}>
      <div style={{ display: "flex", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, flex: 1, maxWidth: 360 }}>
          <Search size={16} color={t.textTertiary} />
          <input placeholder="Search name, role, ID..." value={q} onChange={e => setQ(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, color: t.text, background: "transparent", width: "100%" }} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: hasFilters ? t.accentLight : t.surface, color: hasFilters ? t.accent : t.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          <Filter size={14} />Filters{hasFilters && <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }} />}
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: t.textTertiary }}>{filtered.length} shown</span>
        <Btn icon={Plus}>Add Employee</Btn>
      </div>
    </div>

    {/* FILTER PANEL */}
    {showFilters && <div className="animate-fade-slide-up" style={{ display: "flex", gap: 12, marginBottom: 16, padding: 16, background: t.surface, borderRadius: 12, border: `1px solid ${t.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Department</div>
        <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setSubFilter("All"); }} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }}>
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Sub-Department</div>
        <select value={subFilter} onChange={e => setSubFilter(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }} disabled={deptFilter === "All"}>
          {subs.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Status</div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }}>
          <option value="All">All</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      {hasFilters && <button onClick={() => { setDeptFilter("All"); setSubFilter("All"); setStatusFilter("All"); }} style={{ alignSelf: "flex-end", padding: "8px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, color: t.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>}
    </div>}

    {/* EMPLOYEE GRID */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
      {filtered.map((e, i) => {
        const bdayToday = isBirthdayToday(e.dob);
        return <div key={e.id} onClick={() => onSelect(e)} className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, border: `1px solid ${bdayToday ? "#F6D365" : t.border}`, padding: 24, cursor: "pointer", transition: "all .2s", animationDelay: `${.03*i}s`, position: "relative" as const }} onMouseEnter={v => { v.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.08)"; v.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={v => { v.currentTarget.style.boxShadow = "none"; v.currentTarget.style.transform = "none"; }}>
          {bdayToday && <div style={{ position: "absolute" as const, top: 12, right: 12, fontSize: 18 }}>🎂</div>}
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
        </div>;
      })}
    </div>
    {filtered.length === 0 && <div style={{ padding: 60, textAlign: "center" as const, color: t.textTertiary, fontSize: 15 }}>No employees match your filters</div>}
  </div>;
}
