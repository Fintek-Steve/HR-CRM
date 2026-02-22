"use client";
import { useEffect, ReactNode } from "react";
import { X, Check } from "lucide-react";
import { avatarColors } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

export function Avatar({ initials, size = 40, index = 0 }: { initials: string; size?: number; index?: number }) {
  const color = avatarColors[index % avatarColors.length];
  return <div style={{ width: size, height: size, borderRadius: size / 2, background: `linear-gradient(135deg, ${color}, ${color}dd)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.35, fontWeight: 600, flexShrink: 0 }}>{initials}</div>;
}

export function StatusBadge({ status }: { status: string }) {
  const { theme: t } = useTheme();
  const map: Record<string, { bg: string; c: string; l: string }> = {
    active: { bg: t.successLight, c: t.success, l: "Active" },
    on_leave: { bg: t.warningLight, c: t.warning, l: "On Leave" },
    inactive: { bg: t.dangerLight, c: t.danger, l: "Inactive" },
  };
  const s = map[status] || map.active;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: s.bg, color: s.c, fontSize: 12, fontWeight: 600 }}><span style={{ width: 6, height: 6, borderRadius: 3, background: s.c }} />{s.l}</span>;
}

export function ScopeBadge({ scope, value, value2 }: { scope: string; value: string; value2?: string }) {
  const { theme: t } = useTheme();
  if (scope === "position_rank") {
    const parts = [value, value2].filter(Boolean);
    const label = parts.length > 0 ? parts.join(" + ") : "All";
    return <span style={{ fontSize: 11, fontWeight: 600, color: t.accent, background: t.accent + "12", padding: "2px 8px", borderRadius: 6 }}>Pos & Rank: {label}</span>;
  }
  if (scope === "employee" && value) return <span style={{ fontSize: 11, fontWeight: 600, color: t.success, background: t.success + "12", padding: "2px 8px", borderRadius: 6 }}>Employee: {value}</span>;
  return <span style={{ fontSize: 11, color: t.textTertiary, background: t.bg, padding: "2px 8px", borderRadius: 6 }}>{scope}</span>;
}

export function Btn({ children, variant = "primary", onClick, icon: Icon, sm, disabled }: { children: ReactNode; variant?: string; onClick?: () => void; icon?: any; sm?: boolean; disabled?: boolean }) {
  const { theme: t } = useTheme();
  const styles: Record<string, { bg: string; c: string; b: string }> = {
    primary: { bg: t.accent, c: "#fff", b: "none" },
    secondary: { bg: t.surface, c: t.textSecondary, b: `1px solid ${t.border}` },
    danger: { bg: t.dangerLight, c: t.danger, b: `1px solid ${t.danger}30` },
    ghost: { bg: "transparent", c: t.textSecondary, b: "none" },
  };
  const s = styles[variant || "primary"] || styles.primary;
  return <button onClick={onClick} disabled={disabled} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: sm ? "6px 12px" : "10px 18px", borderRadius: 10, background: s.bg, color: s.c, border: s.b, cursor: disabled ? "not-allowed" : "pointer", fontSize: sm ? 12 : 14, fontWeight: 600, transition: "all 0.15s", opacity: disabled ? 0.5 : 1 }}>{Icon && <Icon size={sm ? 14 : 16} />}{children}</button>;
}

export function Input({ value, onChange, placeholder, type = "text", disabled = false }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean }) {
  const { theme: t } = useTheme();
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, fontSize: 14, color: disabled ? t.textTertiary : t.text, outline: "none", background: disabled ? t.inputDisabledBg : t.inputBg, boxSizing: "border-box" as const }} onFocus={e => { if (!disabled) e.target.style.borderColor = t.accent; }} onBlur={e => { e.target.style.borderColor = t.border; }} />;
}

export function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: (string | { value: string; label: string })[]; placeholder?: string }) {
  const { theme: t } = useTheme();
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, fontSize: 14, color: value ? t.text : t.textTertiary, outline: "none", background: t.inputBg, boxSizing: "border-box" as const, cursor: "pointer" }}>{placeholder && <option value="">{placeholder}</option>}{options.map(o => { const v = typeof o === "string" ? o : o.value; const l = typeof o === "string" ? o : o.label; return <option key={v} value={v}>{l}</option>; })}</select>;
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const { theme: t } = useTheme();
  return <button onClick={() => onChange(!checked)} style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: checked ? t.accent : t.border, cursor: "pointer", position: "relative" as const, transition: "background 0.2s", flexShrink: 0 }}><div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute" as const, top: 3, left: checked ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} /></button>;
}

export function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  const { theme: t } = useTheme();
  return <div style={{ marginBottom: 16 }}><label style={{ display: "block", fontSize: 13, fontWeight: 600, color: t.text, marginBottom: 6 }}>{label}{required && <span style={{ color: t.danger }}> *</span>}</label>{children}</div>;
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const { theme: t } = useTheme();
  return <div className="animate-fade-in" style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}><div style={{ position: "absolute", inset: 0, background: t.modalOverlay, backdropFilter: "blur(4px)" }} /><div className="animate-slide-up" style={{ position: "relative", background: t.surface, borderRadius: 20, width: wide ? 640 : 560, maxHeight: "85vh", display: "flex", flexDirection: "column" as const, boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${t.border}` }}><h3 style={{ fontSize: 17, fontWeight: 650, color: t.text, margin: 0 }}>{title}</h3><button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: t.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} color={t.textSecondary} /></button></div><div style={{ padding: 24, overflowY: "auto" as const, flex: 1 }}>{children}</div></div></div>;
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const { theme: t } = useTheme();
  useEffect(() => { const ti = setTimeout(onClose, 2500); return () => clearTimeout(ti); }, [onClose]);
  return <div className="animate-slide-up" style={{ position: "fixed", bottom: 24, right: 24, zIndex: 2000, display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 12, background: t.toastBg, color: "#fff", fontSize: 14, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}><Check size={16} />{message}</div>;
}
