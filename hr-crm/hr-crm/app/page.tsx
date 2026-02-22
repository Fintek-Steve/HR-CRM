"use client";
import { useState } from "react";
import { Briefcase, Calendar, DollarSign } from "lucide-react";
import { ThemeProvider, useTheme } from "@/lib/ThemeContext";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import DashboardPage from "@/components/DashboardPage";
import EmployeesPage from "@/components/employees/EmployeesPage";
import EmployeeDetail from "@/components/employees/EmployeeDetail";
import SettingsPage from "@/components/settings/SettingsPage";
import PlaceholderPage from "@/components/PlaceholderPage";
import { initialSettings, initialEmployees, Settings, Employee } from "@/lib/data";

const pageConfig: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Dashboard", subtitle: "Welcome back, Rachel." },
  employees: { title: "Employee Directory", subtitle: `${initialEmployees.length} team members` },
  recruitment: { title: "Recruitment", subtitle: "Manage job postings and pipeline" },
  leave: { title: "Leave Management", subtitle: "Track and approve leave requests" },
  payroll: { title: "Payroll & Compensation", subtitle: "Manage salaries and payroll" },
  settings: { title: "Settings", subtitle: "Configure your organization" },
};

function AppInner() {
  const { theme: t } = useTheme();
  const [page, setPage] = useState("dashboard");
  const [selEmp, setSelEmp] = useState<Employee | null>(null);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const nav = (p: string) => { setPage(p); setSelEmp(null); };
  const cur = selEmp ? { title: "Employee Profile", subtitle: selEmp.nm } : pageConfig[page];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.bg }}>
      <Sidebar active={page} onNavigate={nav} />
      <div style={{ flex: 1, marginLeft: 240, minHeight: "100vh" }}>
        <TopBar title={cur.title} subtitle={cur.subtitle} />
        <div style={{ overflowY: "auto", height: "calc(100vh - 73px)" }}>
          {selEmp ? <EmployeeDetail emp={selEmp} onBack={() => setSelEmp(null)} settings={settings} />
            : page === "dashboard" ? <DashboardPage onNavigate={nav} />
            : page === "employees" ? <EmployeesPage onSelect={setSelEmp} settings={settings} employees={initialEmployees} />
            : page === "settings" ? <SettingsPage settings={settings} setSettings={setSettings} />
            : page === "recruitment" ? <PlaceholderPage title="Recruitment & ATS" icon={Briefcase} />
            : page === "leave" ? <PlaceholderPage title="Leave Management" icon={Calendar} />
            : page === "payroll" ? <PlaceholderPage title="Payroll & Compensation" icon={DollarSign} />
            : null}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return <ThemeProvider><AppInner /></ThemeProvider>;
}
