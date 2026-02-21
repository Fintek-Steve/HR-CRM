"use client";

import { useState } from "react";
import { Briefcase, Calendar, DollarSign } from "lucide-react";
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

export default function Home() {
  const [page, setPage] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [settings, setSettings] = useState<Settings>(initialSettings);

  const navigate = (p: string) => {
    setPage(p);
    setSelectedEmployee(null);
  };

  const current = selectedEmployee
    ? { title: "Employee Profile", subtitle: selectedEmployee.nm }
    : pageConfig[page];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8F7F4" }}>
      <Sidebar active={page} onNavigate={navigate} />

      <div style={{ flex: 1, marginLeft: 240, minHeight: "100vh" }}>
        <TopBar title={current.title} subtitle={current.subtitle} />

        <div style={{ overflowY: "auto", height: "calc(100vh - 73px)" }}>
          {selectedEmployee ? (
            <EmployeeDetail
              emp={selectedEmployee}
              onBack={() => setSelectedEmployee(null)}
              settings={settings}
            />
          ) : page === "dashboard" ? (
            <DashboardPage onNavigate={navigate} />
          ) : page === "employees" ? (
            <EmployeesPage
              onSelect={setSelectedEmployee}
              settings={settings}
              employees={initialEmployees}
            />
          ) : page === "settings" ? (
            <SettingsPage settings={settings} setSettings={setSettings} />
          ) : page === "recruitment" ? (
            <PlaceholderPage title="Recruitment & ATS" icon={Briefcase} />
          ) : page === "leave" ? (
            <PlaceholderPage title="Leave Management" icon={Calendar} />
          ) : page === "payroll" ? (
            <PlaceholderPage title="Payroll & Compensation" icon={DollarSign} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
