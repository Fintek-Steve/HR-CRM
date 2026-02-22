// ─── TYPES ───
export interface SubDepartment { id: string; name: string; }
export interface Department { id: string; name: string; subs: SubDepartment[]; }
export interface Position { id: string; name: string; dept: string; sub: string; }
export interface Rank { id: string; name: string; level: number; color: string; }
export interface Branch { id: string; name: string; address: string; country: string; tz: string; isHQ: boolean; }

export interface CompItem {
  id: string; name: string; type: "fixed" | "variable" | "equity" | "benefit";
  desc: string; req: boolean;
  scope: "position_rank" | "employee";
  sv: string; sv2: string;  // sv=position, sv2=rank for position_rank; sv=employee name for employee
}

export interface KPI {
  id: string; name: string; cat: string; unit: string; desc: string;
  scope: "position_rank" | "employee";
  sv: string; sv2: string;
}

export interface Account { id: string; name: string; prov: string; req: boolean; auto: boolean; }
export interface ContractType { id: string; name: string; desc: string; duration: string; color: string; }

export interface Settings {
  departments: Department[]; positions: Position[]; ranks: Rank[];
  branches: Branch[]; comp: CompItem[]; kpis: KPI[];
  accounts: Account[]; contractTypes: ContractType[];
}

export interface HistoryEntry {
  id: string;
  date: string;       // ISO date string
  type: "hire" | "position" | "rank" | "department" | "branch" | "status" | "contract" | "manager";
  from: string;
  to: string;
  note: string;
}

export interface Employee {
  id: number; nm: string; role: string; dept: string; sub: string; rank: string;
  branch: string; email: string; ph: string; loc: string;
  st: "active" | "on_leave" | "inactive"; av: string; hire: string;
  sal: string; mgr: string; eid: string; tp: string; contract: string;
  compEmail: string; compPhone: string; compExt: string;
  history: HistoryEntry[];
}

// ─── THEME ───
export interface Theme {
  bg: string; surface: string; surfaceHover: string; border: string; borderLight: string;
  text: string; textSecondary: string; textTertiary: string;
  accent: string; accentLight: string; success: string; successLight: string;
  warning: string; warningLight: string; danger: string; dangerLight: string;
  purple: string; purpleLight: string;
  sidebar: string; sidebarBorder: string; sidebarText: string;
  sidebarTextActive: string; sidebarActiveBg: string;
  sidebarHoverBg: string; sidebarHoverText: string;
  inputBg: string; inputDisabledBg: string;
  modalOverlay: string; toastBg: string;
}

export const lightTheme: Theme = {
  bg:"#F8F7F4",surface:"#FFFFFF",surfaceHover:"#F8F7F4",border:"#E8E6E1",borderLight:"#F0EEEA",
  text:"#1A1A1A",textSecondary:"#6B6966",textTertiary:"#9C9A96",
  accent:"#2D5BFF",accentLight:"#EEF2FF",success:"#0D9F6E",successLight:"#ECFDF5",
  warning:"#D97706",warningLight:"#FFFBEB",danger:"#DC2626",dangerLight:"#FEF2F2",
  purple:"#7C3AED",purpleLight:"#F3F0FF",
  sidebar:"#0F0F12",sidebarBorder:"rgba(255,255,255,0.08)",sidebarText:"rgba(255,255,255,0.5)",
  sidebarTextActive:"#2D5BFF",sidebarActiveBg:"rgba(45,91,255,0.15)",
  sidebarHoverBg:"rgba(255,255,255,0.06)",sidebarHoverText:"rgba(255,255,255,0.8)",
  inputBg:"#FFFFFF",inputDisabledBg:"#f5f5f4",modalOverlay:"rgba(0,0,0,0.4)",toastBg:"#065F46",
};

export const darkTheme: Theme = {
  bg:"#0C0C0F",surface:"#16161A",surfaceHover:"#1E1E24",border:"#2A2A32",borderLight:"#1E1E24",
  text:"#EDEDF0",textSecondary:"#9A99A0",textTertiary:"#5C5B63",
  accent:"#4B7BFF",accentLight:"#1A2550",success:"#10B981",successLight:"#0A2E1E",
  warning:"#F59E0B",warningLight:"#2E2008",danger:"#EF4444",dangerLight:"#2E0A0A",
  purple:"#A78BFA",purpleLight:"#1E1535",
  sidebar:"#09090B",sidebarBorder:"rgba(255,255,255,0.06)",sidebarText:"rgba(255,255,255,0.4)",
  sidebarTextActive:"#4B7BFF",sidebarActiveBg:"rgba(75,123,255,0.15)",
  sidebarHoverBg:"rgba(255,255,255,0.04)",sidebarHoverText:"rgba(255,255,255,0.7)",
  inputBg:"#1E1E24",inputDisabledBg:"#16161A",modalOverlay:"rgba(0,0,0,0.7)",toastBg:"#065F46",
};

