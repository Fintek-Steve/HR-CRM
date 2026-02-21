// ─── TYPES ───
export interface SubDepartment {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
  subs: SubDepartment[];
}

export interface Position {
  id: string;
  name: string;
  dept: string;
  sub: string;
}

export interface Rank {
  id: string;
  name: string;
  level: number;
  color: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  country: string;
  tz: string;
  isHQ: boolean;
}

export interface CompItem {
  id: string;
  name: string;
  type: "fixed" | "variable" | "equity" | "benefit";
  desc: string;
  req: boolean;
  scope: "all" | "position" | "rank";
  sv: string;
}

export interface KPI {
  id: string;
  name: string;
  cat: string;
  unit: string;
  desc: string;
  scope: "all" | "position" | "rank";
  sv: string;
}

export interface Account {
  id: string;
  name: string;
  prov: string;
  req: boolean;
  auto: boolean;
}

export interface Settings {
  departments: Department[];
  positions: Position[];
  ranks: Rank[];
  branches: Branch[];
  comp: CompItem[];
  kpis: KPI[];
  accounts: Account[];
}

export interface Employee {
  id: number;
  nm: string;
  role: string;
  dept: string;
  sub: string;
  rank: string;
  branch: string;
  email: string;
  ph: string;
  loc: string;
  st: "active" | "on_leave" | "inactive";
  av: string;
  hire: string;
  sal: string;
  mgr: string;
  eid: string;
  tp: string;
}

// ─── COLORS ───
export const colors = {
  bg: "#F8F7F4",
  surface: "#FFFFFF",
  border: "#E8E6E1",
  borderLight: "#F0EEEA",
  text: "#1A1A1A",
  textSecondary: "#6B6966",
  textTertiary: "#9C9A96",
  accent: "#2D5BFF",
  accentLight: "#EEF2FF",
  success: "#0D9F6E",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FFFBEB",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  purple: "#7C3AED",
  purpleLight: "#F3F0FF",
};

export const avatarColors = [
  "#2D5BFF", "#0D9F6E", "#D97706", "#DC2626", "#7C3AED",
  "#0891B2", "#BE185D", "#4F46E5", "#059669", "#9333EA",
];

export const typeColors: Record<string, string> = {
  fixed: colors.accent,
  variable: colors.warning,
  equity: colors.purple,
  benefit: colors.success,
};

// ─── TIMEZONE MAPPING ───
export const countryTimezones: Record<string, string> = {
  "USA": "UTC-5", "US": "UTC-5", "United States": "UTC-5",
  "UK": "UTC+0", "United Kingdom": "UTC+0",
  "Canada": "UTC-5", "Australia": "UTC+10", "Germany": "UTC+1",
  "France": "UTC+1", "Japan": "UTC+9", "China": "UTC+8",
  "India": "UTC+5:30", "Brazil": "UTC-3", "Mexico": "UTC-6",
  "Spain": "UTC+1", "Italy": "UTC+1", "Netherlands": "UTC+1",
  "Sweden": "UTC+1", "Norway": "UTC+1", "Denmark": "UTC+1",
  "Finland": "UTC+2", "Poland": "UTC+1", "Switzerland": "UTC+1",
  "Austria": "UTC+1", "Belgium": "UTC+1", "Ireland": "UTC+0",
  "Portugal": "UTC+0", "Israel": "UTC+2", "UAE": "UTC+4",
  "Saudi Arabia": "UTC+3", "Singapore": "UTC+8", "South Korea": "UTC+9",
  "New Zealand": "UTC+12", "South Africa": "UTC+2", "Egypt": "UTC+2",
  "Turkey": "UTC+3", "Russia": "UTC+3", "Argentina": "UTC-3",
  "Chile": "UTC-4", "Colombia": "UTC-5", "Philippines": "UTC+8",
  "Thailand": "UTC+7", "Vietnam": "UTC+7", "Indonesia": "UTC+7",
  "Malaysia": "UTC+8", "Nigeria": "UTC+1", "Kenya": "UTC+3",
  "Ghana": "UTC+0", "Morocco": "UTC+1", "Global": "Various",
};

export function getTimezone(country: string): string {
  if (!country) return "";
  const trimmed = country.trim();
  return countryTimezones[trimmed] ||
    Object.entries(countryTimezones).find(
      ([k]) => k.toLowerCase() === trimmed.toLowerCase()
    )?.[1] || "";
}

export function generateId(prefix: string): string {
  return prefix + Date.now() + Math.random().toString(36).slice(2, 5);
}

