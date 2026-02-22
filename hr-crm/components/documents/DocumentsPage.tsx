"use client";
import { useState, useMemo } from "react";
import { FileText, File, Image, Plus, Search, Filter, Eye, Trash2, Edit, X, Users, Building2, User, Globe, ChevronDown, Download, Tag } from "lucide-react";
import { Btn, MiniInput, Select, FormField, Input, Modal, Toggle, Toast } from "@/components/ui/shared";
import { Settings, Document, generateId } from "@/lib/data";
import { useTheme } from "@/lib/ThemeContext";

const fileIcons: Record<string, { icon: any; color: string }> = {
  pdf: { icon: FileText, color: "#E53E3E" },
  doc: { icon: File, color: "#2D5BFF" },
  img: { icon: Image, color: "#D97706" },
  other: { icon: File, color: "#6B6966" },
};

const assignLabels: Record<string, { label: string; icon: any; color: string }> = {
  everyone: { label: "Everyone", icon: Globe, color: "#0D9F6E" },
  departments: { label: "Departments", icon: Building2, color: "#2D5BFF" },
  sub_departments: { label: "Sub-Departments", icon: Building2, color: "#7C3AED" },
  employees: { label: "Employees", icon: Users, color: "#D97706" },
  single: { label: "Employee", icon: User, color: "#BE185D" },
};