export const colors = lightTheme;

export const avatarColors = ["#2D5BFF","#0D9F6E","#D97706","#DC2626","#7C3AED","#0891B2","#BE185D","#4F46E5","#059669","#9333EA"];

export const typeColors: Record<string,string> = { fixed:"#2D5BFF", variable:"#D97706", equity:"#7C3AED", benefit:"#0D9F6E" };

// ─── TIMEZONE ───
export const countryTimezones: Record<string,string> = {
  "USA":"UTC-5","US":"UTC-5","United States":"UTC-5","UK":"UTC+0","United Kingdom":"UTC+0",
  "Canada":"UTC-5","Australia":"UTC+10","Germany":"UTC+1","France":"UTC+1","Japan":"UTC+9",
  "China":"UTC+8","India":"UTC+5:30","Brazil":"UTC-3","Mexico":"UTC-6","Spain":"UTC+1",
  "Italy":"UTC+1","Netherlands":"UTC+1","Sweden":"UTC+1","Norway":"UTC+1","Denmark":"UTC+1",
  "Finland":"UTC+2","Poland":"UTC+1","Switzerland":"UTC+1","Austria":"UTC+1","Belgium":"UTC+1",
  "Ireland":"UTC+0","Portugal":"UTC+0","Israel":"UTC+2","UAE":"UTC+4","Saudi Arabia":"UTC+3",
  "Singapore":"UTC+8","South Korea":"UTC+9","New Zealand":"UTC+12","South Africa":"UTC+2",
  "Egypt":"UTC+2","Turkey":"UTC+3","Russia":"UTC+3","Argentina":"UTC-3","Chile":"UTC-4",
  "Colombia":"UTC-5","Philippines":"UTC+8","Thailand":"UTC+7","Vietnam":"UTC+7",
  "Indonesia":"UTC+7","Malaysia":"UTC+8","Nigeria":"UTC+1","Kenya":"UTC+3",
  "Ghana":"UTC+0","Morocco":"UTC+1","Global":"Various",
};

export function getTimezone(country: string): string {
  if (!country) return "";
  const t = country.trim();
  return countryTimezones[t] || Object.entries(countryTimezones).find(([k]) => k.toLowerCase() === t.toLowerCase())?.[1] || "";
}

export function getUtcOffsetMinutes(tz: string): number | null {
  if (!tz || tz === "Various") return null;
  const m = tz.match(/^UTC([+-])(\d{1,2})(?::(\d{2}))?$/);
  if (!m) return null;
  return (m[1] === "+" ? 1 : -1) * (parseInt(m[2]) * 60 + (m[3] ? parseInt(m[3]) : 0));
}

export function getLiveTime(tz: string): string {
  const off = getUtcOffsetMinutes(tz);
  if (off === null) return "";
  const now = new Date();
  const local = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + off * 60000);
  return local.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function generateId(prefix: string): string {
  return prefix + Date.now() + Math.random().toString(36).slice(2, 5);
}