// ─── INITIAL DATA ───
export const initialSettings: Settings = {
  departments: [
    { id: "d1", name: "Engineering", subs: [{ id: "s1", name: "Frontend" }, { id: "s2", name: "Backend" }, { id: "s3", name: "DevOps" }] },
    { id: "d2", name: "Design", subs: [{ id: "s4", name: "UI/UX" }, { id: "s5", name: "Brand" }] },
    { id: "d3", name: "Product", subs: [{ id: "s6", name: "Product Management" }, { id: "s7", name: "Product Analytics" }] },
    { id: "d4", name: "Human Resources", subs: [{ id: "s8", name: "Recruitment" }, { id: "s9", name: "People Ops" }] },
    { id: "d5", name: "Marketing", subs: [{ id: "s10", name: "Growth" }, { id: "s11", name: "Content" }] },
    { id: "d6", name: "Sales", subs: [{ id: "s12", name: "Enterprise" }, { id: "s13", name: "SMB" }] },
    { id: "d7", name: "Finance", subs: [{ id: "s14", name: "Accounting" }, { id: "s15", name: "FP&A" }] },
  ],
  positions: [
    { id: "p1", name: "Software Engineer", dept: "Engineering", sub: "Frontend" },
    { id: "p2", name: "Engineering Manager", dept: "Engineering", sub: "Backend" },
    { id: "p3", name: "Senior Designer", dept: "Design", sub: "UI/UX" },
    { id: "p4", name: "Product Manager", dept: "Product", sub: "Product Management" },
    { id: "p5", name: "HR Specialist", dept: "Human Resources", sub: "People Ops" },
    { id: "p6", name: "Marketing Lead", dept: "Marketing", sub: "Growth" },
    { id: "p7", name: "Sales Manager", dept: "Sales", sub: "Enterprise" },
    { id: "p8", name: "Data Analyst", dept: "Product", sub: "Product Analytics" },
    { id: "p9", name: "Recruiter", dept: "Human Resources", sub: "Recruitment" },
    { id: "p10", name: "DevOps Engineer", dept: "Engineering", sub: "DevOps" },
  ],
  ranks: [
    { id: "r1", name: "Junior", level: 1, color: "#6B7280" },
    { id: "r2", name: "Mid-Level", level: 2, color: "#2D5BFF" },
    { id: "r3", name: "Senior", level: 3, color: "#7C3AED" },
    { id: "r4", name: "Lead", level: 4, color: "#D97706" },
    { id: "r5", name: "Principal", level: 5, color: "#0D9F6E" },
    { id: "r6", name: "Director", level: 6, color: "#DC2626" },
    { id: "r7", name: "VP", level: 7, color: "#BE185D" },
    { id: "r8", name: "C-Level", level: 8, color: "#1A1A1A" },
  ],
  branches: [
    { id: "b1", name: "San Francisco HQ", address: "123 Market St, SF, CA", country: "USA", tz: "UTC-5", isHQ: true },
    { id: "b2", name: "New York Office", address: "456 Broadway, NY", country: "USA", tz: "UTC-5", isHQ: false },
    { id: "b3", name: "London Office", address: "10 Downing Tech Park", country: "UK", tz: "UTC+0", isHQ: false },
    { id: "b4", name: "Remote", address: "N/A", country: "Global", tz: "Various", isHQ: false },
  ],
  comp: [
    { id: "c1", name: "Base Salary", type: "fixed", desc: "Monthly base compensation", req: true, scope: "all", sv: "" },
    { id: "c2", name: "Housing Allowance", type: "fixed", desc: "Monthly housing support", req: false, scope: "all", sv: "" },
    { id: "c3", name: "Transport Allowance", type: "fixed", desc: "Monthly transport costs", req: false, scope: "all", sv: "" },
    { id: "c4", name: "Annual Bonus", type: "variable", desc: "Performance-based yearly bonus", req: false, scope: "all", sv: "" },
    { id: "c5", name: "Stock Options", type: "equity", desc: "Company equity grants", req: false, scope: "all", sv: "" },
    { id: "c6", name: "Health Insurance", type: "benefit", desc: "Medical coverage", req: true, scope: "all", sv: "" },
    { id: "c7", name: "Retirement (401k)", type: "benefit", desc: "Retirement matching program", req: false, scope: "all", sv: "" },
    { id: "c8", name: "Sales Commission", type: "variable", desc: "10% commission on closed deals", req: false, scope: "position", sv: "Sales Manager" },
    { id: "c9", name: "Senior Quarterly Bonus", type: "variable", desc: "Quarterly performance bonus", req: false, scope: "rank", sv: "Senior" },
  ],
  kpis: [
    { id: "k1", name: "Revenue Target", cat: "Financial", unit: "$", desc: "Monthly/quarterly revenue goals", scope: "all", sv: "" },
    { id: "k2", name: "Customer Satisfaction", cat: "Customer", unit: "score", desc: "CSAT/NPS score targets", scope: "all", sv: "" },
    { id: "k3", name: "Sprint Velocity", cat: "Productivity", unit: "points", desc: "Story points per sprint", scope: "position", sv: "Software Engineer" },
    { id: "k4", name: "Code Quality", cat: "Quality", unit: "%", desc: "Code review pass rate", scope: "position", sv: "Software Engineer" },
    { id: "k5", name: "Time to Hire", cat: "HR", unit: "days", desc: "Average days to fill a position", scope: "position", sv: "Recruiter" },
    { id: "k6", name: "Employee Retention", cat: "HR", unit: "%", desc: "Annual retention rate target", scope: "rank", sv: "Director" },
    { id: "k7", name: "Project Delivery", cat: "Productivity", unit: "%", desc: "On-time delivery percentage", scope: "all", sv: "" },
  ],
  accounts: [
    { id: "a1", name: "Company Email", prov: "Google Workspace", req: true, auto: true },
    { id: "a2", name: "Slack", prov: "Slack", req: true, auto: true },
    { id: "a3", name: "GitHub", prov: "GitHub Enterprise", req: false, auto: false },
    { id: "a4", name: "Jira", prov: "Atlassian", req: false, auto: false },
    { id: "a5", name: "Figma", prov: "Figma", req: false, auto: false },
    { id: "a6", name: "Google Drive", prov: "Google Workspace", req: true, auto: true },
    { id: "a7", name: "1Password", prov: "1Password", req: true, auto: true },
    { id: "a8", name: "Notion", prov: "Notion", req: false, auto: false },
  ],
};