export default function DocumentsPage({ settings, setSettings }: { settings: Settings; setSettings: (fn: (s: Settings) => Settings) => void }) {
  const { theme: t } = useTheme();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterAssign, setFilterAssign] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [preview, setPreview] = useState<Document | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [editDoc, setEditDoc] = useState<Document | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const docs = settings.documents || [];
  const cats = settings.docCategories || [];

  const filtered = useMemo(() => {
    return docs.filter(d => {
      if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCat && d.category !== filterCat) return false;
      if (filterAssign && d.assignTo !== filterAssign) return false;
      if (filterStatus && d.status !== filterStatus) return false;
      return true;
    });
  }, [docs, search, filterCat, filterAssign, filterStatus]);

  const delDoc = (id: string) => {
    setSettings(p => ({ ...p, documents: p.documents.filter(d => d.id !== id) }));
    setToast("Document removed");
  };

  const catColor = (name: string) => cats.find(c => c.name === name)?.color || "#6B6966";

  // ─── ADD / EDIT MODAL ───
  function DocModal({ doc, onClose }: { doc: Document | null; onClose: () => void }) {
    const isEdit = !!doc;
    const [f, sF] = useState<Record<string, any>>(doc || { name: "", category: "", assignTo: "everyone", assignValues: [], fileType: "pdf", fileSize: "", status: "active", content: "", uploadedBy: "Rachel Green", uploadDate: new Date().toISOString().slice(0, 10) });
    const u = (k: string, v: any) => sF(p => ({ ...p, [k]: v }));

    const allDepts = settings.departments.map(d => d.name);
    const allSubs = settings.departments.flatMap(d => d.subs.map(s => s.name));
    const allEmps = ["Sarah Chen", "Marcus Williams", "Priya Patel", "James O'Brien", "Aisha Mohammed", "Tom Fischer", "Elena Rodriguez", "Kai Nakamura", "Diana Costa", "Alex Thompson"];

    const toggleVal = (val: string) => {
      const curr: string[] = f.assignValues || [];
      u("assignValues", curr.includes(val) ? curr.filter((v: string) => v !== val) : [...curr, val]);
    };

    const save = () => {
      if (!f.name || !f.category) return;
      if (isEdit) {
        setSettings(p => ({ ...p, documents: p.documents.map(d => d.id === doc!.id ? { ...d, ...f } : d) }));
        setToast("Document updated");
      } else {
        setSettings(p => ({ ...p, documents: [...p.documents, { id: generateId("doc"), ...f } as Document] }));
        setToast("Document added");
      }
      onClose();
    };

    const chipStyle = (active: boolean) => ({
      padding: "5px 12px", borderRadius: 8, border: `1px solid ${active ? t.accent : t.border}`,
      background: active ? t.accentLight : t.surface, color: active ? t.accent : t.textSecondary,
      fontSize: 12, fontWeight: 500 as const, cursor: "pointer" as const,
    });

    return (
      <Modal title={isEdit ? "Edit Document" : "Add Document"} onClose={onClose} wide>
        <FormField label="Document Name" required><Input value={f.name || ""} onChange={v => u("name", v)} placeholder="e.g. Employee Handbook 2026" /></FormField>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><FormField label="Category" required><Select value={f.category || ""} onChange={v => u("category", v)} options={cats.map(c => c.name)} placeholder="Select category" /></FormField></div>
          <div style={{ flex: 1 }}><FormField label="File Type"><Select value={f.fileType || "pdf"} onChange={v => u("fileType", v)} options={[{ value: "pdf", label: "PDF" }, { value: "doc", label: "Document" }, { value: "img", label: "Image" }, { value: "other", label: "Other" }]} /></FormField></div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><FormField label="File Size"><Input value={f.fileSize || ""} onChange={v => u("fileSize", v)} placeholder="e.g. 2.4 MB" /></FormField></div>
          <div style={{ flex: 1 }}><FormField label="Status"><Select value={f.status || "active"} onChange={v => u("status", v)} options={[{ value: "active", label: "Active" }, { value: "draft", label: "Draft" }, { value: "archived", label: "Archived" }]} /></FormField></div>
        </div>

        <FormField label="Assign To" required>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            {Object.entries(assignLabels).map(([k, v]) => (
              <button key={k} onClick={() => { u("assignTo", k); u("assignValues", []); }} style={chipStyle(f.assignTo === k)}>
                <v.icon size={12} style={{ marginRight: 4, verticalAlign: "middle" }} />{v.label}
              </button>
            ))}
          </div>
        </FormField>

        {f.assignTo === "departments" && <FormField label="Select Departments">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            {allDepts.map(d => <button key={d} onClick={() => toggleVal(d)} style={chipStyle((f.assignValues || []).includes(d))}>{d}</button>)}
          </div>
        </FormField>}

        {f.assignTo === "sub_departments" && <FormField label="Select Sub-Departments">
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            {allSubs.map(s => <button key={s} onClick={() => toggleVal(s)} style={chipStyle((f.assignValues || []).includes(s))}>{s}</button>)}
          </div>
        </FormField>}

        {(f.assignTo === "employees" || f.assignTo === "single") && <FormField label={f.assignTo === "single" ? "Select Employee" : "Select Employees"}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
            {allEmps.map(e => <button key={e} onClick={() => {
              if (f.assignTo === "single") u("assignValues", [e]);
              else toggleVal(e);
            }} style={chipStyle((f.assignValues || []).includes(e))}>{e}</button>)}
          </div>
        </FormField>}

        <FormField label="Description / Content"><Input value={f.content || ""} onChange={v => u("content", v)} placeholder="Brief description of the document" /></FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.border}` }}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={save} icon={isEdit ? Edit : Plus}>{isEdit ? "Update" : "Add Document"}</Btn>
        </div>
      </Modal>
    );
  }

  // ─── PREVIEW MODAL ───
  function PreviewModal({ doc }: { doc: Document }) {
    const fi = fileIcons[doc.fileType] || fileIcons.other;
    return (
      <Modal title="" onClose={() => setPreview(null)} wide>
        <div style={{ textAlign: "center" as const, padding: "20px 0" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: fi.color + "15", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <fi.icon size={32} color={fi.color} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: "0 0 8px" }}>{doc.name}</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: catColor(doc.category), background: catColor(doc.category) + "15", padding: "3px 10px", borderRadius: 6, fontWeight: 600 }}>{doc.category}</span>
            <span style={{ fontSize: 12, color: t.textSecondary }}>{doc.fileType.toUpperCase()} · {doc.fileSize}</span>
            <span style={{ fontSize: 12, color: t.textTertiary }}>Uploaded {doc.uploadDate} by {doc.uploadedBy}</span>
          </div>
        </div>
        <div style={{ background: t.bg, borderRadius: 12, border: `1px solid ${t.borderLight}`, padding: 24, minHeight: 200 }}>
          {doc.fileType === "img" ? (
            <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 12 }}>
              <div style={{ width: 200, height: 260, borderRadius: 12, background: `linear-gradient(135deg, ${fi.color}20, ${fi.color}10)`, display: "flex", alignItems: "center", justifyContent: "center", border: `2px dashed ${fi.color}40` }}>
                <Image size={48} color={fi.color} strokeWidth={1} />
              </div>
              <span style={{ fontSize: 13, color: t.textTertiary, fontStyle: "italic" as const }}>{doc.content}</span>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 14, lineHeight: 1.8, color: t.text, whiteSpace: "pre-wrap" as const }}>{doc.content}</div>
            </div>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <Btn variant="secondary" icon={Download}>Download</Btn>
          <Btn variant="secondary" onClick={() => { setPreview(null); setEditDoc(doc); }} icon={Edit}>Edit</Btn>
        </div>
      </Modal>
    );
  }

  const statusColor: Record<string, string> = { active: t.success, draft: t.warning, archived: t.textTertiary };
  const hasFilters = filterCat || filterAssign || filterStatus;

  return <div style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
    {/* HEADER */}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>Documents</h2>
        <p style={{ fontSize: 13, color: t.textTertiary, margin: "4px 0 0" }}>{docs.length} documents · {docs.filter(d => d.status === "active").length} active</p>
      </div>
      <Btn onClick={() => setAddModal(true)} icon={Plus}>Add Document</Btn>
    </div>

    {/* SEARCH + FILTERS */}
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, flex: 1, maxWidth: 400 }}>
        <Search size={16} color={t.textTertiary} />
        <input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, color: t.text, background: "transparent", width: "100%" }} />
      </div>
      <button onClick={() => setShowFilters(!showFilters)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: hasFilters ? t.accentLight : t.surface, color: hasFilters ? t.accent : t.textSecondary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        <Filter size={14} />Filters{hasFilters && <span style={{ width: 6, height: 6, borderRadius: 3, background: t.accent }} />}
      </button>
    </div>

    {showFilters && <div className="animate-fade-slide-up" style={{ display: "flex", gap: 12, marginBottom: 16, padding: 16, background: t.surface, borderRadius: 12, border: `1px solid ${t.border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Category</div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }}>
          <option value="">All Categories</option>
          {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Assigned To</div>
        <select value={filterAssign} onChange={e => setFilterAssign(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }}>
          <option value="">All</option>
          {Object.entries(assignLabels).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, marginBottom: 6, textTransform: "uppercase" as const }}>Status</div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, fontSize: 13, color: t.text, background: t.inputBg, outline: "none" }}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      {hasFilters && <button onClick={() => { setFilterCat(""); setFilterAssign(""); setFilterStatus(""); }} style={{ alignSelf: "flex-end", padding: "8px 14px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.surface, color: t.textSecondary, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Clear</button>}
    </div>}

    {/* DOCUMENT LIST */}
    <div style={{ background: t.surface, borderRadius: 16, border: `1px solid ${t.border}`, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 160px 80px 70px 80px", padding: "12px 20px", borderBottom: `1px solid ${t.borderLight}`, gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, textTransform: "uppercase" as const }}>Document</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, textTransform: "uppercase" as const }}>Category</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, textTransform: "uppercase" as const }}>Assigned To</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, textTransform: "uppercase" as const }}>Size</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: t.textTertiary, textTransform: "uppercase" as const }}>Status</span>
        <span />
      </div>

      {filtered.length === 0 ? <div style={{ padding: 40, textAlign: "center" as const, color: t.textTertiary }}>No documents found</div>
      : filtered.map((doc, i) => {
        const fi = fileIcons[doc.fileType] || fileIcons.other;
        const al = assignLabels[doc.assignTo];
        return <div key={doc.id} style={{ display: "grid", gridTemplateColumns: "1fr 140px 160px 80px 70px 80px", padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${t.borderLight}` : "none", alignItems: "center", gap: 8, cursor: "pointer" }} onMouseEnter={e => e.currentTarget.style.background = t.surfaceHover} onMouseLeave={e => e.currentTarget.style.background = "transparent"} onClick={() => setPreview(doc)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: fi.color + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <fi.icon size={18} color={fi.color} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 550, color: t.text }}>{doc.name}</div>
              <div style={{ fontSize: 11, color: t.textTertiary }}>{doc.uploadDate} · {doc.uploadedBy}</div>
            </div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: catColor(doc.category), background: catColor(doc.category) + "15", padding: "3px 8px", borderRadius: 6, justifySelf: "start" }}>{doc.category}</span>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <al.icon size={12} color={al.color} />
              <span style={{ fontSize: 12, color: al.color, fontWeight: 600 }}>{al.label}</span>
            </div>
            {doc.assignValues.length > 0 && <div style={{ fontSize: 11, color: t.textTertiary, marginTop: 2 }}>{doc.assignValues.slice(0, 2).join(", ")}{doc.assignValues.length > 2 ? ` +${doc.assignValues.length - 2}` : ""}</div>}
          </div>
          <span style={{ fontSize: 12, color: t.textSecondary }}>{doc.fileSize}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: statusColor[doc.status], textTransform: "capitalize" as const }}>{doc.status}</span>
          <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(doc)} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = t.accentLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Eye size={14} color={t.accent} /></button>
            <button onClick={() => setEditDoc(doc)} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = t.accentLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Edit size={14} color={t.accent} /></button>
            <button onClick={() => delDoc(doc.id)} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = t.dangerLight} onMouseLeave={e => e.currentTarget.style.background = "transparent"}><Trash2 size={14} color={t.danger} /></button>
          </div>
        </div>;
      })}
    </div>

    {addModal && <DocModal doc={null} onClose={() => setAddModal(false)} />}
    {editDoc && <DocModal doc={editDoc} onClose={() => setEditDoc(null)} />}
    {preview && <PreviewModal doc={preview} />}
    {toast && <Toast message={toast} onClose={() => setToast(null)} />}
  </div>;
}