// ─── INITIAL DATA ───
export const initialSettings: Settings = {
  departments: [
    { id:"d1",name:"Engineering",subs:[{id:"s1",name:"Frontend"},{id:"s2",name:"Backend"},{id:"s3",name:"DevOps"}] },
    { id:"d2",name:"Design",subs:[{id:"s4",name:"UI/UX"},{id:"s5",name:"Brand"}] },
    { id:"d3",name:"Product",subs:[{id:"s6",name:"Product Management"},{id:"s7",name:"Product Analytics"}] },
    { id:"d4",name:"Human Resources",subs:[{id:"s8",name:"Recruitment"},{id:"s9",name:"People Ops"}] },
    { id:"d5",name:"Marketing",subs:[{id:"s10",name:"Growth"},{id:"s11",name:"Content"}] },
    { id:"d6",name:"Sales",subs:[{id:"s12",name:"Enterprise"},{id:"s13",name:"SMB"}] },
    { id:"d7",name:"Finance",subs:[{id:"s14",name:"Accounting"},{id:"s15",name:"FP&A"}] },
  ],
  positions: [
    {id:"p1",name:"Software Engineer",dept:"Engineering",sub:"Frontend"},
    {id:"p2",name:"Engineering Manager",dept:"Engineering",sub:"Backend"},
    {id:"p3",name:"Senior Designer",dept:"Design",sub:"UI/UX"},
    {id:"p4",name:"Product Manager",dept:"Product",sub:"Product Management"},
    {id:"p5",name:"HR Specialist",dept:"Human Resources",sub:"People Ops"},
    {id:"p6",name:"Marketing Lead",dept:"Marketing",sub:"Growth"},
    {id:"p7",name:"Sales Manager",dept:"Sales",sub:"Enterprise"},
    {id:"p8",name:"Data Analyst",dept:"Product",sub:"Product Analytics"},
    {id:"p9",name:"Recruiter",dept:"Human Resources",sub:"Recruitment"},
    {id:"p10",name:"DevOps Engineer",dept:"Engineering",sub:"DevOps"},
  ],
  ranks: [
    {id:"r1",name:"Junior",level:1,color:"#6B7280"},{id:"r2",name:"Mid-Level",level:2,color:"#2D5BFF"},
    {id:"r3",name:"Senior",level:3,color:"#7C3AED"},{id:"r4",name:"Lead",level:4,color:"#D97706"},
    {id:"r5",name:"Principal",level:5,color:"#0D9F6E"},{id:"r6",name:"Director",level:6,color:"#DC2626"},
    {id:"r7",name:"VP",level:7,color:"#BE185D"},{id:"r8",name:"C-Level",level:8,color:"#1A1A1A"},
  ],
  branches: [
    {id:"b1",name:"San Francisco HQ",address:"123 Market St, SF, CA",country:"USA",tz:"UTC-5",isHQ:true},
    {id:"b2",name:"New York Office",address:"456 Broadway, NY",country:"USA",tz:"UTC-5",isHQ:false},
    {id:"b3",name:"London Office",address:"10 Downing Tech Park",country:"UK",tz:"UTC+0",isHQ:false},
    {id:"b4",name:"Remote",address:"N/A",country:"Global",tz:"Various",isHQ:false},
  ],
  comp: [
    {id:"c1",name:"Base Salary",type:"fixed",desc:"Monthly base compensation",req:true,scope:"position_rank",sv:"",sv2:""},
    {id:"c2",name:"Housing Allowance",type:"fixed",desc:"Monthly housing support",req:false,scope:"position_rank",sv:"",sv2:""},
    {id:"c3",name:"Annual Bonus",type:"variable",desc:"Performance-based yearly bonus",req:false,scope:"position_rank",sv:"",sv2:""},
    {id:"c4",name:"Stock Options",type:"equity",desc:"Company equity grants",req:false,scope:"position_rank",sv:"",sv2:"Senior"},
    {id:"c5",name:"Health Insurance",type:"benefit",desc:"Medical coverage",req:true,scope:"position_rank",sv:"",sv2:""},
    {id:"c6",name:"Sales Commission",type:"variable",desc:"10% on closed deals",req:false,scope:"position_rank",sv:"Sales Manager",sv2:""},
    {id:"c7",name:"Sr Eng Bonus",type:"variable",desc:"Quarterly bonus",req:false,scope:"position_rank",sv:"Software Engineer",sv2:"Senior"},
  ],
  kpis: [
    {id:"k1",name:"Revenue Target",cat:"Financial",unit:"$",desc:"Revenue goals",scope:"position_rank",sv:"",sv2:""},
    {id:"k2",name:"Customer Satisfaction",cat:"Customer",unit:"score",desc:"CSAT/NPS targets",scope:"position_rank",sv:"",sv2:""},
    {id:"k3",name:"Sprint Velocity",cat:"Productivity",unit:"points",desc:"Story points per sprint",scope:"position_rank",sv:"Software Engineer",sv2:""},
    {id:"k4",name:"Code Quality",cat:"Quality",unit:"%",desc:"Code review pass rate",scope:"position_rank",sv:"Software Engineer",sv2:""},
    {id:"k5",name:"Time to Hire",cat:"HR",unit:"days",desc:"Avg days to fill position",scope:"position_rank",sv:"Recruiter",sv2:""},
    {id:"k6",name:"Employee Retention",cat:"HR",unit:"%",desc:"Annual retention rate",scope:"position_rank",sv:"",sv2:"Director"},
    {id:"k7",name:"Project Delivery",cat:"Productivity",unit:"%",desc:"On-time delivery %",scope:"position_rank",sv:"",sv2:""},
  ],
  accounts: [
    {id:"a1",name:"Company Email",prov:"Google Workspace",req:true,auto:true},
    {id:"a2",name:"Slack",prov:"Slack",req:true,auto:true},
    {id:"a3",name:"GitHub",prov:"GitHub Enterprise",req:false,auto:false},
    {id:"a4",name:"Jira",prov:"Atlassian",req:false,auto:false},
    {id:"a5",name:"Figma",prov:"Figma",req:false,auto:false},
    {id:"a6",name:"Google Drive",prov:"Google Workspace",req:true,auto:true},
    {id:"a7",name:"1Password",prov:"1Password",req:true,auto:true},
    {id:"a8",name:"Notion",prov:"Notion",req:false,auto:false},
  ],
  contractTypes: [
    {id:"ct1",name:"Full-time",desc:"Permanent full-time",duration:"Indefinite",color:"#0D9F6E"},
    {id:"ct2",name:"Part-time",desc:"Permanent part-time",duration:"Indefinite",color:"#2D5BFF"},
    {id:"ct3",name:"Contract",desc:"Fixed-term contract",duration:"Fixed",color:"#D97706"},
    {id:"ct4",name:"Freelance",desc:"Project-based",duration:"Per project",color:"#7C3AED"},
    {id:"ct5",name:"Internship",desc:"Intern position",duration:"3-6 months",color:"#0891B2"},
    {id:"ct6",name:"Temporary",desc:"Temporary staffing",duration:"Variable",color:"#BE185D"},
  ],
};

