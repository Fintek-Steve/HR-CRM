"use client";

import { colors } from "@/lib/data";

export default function PlaceholderPage({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: "0 auto" }}>
      <div className="animate-fade-slide-up" style={{ background: colors.surface, borderRadius: 16, border: `1px solid ${colors.border}`, padding: 64, textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, margin: "0 auto 20px", background: colors.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={32} color={colors.accent} strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: colors.text, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 15, color: colors.textSecondary, maxWidth: 400, margin: "0 auto", lineHeight: 1.6 }}>
          This module will be built in an upcoming development phase. The foundation is ready to support it.
        </div>
      </div>
    </div>
  );
}