export const initialEmployees: Employee[] = [
  { id: 1, nm: "Sarah Chen", role: "Engineering Manager", dept: "Engineering", sub: "Frontend", rank: "Lead", branch: "San Francisco HQ", email: "sarah.chen@company.com", ph: "+1 (555) 234-5678", loc: "San Francisco, CA", st: "active", av: "SC", hire: "2021-03-15", sal: "$185,000", mgr: "David Park", eid: "EMP-001", tp: "Full-time" },
  { id: 2, nm: "Marcus Williams", role: "Senior Designer", dept: "Design", sub: "UI/UX", rank: "Senior", branch: "New York Office", email: "marcus.w@company.com", ph: "+1 (555) 345-6789", loc: "New York, NY", st: "active", av: "MW", hire: "2022-01-10", sal: "$145,000", mgr: "Lisa Johnson", eid: "EMP-002", tp: "Full-time" },
  { id: 3, nm: "Priya Patel", role: "Product Manager", dept: "Product", sub: "Product Management", rank: "Senior", branch: "Remote", email: "priya.p@company.com", ph: "+1 (555) 456-7890", loc: "Austin, TX", st: "active", av: "PP", hire: "2020-08-22", sal: "$165,000", mgr: "David Park", eid: "EMP-003", tp: "Full-time" },
  { id: 4, nm: "James O'Brien", role: "DevOps Engineer", dept: "Engineering", sub: "DevOps", rank: "Mid-Level", branch: "Remote", email: "james.ob@company.com", ph: "+1 (555) 567-8901", loc: "Remote", st: "on_leave", av: "JO", hire: "2023-02-14", sal: "$155,000", mgr: "Sarah Chen", eid: "EMP-004", tp: "Full-time" },
  { id: 5, nm: "Aisha Mohammed", role: "HR Specialist", dept: "Human Resources", sub: "People Ops", rank: "Mid-Level", branch: "San Francisco HQ", email: "aisha.m@company.com", ph: "+1 (555) 678-9012", loc: "Chicago, IL", st: "active", av: "AM", hire: "2022-06-01", sal: "$95,000", mgr: "Rachel Kim", eid: "EMP-005", tp: "Full-time" },
  { id: 6, nm: "Tom Fischer", role: "Data Analyst", dept: "Product", sub: "Product Analytics", rank: "Junior", branch: "Remote", email: "tom.f@company.com", ph: "+1 (555) 789-0123", loc: "Denver, CO", st: "active", av: "TF", hire: "2023-09-18", sal: "$120,000", mgr: "Priya Patel", eid: "EMP-006", tp: "Full-time" },
  { id: 7, nm: "Elena Rodriguez", role: "Marketing Lead", dept: "Marketing", sub: "Growth", rank: "Lead", branch: "Remote", email: "elena.r@company.com", ph: "+1 (555) 890-1234", loc: "Miami, FL", st: "active", av: "ER", hire: "2021-11-05", sal: "$135,000", mgr: "David Park", eid: "EMP-007", tp: "Full-time" },
  { id: 8, nm: "Kai Nakamura", role: "Software Engineer", dept: "Engineering", sub: "Frontend", rank: "Mid-Level", branch: "Remote", email: "kai.n@company.com", ph: "+1 (555) 901-2345", loc: "Seattle, WA", st: "active", av: "KN", hire: "2023-04-20", sal: "$140,000", mgr: "Sarah Chen", eid: "EMP-008", tp: "Contract" },
  { id: 9, nm: "Diana Costa", role: "Recruiter", dept: "Human Resources", sub: "Recruitment", rank: "Mid-Level", branch: "New York Office", email: "diana.c@company.com", ph: "+1 (555) 012-3456", loc: "Boston, MA", st: "active", av: "DC", hire: "2022-10-12", sal: "$88,000", mgr: "Rachel Kim", eid: "EMP-009", tp: "Full-time" },
  { id: 10, nm: "Alex Thompson", role: "Sales Manager", dept: "Sales", sub: "Enterprise", rank: "Lead", branch: "London Office", email: "alex.t@company.com", ph: "+1 (555) 123-4567", loc: "Los Angeles, CA", st: "active", av: "AT", hire: "2020-05-30", sal: "$150,000", mgr: "David Park", eid: "EMP-010", tp: "Full-time" },
];