export const initialEmployees: Employee[] = [
  {id:1,nm:"Sarah Chen",role:"Engineering Manager",dept:"Engineering",sub:"Frontend",rank:"Lead",branch:"San Francisco HQ",email:"sarah.chen@gmail.com",ph:"+1 (555) 234-5678",loc:"San Francisco, CA",st:"active",av:"SC",hire:"2021-03-15",sal:"$185,000",mgr:"David Park",eid:"EMP-001",tp:"Full-time",contract:"Full-time",compEmail:"sarah.chen@company.com",compPhone:"+1 (800) 555-0100",compExt:"1001",history:[
    {id:"h1a",date:"2021-03-15",type:"hire",from:"",to:"Software Engineer",note:"Joined as Software Engineer"},
    {id:"h1b",date:"2022-01-10",type:"rank",from:"Junior",to:"Mid-Level",note:"Promoted after strong Q4 performance"},
    {id:"h1c",date:"2022-09-01",type:"position",from:"Software Engineer",to:"Senior Software Engineer",note:"Promoted to Senior"},
    {id:"h1d",date:"2023-04-01",type:"rank",from:"Mid-Level",to:"Senior",note:"Rank promotion"},
    {id:"h1e",date:"2024-01-15",type:"position",from:"Senior Software Engineer",to:"Engineering Manager",note:"Moved to management track"},
    {id:"h1f",date:"2024-01-15",type:"rank",from:"Senior",to:"Lead",note:"Lead rank with management role"},
    {id:"h1g",date:"2024-06-01",type:"manager",from:"Lisa Johnson",to:"David Park",note:"Reporting line changed in reorg"},
  ]},
  {id:2,nm:"Marcus Williams",role:"Senior Designer",dept:"Design",sub:"UI/UX",rank:"Senior",branch:"New York Office",email:"marcus.w@gmail.com",ph:"+1 (555) 345-6789",loc:"New York, NY",st:"active",av:"MW",hire:"2022-01-10",sal:"$145,000",mgr:"Lisa Johnson",eid:"EMP-002",tp:"Full-time",contract:"Full-time",compEmail:"marcus.w@company.com",compPhone:"+1 (800) 555-0100",compExt:"1002",history:[
    {id:"h2a",date:"2022-01-10",type:"hire",from:"",to:"Designer",note:"Joined as Designer"},
    {id:"h2b",date:"2022-08-15",type:"rank",from:"Junior",to:"Mid-Level",note:"Promoted after 6-month review"},
    {id:"h2c",date:"2023-06-01",type:"position",from:"Designer",to:"Senior Designer",note:"Promoted to Senior Designer"},
    {id:"h2d",date:"2023-06-01",type:"rank",from:"Mid-Level",to:"Senior",note:"Senior rank"},
    {id:"h2e",date:"2024-03-01",type:"branch",from:"San Francisco HQ",to:"New York Office",note:"Relocated to NY office"},
  ]},
  {id:3,nm:"Priya Patel",role:"Product Manager",dept:"Product",sub:"Product Management",rank:"Senior",branch:"Remote",email:"priya.p@gmail.com",ph:"+1 (555) 456-7890",loc:"Austin, TX",st:"active",av:"PP",hire:"2020-08-22",sal:"$165,000",mgr:"David Park",eid:"EMP-003",tp:"Full-time",contract:"Full-time",compEmail:"priya.p@company.com",compPhone:"+1 (800) 555-0100",compExt:"1003",history:[
    {id:"h3a",date:"2020-08-22",type:"hire",from:"",to:"Associate PM",note:"Joined as Associate PM"},
    {id:"h3b",date:"2021-03-01",type:"rank",from:"Junior",to:"Mid-Level",note:"Promoted"},
    {id:"h3c",date:"2022-02-01",type:"position",from:"Associate PM",to:"Product Manager",note:"Promoted to PM"},
    {id:"h3d",date:"2023-01-15",type:"rank",from:"Mid-Level",to:"Senior",note:"Senior promotion"},
    {id:"h3e",date:"2023-06-01",type:"branch",from:"San Francisco HQ",to:"Remote",note:"Moved to remote"},
    {id:"h3f",date:"2024-02-01",type:"department",from:"Engineering",to:"Product",note:"Transferred to Product dept"},
  ]},
  {id:4,nm:"James O'Brien",role:"DevOps Engineer",dept:"Engineering",sub:"DevOps",rank:"Mid-Level",branch:"Remote",email:"james.ob@gmail.com",ph:"+1 (555) 567-8901",loc:"Remote",st:"on_leave",av:"JO",hire:"2023-02-14",sal:"$155,000",mgr:"Sarah Chen",eid:"EMP-004",tp:"Full-time",contract:"Full-time",compEmail:"james.ob@company.com",compPhone:"+1 (800) 555-0100",compExt:"1004",history:[
    {id:"h4a",date:"2023-02-14",type:"hire",from:"",to:"DevOps Engineer",note:"Joined as DevOps Engineer"},
    {id:"h4b",date:"2023-08-01",type:"rank",from:"Junior",to:"Mid-Level",note:"Passed probation, promoted"},
    {id:"h4c",date:"2025-02-20",type:"status",from:"Active",to:"On Leave",note:"Annual leave"},
  ]},
  {id:5,nm:"Aisha Mohammed",role:"HR Specialist",dept:"Human Resources",sub:"People Ops",rank:"Mid-Level",branch:"San Francisco HQ",email:"aisha.m@gmail.com",ph:"+1 (555) 678-9012",loc:"Chicago, IL",st:"active",av:"AM",hire:"2022-06-01",sal:"$95,000",mgr:"Rachel Kim",eid:"EMP-005",tp:"Full-time",contract:"Full-time",compEmail:"aisha.m@company.com",compPhone:"+1 (800) 555-0100",compExt:"1005",history:[
    {id:"h5a",date:"2022-06-01",type:"hire",from:"",to:"HR Assistant",note:"Joined as HR Assistant"},
    {id:"h5b",date:"2023-01-01",type:"position",from:"HR Assistant",to:"HR Specialist",note:"Promoted to Specialist"},
    {id:"h5c",date:"2023-01-01",type:"rank",from:"Junior",to:"Mid-Level",note:"Rank promotion"},
  ]},
  {id:6,nm:"Tom Fischer",role:"Data Analyst",dept:"Product",sub:"Product Analytics",rank:"Junior",branch:"Remote",email:"tom.f@gmail.com",ph:"+1 (555) 789-0123",loc:"Denver, CO",st:"active",av:"TF",hire:"2023-09-18",sal:"$120,000",mgr:"Priya Patel",eid:"EMP-006",tp:"Full-time",contract:"Full-time",compEmail:"tom.f@company.com",compPhone:"+1 (800) 555-0100",compExt:"1006",history:[
    {id:"h6a",date:"2023-09-18",type:"hire",from:"",to:"Data Analyst",note:"Joined as Data Analyst"},
  ]},
  {id:7,nm:"Elena Rodriguez",role:"Marketing Lead",dept:"Marketing",sub:"Growth",rank:"Lead",branch:"Remote",email:"elena.r@gmail.com",ph:"+1 (555) 890-1234",loc:"Miami, FL",st:"active",av:"ER",hire:"2021-11-05",sal:"$135,000",mgr:"David Park",eid:"EMP-007",tp:"Full-time",contract:"Full-time",compEmail:"elena.r@company.com",compPhone:"+1 (800) 555-0100",compExt:"1007",history:[
    {id:"h7a",date:"2021-11-05",type:"hire",from:"",to:"Marketing Specialist",note:"Joined as Marketing Specialist"},
    {id:"h7b",date:"2022-06-01",type:"rank",from:"Junior",to:"Mid-Level",note:"Promoted"},
    {id:"h7c",date:"2023-03-01",type:"position",from:"Marketing Specialist",to:"Marketing Lead",note:"Promoted to Lead"},
    {id:"h7d",date:"2023-03-01",type:"rank",from:"Mid-Level",to:"Lead",note:"Lead rank"},
    {id:"h7e",date:"2024-01-01",type:"department",from:"Sales",to:"Marketing",note:"Moved to Marketing dept"},
  ]},
  {id:8,nm:"Kai Nakamura",role:"Software Engineer",dept:"Engineering",sub:"Frontend",rank:"Mid-Level",branch:"Remote",email:"kai.n@gmail.com",ph:"+1 (555) 901-2345",loc:"Seattle, WA",st:"active",av:"KN",hire:"2023-04-20",sal:"$140,000",mgr:"Sarah Chen",eid:"EMP-008",tp:"Contract",contract:"Contract",compEmail:"kai.n@company.com",compPhone:"+1 (800) 555-0100",compExt:"1008",history:[
    {id:"h8a",date:"2023-04-20",type:"hire",from:"",to:"Software Engineer",note:"Joined as contractor"},
    {id:"h8b",date:"2023-10-01",type:"rank",from:"Junior",to:"Mid-Level",note:"Promoted after strong performance"},
    {id:"h8c",date:"2024-04-20",type:"contract",from:"Contract (6mo)",to:"Contract (renewed)",note:"Contract renewed for another year"},
  ]},
  {id:9,nm:"Diana Costa",role:"Recruiter",dept:"Human Resources",sub:"Recruitment",rank:"Mid-Level",branch:"New York Office",email:"diana.c@gmail.com",ph:"+1 (555) 012-3456",loc:"Boston, MA",st:"active",av:"DC",hire:"2022-10-12",sal:"$88,000",mgr:"Rachel Kim",eid:"EMP-009",tp:"Full-time",contract:"Full-time",compEmail:"diana.c@company.com",compPhone:"+1 (800) 555-0100",compExt:"1009",history:[
    {id:"h9a",date:"2022-10-12",type:"hire",from:"",to:"Recruiting Coordinator",note:"Joined as Coordinator"},
    {id:"h9b",date:"2023-04-01",type:"position",from:"Recruiting Coordinator",to:"Recruiter",note:"Promoted to Recruiter"},
    {id:"h9c",date:"2023-04-01",type:"rank",from:"Junior",to:"Mid-Level",note:"Rank promotion"},
  ]},
  {id:10,nm:"Alex Thompson",role:"Sales Manager",dept:"Sales",sub:"Enterprise",rank:"Lead",branch:"London Office",email:"alex.t@gmail.com",ph:"+1 (555) 123-4567",loc:"Los Angeles, CA",st:"active",av:"AT",hire:"2020-05-30",sal:"$150,000",mgr:"David Park",eid:"EMP-010",tp:"Full-time",contract:"Full-time",compEmail:"alex.t@company.com",compPhone:"+44 (800) 555-0200",compExt:"2001",history:[
    {id:"h10a",date:"2020-05-30",type:"hire",from:"",to:"Sales Rep",note:"Joined as Sales Rep"},
    {id:"h10b",date:"2021-01-15",type:"rank",from:"Junior",to:"Mid-Level",note:"Promoted"},
    {id:"h10c",date:"2021-09-01",type:"position",from:"Sales Rep",to:"Senior Sales Rep",note:"Promoted to Senior"},
    {id:"h10d",date:"2022-06-01",type:"rank",from:"Mid-Level",to:"Senior",note:"Senior rank"},
    {id:"h10e",date:"2023-02-01",type:"position",from:"Senior Sales Rep",to:"Sales Manager",note:"Promoted to Manager"},
    {id:"h10f",date:"2023-02-01",type:"rank",from:"Senior",to:"Lead",note:"Lead rank"},
    {id:"h10g",date:"2024-01-01",type:"branch",from:"San Francisco HQ",to:"London Office",note:"Relocated to lead EMEA sales"},
  ]},
];
