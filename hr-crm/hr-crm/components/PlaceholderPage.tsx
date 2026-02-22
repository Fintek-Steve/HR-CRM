"use client";
import { useTheme } from "@/lib/ThemeContext";
export default function PlaceholderPage({ title, icon: Icon }: { title: string; icon: any }) {
  const { theme: t } = useTheme();
  return <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}><div className="animate-fade-slide-up" style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, padding: 64, textAlign: "center" as const }}><div style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px", background: t.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={32} color={t.accent} strokeWidth={1.5} /></div><div style={{ fontSize: 22, fontWeight: 700, color: t.text, marginBottom: 8 }}>{title}</div><div style={{ fontSize: 15, color: t.textSecondary }}>Coming in an upcoming phase.</div></div></div>;
}
