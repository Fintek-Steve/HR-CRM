"use client";

import { Bell, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/shared";
import { colors } from "@/lib/data";

export default function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "20px 32px", background: colors.surface,
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0, letterSpacing: "-0.02em" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: colors.textSecondary, margin: "4px 0 0", fontWeight: 450 }}>{subtitle}</p>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button style={{
          width: 40, height: 40, borderRadius: 10,
          border: `1px solid ${colors.border}`, background: colors.surface,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <Bell size={18} color={colors.textSecondary} strokeWidth={1.8} />
          <span style={{
            position: "absolute", top: 8, right: 8,
            width: 8, height: 8, borderRadius: 4,
            background: colors.danger, border: "2px solid #fff",
          }} />
        </button>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "6px 12px 6px 6px", borderRadius: 10,
          border: `1px solid ${colors.border}`, cursor: "pointer",
        }}>
          <Avatar initials="RK" size={32} index={3} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>Rachel Kim</div>
            <div style={{ fontSize: 11, color: colors.textTertiary }}>HR Director</div>
          </div>
          <ChevronDown size={14} color={colors.textTertiary} />
        </div>
      </div>
    </div>
  );
}
