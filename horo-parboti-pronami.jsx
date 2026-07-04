import { useState, useEffect, useCallback } from "react";
import {
  Shield, Users, Search, Plus, Pencil, Trash2, Check, X, LogOut,
  Coins, ArrowLeft, Lock, UserPlus, ClipboardList, TrendingUp,
  Clock, CheckCircle2, KeyRound, Phone,
} from "lucide-react";

/* ---------------------------------------------------------------
   Design tokens — Horo Parboti Jubo Songho
   A puja-pandal palette: deep maroon, marigold gold, warm cream,
   a Shiva-blue teal for the "settled" state. The garland (toran)
   motif is the signature element, used as a divider throughout.
------------------------------------------------------------------*/
const C = {
  maroon: "#6E1423",
  maroonDark: "#4A0D18",
  gold: "#E8A33D",
  goldSoft: "#F2C879",
  cream: "#FBF3E4",
  card: "#FFFDF8",
  teal: "#16424D",
  ink: "#2B1B17",
  inkSoft: "#6B564E",
  pending: "#C97A26",
  approved: "#3F7D5C",
  line: "#E9DCC4",
};

function useGoogleFonts() {
  useEffect(() => {
    const id = "hpjs-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function Garland({ inverted }) {
  const color = inverted ? C.gold : C.maroon;
  const dots = Array.from({ length: 22 });
  return (
    <div style={{ display: "flex", justifyContent: "center", overflow: "hidden", height: 14, margin: "2px 0" }}>
      <svg width="100%" height="14" viewBox="0 0 440 14" preserveAspectRatio="none">
        <path d="M0,2 Q10,14 20,2 Q30,14 40,2 Q50,14 60,2 Q70,14 80,2 Q90,14 100,2 Q110,14 120,2 Q130,14 140,2 Q150,14 160,2 Q170,14 180,2 Q190,14 200,2 Q210,14 220,2 Q230,14 240,2 Q250,14 260,2 Q270,14 280,2 Q290,14 300,2 Q310,14 320,2 Q330,14 340,2 Q350,14 360,2 Q370,14 380,2 Q390,14 400,2 Q410,14 420,2 Q430,14 440,2"
          fill="none" stroke={color} strokeWidth="1.5" opacity="0.55" />
        {dots.map((_, i) => (
          <circle key={i} cx={10 + i * 20} cy={2} r="2.3" fill={color} opacity="0.85" />
        ))}
      </svg>
    </div>
  );
}

function fmt(n) {
  const v = Number(n) || 0;
  return "৳" + v.toLocaleString("en-IN");
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ---------------- shared UI bits ---------------- */

function Badge({ status }) {
  const map = {
    pending: { bg: "#FBEBD6", fg: C.pending, label: "Pending", Icon: Clock },
    approved: { bg: "#E1EFE6", fg: C.approved, label: "Approved", Icon: CheckCircle2 },
  };
  const s = map[status] || map.pending;
  const { Icon } = s;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600,
      padding: "3px 9px", borderRadius: 999, background: s.bg, color: s.fg, whiteSpace: "nowrap",
    }}>
      <Icon size={12} /> {s.label}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", marginBottom: 12 }}>
      <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.inkSoft, marginBottom: 5 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "9px 11px", borderRadius: 10,
  border: `1.5px solid ${C.line}`, fontFamily: "'Hind Siliguri', sans-serif",
  fontSize: 14.5, color: C.ink, background: "#fff", outline: "none",
};

function Btn({ children, onClick, variant = "primary", full, disabled, type = "button", small }) {
  const styles = {
    primary: { background: C.maroon, color: "#fff" },
    gold: { background: C.gold, color: C.maroonDark },
    ghost: { background: "transparent", color: C.maroon, border: `1.5px solid ${C.maroon}` },
    subtle: { background: C.cream, color: C.ink, border: `1.5px solid ${C.line}` },
    danger: { background: "#fff", color: "#B23A2E", border: "1.5px solid #E8C3BC" },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        fontFamily: "'Hind Siliguri', sans-serif",
        fontWeight: 600,
        fontSize: small ? 13 : 14.5,
        padding: small ? "6px 12px" : "10px 16px",
        borderRadius: 10,
        border: styles[variant].border || "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        width: full ? "100%" : "auto",
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        transition: "transform 0.08s ease",
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

function Card({ children, style }) {
  return (
    <div style={{
      background: C.card, borderRadius: 16, border: `1px solid ${C.line}`,
      boxShadow: "0 2px 10px rgba(74,13,24,0.06)", padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, tint }) {
  return (
    <div style={{
      flex: "1 1 150px", background: C.card, borderRadius: 14, border: `1px solid ${C.line}`,
      padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: tint }}>
        <Icon size={16} />
        <span style={{ fontSize: 12.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</span>
      </div>
      <span style={{ fontFamily: "'Baloo Da 2', sans-serif", fontSize: 24, fontWeight: 700, color: C.ink }}>{value}</span>
    </div>
  );
}

function Header({ title, subtitle, onBack, onLogout }) {
  return (
    <div style={{ textAlign: "center", padding: "26px 16px 4px" }}>
      {onBack && (
        <button onClick={onBack} style={{
          position: "absolute", left: 16, top: 16, background: "transparent", border: "none",
          color: C.gold, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600, fontSize: 13.5,
        }}>
          <ArrowLeft size={16} /> Home
        </button>
      )}
      {onLogout && (
        <button onClick={onLogout} style={{
          position: "absolute", right: 16, top: 16, background: "transparent", border: "none",
          color: C.gold, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontFamily: "'Hind Siliguri', sans-serif", fontWeight: 600, fontSize: 13.5,
        }}>
          <LogOut size={16} /> Logout
        </button>
      )}
      <h1 style={{
        fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 800, fontSize: 22, color: "#fff",
        margin: "0 0 2px", letterSpacing: 0.3,
      }}>
        {title}
      </h1>
      {subtitle && <p style={{ margin: 0, color: C.goldSoft, fontSize: 13, fontWeight: 500 }}>{subtitle}</p>}
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  useGoogleFonts();

  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("home"); // home, admin-login, admin, collector-login, collector, member
  const [collectors, setCollectors] = useState([]);
  const [entries, setEntries] = useState([]);
  const [adminPin, setAdminPin] = useState("1234");
  const [currentCollector, setCurrentCollector] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const c = await window.storage.get("collectors", true);
      setCollectors(c ? JSON.parse(c.value) : []);
    } catch { setCollectors([]); }
    try {
      const e = await window.storage.get("entries", true);
      setEntries(e ? JSON.parse(e.value) : []);
    } catch { setEntries([]); }
    try {
      const p = await window.storage.get("admin-pin", true);
      setAdminPin(p ? p.value : "1234");
    } catch {
      setAdminPin("1234");
      try { await window.storage.set("admin-pin", "1234", true); } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const persistCollectors = async (next) => {
    setCollectors(next);
    try { await window.storage.set("collectors", JSON.stringify(next), true); }
    catch { showToast("Could not save — try again"); }
  };
  const persistEntries = async (next) => {
    setEntries(next);
    try { await window.storage.set("entries", JSON.stringify(next), true); }
    catch { showToast("Could not save — try again"); }
  };
  const persistAdminPin = async (pin) => {
    setAdminPin(pin);
    try { await window.storage.set("admin-pin", pin, true); }
    catch { showToast("Could not save — try again"); }
  };

  const goHome = () => { setCurrentCollector(null); setView("home"); };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.cream, fontFamily: "'Hind Siliguri', sans-serif", color: C.maroon }}>
        Loading Horo Parboti Jubo Songho…
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.cream, fontFamily: "'Hind Siliguri', sans-serif" }}>
      <div style={{ position: "relative", background: `linear-gradient(160deg, ${C.maroon}, ${C.maroonDark})`, paddingBottom: 8 }}>
        <Header
          title="হর পার্বতী যুব সংঘ"
          subtitle={
            view === "home" ? "Pronami Register"
            : view === "admin-login" || view === "admin" ? "Admin"
            : view === "collector-login" ? "Collector Login"
            : view === "collector" ? currentCollector?.name
            : "Member Lookup"
          }
          onBack={view !== "home" ? goHome : null}
          onLogout={view === "collector" ? goHome : view === "admin" ? goHome : null}
        />
        <Garland inverted />
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 16px 60px" }}>
        {view === "home" && <Home setView={setView} />}
        {view === "admin-login" && (
          <AdminLogin adminPin={adminPin} onSuccess={() => setView("admin")} />
        )}
        {view === "admin" && (
          <AdminDashboard
            collectors={collectors} entries={entries} adminPin={adminPin}
            persistCollectors={persistCollectors} persistEntries={persistEntries}
            persistAdminPin={persistAdminPin} showToast={showToast}
          />
        )}
        {view === "collector-login" && (
          <CollectorLogin
            collectors={collectors}
            onSuccess={(c) => { setCurrentCollector(c); setView("collector"); }}
          />
        )}
        {view === "collector" && currentCollector && (
          <CollectorDashboard
            collector={currentCollector} entries={entries}
            persistEntries={persistEntries} showToast={showToast}
          />
        )}
        {view === "member" && <MemberLookup entries={entries} />}
      </div>

      {toast && (
        <div style={{
          position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
          background: C.ink, color: "#fff", padding: "10px 18px", borderRadius: 999,
          fontSize: 13.5, fontWeight: 600, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", zIndex: 50,
        }}>
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------------- Home ---------------- */

function Home({ setView }) {
  const options = [
    { key: "member", title: "I'm a Member", desc: "Look up your pronami history by phone number.", icon: Search, view: "member" },
    { key: "collector", title: "I'm a Collector", desc: "Log in to record and track your collections.", icon: Coins, view: "collector-login" },
    { key: "admin", title: "Admin", desc: "Manage collectors and approve collections.", icon: Shield, view: "admin-login" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
      {options.map((o) => (
        <Card key={o.key} style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer" }}>
          <div onClick={() => setView(o.view)} style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, background: C.cream, color: C.maroon,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <o.icon size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 16.5, color: C.ink }}>{o.title}</div>
              <div style={{ fontSize: 13, color: C.inkSoft, marginTop: 2 }}>{o.desc}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ---------------- Admin Login ---------------- */

function AdminLogin({ adminPin, onSuccess }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (pin === adminPin) onSuccess();
    else setErr("Incorrect PIN. Try again.");
  };
  return (
    <Card style={{ maxWidth: 340, margin: "24px auto" }}>
      <form onSubmit={submit}>
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <Lock size={26} color={C.maroon} />
          <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 17, marginTop: 6 }}>Admin Access</div>
        </div>
        <Field label="Admin PIN">
          <input type="password" inputMode="numeric" style={inputStyle} value={pin}
            onChange={(e) => { setPin(e.target.value); setErr(""); }} autoFocus />
        </Field>
        {err && <p style={{ color: "#B23A2E", fontSize: 13, margin: "0 0 10px" }}>{err}</p>}
        <Btn type="submit" full>Enter</Btn>
      </form>
    </Card>
  );
}

/* ---------------- Collector Login ---------------- */

function CollectorLogin({ collectors, onSuccess }) {
  const active = collectors.filter((c) => c.active);
  const [id, setId] = useState(active[0]?.id || "");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const c = collectors.find((x) => x.id === id);
    if (!c || !c.active) { setErr("Collector not found or inactive."); return; }
    if (c.pin !== pin) { setErr("Incorrect PIN."); return; }
    onSuccess(c);
  };

  if (active.length === 0) {
    return <Card><p style={{ margin: 0, color: C.inkSoft, fontSize: 14 }}>No active collectors yet. Ask the admin to add your account.</p></Card>;
  }

  return (
    <Card style={{ maxWidth: 360, margin: "24px auto" }}>
      <form onSubmit={submit}>
        <Field label="Your name">
          <select style={inputStyle} value={id} onChange={(e) => { setId(e.target.value); setErr(""); }}>
            {active.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="PIN">
          <input type="password" inputMode="numeric" style={inputStyle} value={pin}
            onChange={(e) => { setPin(e.target.value); setErr(""); }} />
        </Field>
        {err && <p style={{ color: "#B23A2E", fontSize: 13, margin: "0 0 10px" }}>{err}</p>}
        <Btn type="submit" full>Log in</Btn>
      </form>
    </Card>
  );
}

/* ---------------- Collector Dashboard ---------------- */

function CollectorDashboard({ collector, entries, persistEntries, showToast }) {
  const mine = entries.filter((e) => e.collectorId === collector.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const approvedTotal = mine.filter((e) => e.status === "approved").reduce((s, e) => s + Number(e.amount), 0);
  const pendingTotal = mine.filter((e) => e.status === "pending").reduce((s, e) => s + Number(e.amount), 0);

  const [form, setForm] = useState({ memberName: "", memberPhone: "", amount: "", date: todayISO(), note: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const addEntry = async (e) => {
    e.preventDefault();
    if (!form.memberName.trim() || !form.amount) { showToast("Name and amount are required"); return; }
    const entry = {
      id: uid(), collectorId: collector.id, collectorName: collector.name,
      memberName: form.memberName.trim(), memberPhone: form.memberPhone.trim(),
      amount: Number(form.amount), date: form.date, note: form.note.trim(),
      status: "pending", createdAt: Date.now(),
    };
    await persistEntries([entry, ...entries]);
    setForm({ memberName: "", memberPhone: "", amount: "", date: todayISO(), note: "" });
    showToast("Entry added — awaiting admin approval");
  };

  const startEdit = (e) => { setEditingId(e.id); setEditForm({ memberName: e.memberName, memberPhone: e.memberPhone, amount: e.amount, date: e.date, note: e.note || "" }); };
  const saveEdit = async (id) => {
    const next = entries.map((e) => e.id === id ? { ...e, ...editForm, amount: Number(editForm.amount) } : e);
    await persistEntries(next);
    setEditingId(null);
    showToast("Entry updated");
  };
  const removeEntry = async (id) => {
    await persistEntries(entries.filter((e) => e.id !== id));
    showToast("Entry deleted");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard label="Approved total" value={fmt(approvedTotal)} icon={CheckCircle2} tint={C.approved} />
        <StatCard label="Pending total" value={fmt(pendingTotal)} icon={Clock} tint={C.pending} />
        <StatCard label="Entries" value={mine.length} icon={ClipboardList} tint={C.maroon} />
      </div>

      <Card>
        <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 15.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Plus size={16} /> Record a new pronami
        </div>
        <form onSubmit={addEntry}>
          <Field label="Member name"><input style={inputStyle} value={form.memberName} onChange={(e) => setForm({ ...form, memberName: e.target.value })} /></Field>
          <Field label="Member phone (for their lookup)"><input style={inputStyle} value={form.memberPhone} onChange={(e) => setForm({ ...form, memberPhone: e.target.value })} placeholder="01XXXXXXXXX" /></Field>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Field label="Amount (৳)"><input type="number" min="0" style={inputStyle} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></Field>
            </div>
            <div style={{ flex: 1 }}>
              <Field label="Date"><input type="date" style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            </div>
          </div>
          <Field label="Note (optional)"><input style={inputStyle} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
          <Btn type="submit" full>Add entry</Btn>
        </form>
      </Card>

      <div>
        <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 15.5, margin: "4px 0 10px" }}>Your entries</div>
        {mine.length === 0 && <p style={{ color: C.inkSoft, fontSize: 14 }}>No entries yet — add your first collection above.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {mine.map((e) => (
            <Card key={e.id} style={{ padding: 14 }}>
              {editingId === e.id ? (
                <div>
                  <Field label="Member name"><input style={inputStyle} value={editForm.memberName} onChange={(v) => setEditForm({ ...editForm, memberName: v.target.value })} /></Field>
                  <Field label="Phone"><input style={inputStyle} value={editForm.memberPhone} onChange={(v) => setEditForm({ ...editForm, memberPhone: v.target.value })} /></Field>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}><Field label="Amount"><input type="number" style={inputStyle} value={editForm.amount} onChange={(v) => setEditForm({ ...editForm, amount: v.target.value })} /></Field></div>
                    <div style={{ flex: 1 }}><Field label="Date"><input type="date" style={inputStyle} value={editForm.date} onChange={(v) => setEditForm({ ...editForm, date: v.target.value })} /></Field></div>
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <Btn small onClick={() => saveEdit(e.id)}><Check size={14} /> Save</Btn>
                    <Btn small variant="subtle" onClick={() => setEditingId(null)}><X size={14} /> Cancel</Btn>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{e.memberName}</div>
                    <div style={{ fontSize: 12.5, color: C.inkSoft }}>{e.memberPhone || "no phone"} · {e.date}</div>
                    {e.note && <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 2 }}>{e.note}</div>}
                    <div style={{ marginTop: 6 }}><Badge status={e.status} /></div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 17, color: C.maroon }}>{fmt(e.amount)}</div>
                    {e.status === "pending" && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
                        <button onClick={() => startEdit(e)} style={{ background: "none", border: "none", color: C.teal, cursor: "pointer" }}><Pencil size={16} /></button>
                        <button onClick={() => removeEntry(e.id)} style={{ background: "none", border: "none", color: "#B23A2E", cursor: "pointer" }}><Trash2 size={16} /></button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Member Lookup ---------------- */

function MemberLookup({ entries }) {
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);

  const results = entries
    .filter((e) => phone && e.memberPhone && e.memberPhone.replace(/\s/g, "") === phone.replace(/\s/g, ""))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const approvedTotal = results.filter((e) => e.status === "approved").reduce((s, e) => s + Number(e.amount), 0);
  const pendingTotal = results.filter((e) => e.status === "pending").reduce((s, e) => s + Number(e.amount), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <Field label="Your phone number">
          <div style={{ display: "flex", gap: 8 }}>
            <input style={inputStyle} value={phone} placeholder="01XXXXXXXXX"
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearched(true)} />
            <Btn onClick={() => setSearched(true)}><Search size={15} /></Btn>
          </div>
        </Field>
      </Card>

      {searched && phone && (
        results.length === 0 ? (
          <Card><p style={{ margin: 0, color: C.inkSoft, fontSize: 14 }}>No pronami found for this phone number yet.</p></Card>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <StatCard label="Approved total" value={fmt(approvedTotal)} icon={CheckCircle2} tint={C.approved} />
              {pendingTotal > 0 && <StatCard label="Pending total" value={fmt(pendingTotal)} icon={Clock} tint={C.pending} />}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {results.map((e) => (
                <Card key={e.id} style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink }}>Collected by {e.collectorName}</div>
                    <div style={{ fontSize: 12.5, color: C.inkSoft }}>{e.date}</div>
                    <div style={{ marginTop: 6 }}><Badge status={e.status} /></div>
                  </div>
                  <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 17, color: C.maroon }}>{fmt(e.amount)}</div>
                </Card>
              ))}
            </div>
          </>
        )
      )}
    </div>
  );
}

/* ---------------- Admin Dashboard ---------------- */

function AdminDashboard({ collectors, entries, adminPin, persistCollectors, persistEntries, persistAdminPin, showToast }) {
  const [tab, setTab] = useState("collectors");
  const tabs = [
    { key: "collectors", label: "Collectors", icon: Users },
    { key: "entries", label: "Entries", icon: ClipboardList },
    { key: "overview", label: "Overview", icon: TrendingUp },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 6, background: C.card, padding: 5, borderRadius: 12, border: `1px solid ${C.line}` }}>
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 6px", borderRadius: 9, border: "none", cursor: "pointer",
            background: tab === t.key ? C.maroon : "transparent",
            color: tab === t.key ? "#fff" : C.inkSoft, fontWeight: 700, fontSize: 13,
            fontFamily: "'Hind Siliguri', sans-serif",
          }}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "collectors" && (
        <CollectorsTab collectors={collectors} persistCollectors={persistCollectors} showToast={showToast} />
      )}
      {tab === "entries" && (
        <EntriesTab entries={entries} persistEntries={persistEntries} showToast={showToast} />
      )}
      {tab === "overview" && (
        <OverviewTab collectors={collectors} entries={entries} adminPin={adminPin} persistAdminPin={persistAdminPin} showToast={showToast} />
      )}
    </div>
  );
}

function CollectorsTab({ collectors, persistCollectors, showToast }) {
  const [form, setForm] = useState({ name: "", pin: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const addCollector = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.pin.trim()) { showToast("Name and PIN are required"); return; }
    const c = { id: uid(), name: form.name.trim(), pin: form.pin.trim(), active: true, createdAt: Date.now() };
    await persistCollectors([c, ...collectors]);
    setForm({ name: "", pin: "" });
    showToast("Collector added");
  };

  const startEdit = (c) => { setEditingId(c.id); setEditForm({ name: c.name, pin: c.pin }); };
  const saveEdit = async (id) => {
    await persistCollectors(collectors.map((c) => c.id === id ? { ...c, ...editForm } : c));
    setEditingId(null);
    showToast("Collector updated");
  };
  const toggleActive = async (id) => {
    await persistCollectors(collectors.map((c) => c.id === id ? { ...c, active: !c.active } : c));
  };
  const removeCollector = async (id) => {
    await persistCollectors(collectors.filter((c) => c.id !== id));
    showToast("Collector removed");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 15.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <UserPlus size={16} /> Add a collector
        </div>
        <form onSubmit={addCollector}>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 2 }}><Field label="Name"><input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field></div>
            <div style={{ flex: 1 }}><Field label="PIN"><input style={inputStyle} value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} /></Field></div>
          </div>
          <Btn type="submit" full>Add collector</Btn>
        </form>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {collectors.length === 0 && <p style={{ color: C.inkSoft, fontSize: 14 }}>No collectors yet.</p>}
        {collectors.map((c) => (
          <Card key={c.id} style={{ padding: 14 }}>
            {editingId === c.id ? (
              <div>
                <Field label="Name"><input style={inputStyle} value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></Field>
                <Field label="PIN"><input style={inputStyle} value={editForm.pin} onChange={(e) => setEditForm({ ...editForm, pin: e.target.value })} /></Field>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn small onClick={() => saveEdit(c.id)}><Check size={14} /> Save</Btn>
                  <Btn small variant="subtle" onClick={() => setEditingId(null)}><X size={14} /> Cancel</Btn>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: C.inkSoft, display: "flex", alignItems: "center", gap: 4 }}>
                    <KeyRound size={12} /> PIN: {c.pin} · {c.active ? <span style={{ color: C.approved }}>active</span> : <span style={{ color: "#B23A2E" }}>inactive</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn small variant="subtle" onClick={() => toggleActive(c.id)}>{c.active ? "Deactivate" : "Activate"}</Btn>
                  <button onClick={() => startEdit(c)} style={{ background: "none", border: "none", color: C.teal, cursor: "pointer" }}><Pencil size={16} /></button>
                  <button onClick={() => removeCollector(c.id)} style={{ background: "none", border: "none", color: "#B23A2E", cursor: "pointer" }}><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

function EntriesTab({ entries, persistEntries, showToast }) {
  const [filter, setFilter] = useState("pending");
  const filtered = entries.filter((e) => filter === "all" ? true : e.status === filter)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const approve = async (id) => {
    await persistEntries(entries.map((e) => e.id === id ? { ...e, status: "approved", approvedAt: Date.now() } : e));
    showToast("Entry approved");
  };
  const unapprove = async (id) => {
    await persistEntries(entries.map((e) => e.id === id ? { ...e, status: "pending" } : e));
  };
  const remove = async (id) => {
    await persistEntries(entries.filter((e) => e.id !== id));
    showToast("Entry deleted");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 6 }}>
        {["pending", "approved", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${filter === f ? C.maroon : C.line}`,
            background: filter === f ? C.maroon : "#fff", color: filter === f ? "#fff" : C.inkSoft,
            fontWeight: 600, fontSize: 12.5, cursor: "pointer", textTransform: "capitalize",
            fontFamily: "'Hind Siliguri', sans-serif",
          }}>{f}</button>
        ))}
      </div>

      {filtered.length === 0 && <p style={{ color: C.inkSoft, fontSize: 14 }}>No entries here.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((e) => (
          <Card key={e.id} style={{ padding: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{e.memberName}</div>
              <div style={{ fontSize: 12.5, color: C.inkSoft }}>{e.memberPhone || "no phone"} · {e.date}</div>
              <div style={{ fontSize: 12.5, color: C.inkSoft, marginTop: 1 }}>Collector: {e.collectorName}</div>
              <div style={{ marginTop: 6 }}><Badge status={e.status} /></div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 17, color: C.maroon }}>{fmt(e.amount)}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
                {e.status === "pending" ? (
                  <Btn small onClick={() => approve(e.id)}><Check size={13} /> Approve</Btn>
                ) : (
                  <Btn small variant="subtle" onClick={() => unapprove(e.id)}>Unapprove</Btn>
                )}
                <button onClick={() => remove(e.id)} style={{ background: "none", border: "none", color: "#B23A2E", cursor: "pointer" }}><Trash2 size={16} /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function OverviewTab({ collectors, entries, adminPin, persistAdminPin, showToast }) {
  const approved = entries.filter((e) => e.status === "approved");
  const pending = entries.filter((e) => e.status === "pending");
  const approvedTotal = approved.reduce((s, e) => s + Number(e.amount), 0);
  const pendingTotal = pending.reduce((s, e) => s + Number(e.amount), 0);

  const perCollector = collectors.map((c) => ({
    ...c,
    approved: entries.filter((e) => e.collectorId === c.id && e.status === "approved").reduce((s, e) => s + Number(e.amount), 0),
    pending: entries.filter((e) => e.collectorId === c.id && e.status === "pending").reduce((s, e) => s + Number(e.amount), 0),
  }));

  const [pinForm, setPinForm] = useState({ current: "", next: "" });
  const [pinMsg, setPinMsg] = useState("");
  const changePin = async (e) => {
    e.preventDefault();
    if (pinForm.current !== adminPin) { setPinMsg("Current PIN is incorrect."); return; }
    if (!pinForm.next.trim()) { setPinMsg("Enter a new PIN."); return; }
    await persistAdminPin(pinForm.next.trim());
    setPinForm({ current: "", next: "" });
    setPinMsg("");
    showToast("Admin PIN updated");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatCard label="Approved total" value={fmt(approvedTotal)} icon={CheckCircle2} tint={C.approved} />
        <StatCard label="Pending total" value={fmt(pendingTotal)} icon={Clock} tint={C.pending} />
        <StatCard label="Collectors" value={collectors.length} icon={Users} tint={C.maroon} />
      </div>

      <Card>
        <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 15.5, marginBottom: 10 }}>Per collector</div>
        {perCollector.length === 0 && <p style={{ color: C.inkSoft, fontSize: 14, margin: 0 }}>No collectors yet.</p>}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {perCollector.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: C.ink }}>{c.name}</span>
              <span style={{ fontSize: 13.5 }}>
                <span style={{ color: C.approved, fontWeight: 700 }}>{fmt(c.approved)}</span>
                {c.pending > 0 && <span style={{ color: C.pending, marginLeft: 8 }}>+{fmt(c.pending)} pending</span>}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ fontFamily: "'Baloo Da 2', sans-serif", fontWeight: 700, fontSize: 15.5, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <KeyRound size={16} /> Change admin PIN
        </div>
        <form onSubmit={changePin}>
          <Field label="Current PIN"><input type="password" style={inputStyle} value={pinForm.current} onChange={(e) => setPinForm({ ...pinForm, current: e.target.value })} /></Field>
          <Field label="New PIN"><input type="password" style={inputStyle} value={pinForm.next} onChange={(e) => setPinForm({ ...pinForm, next: e.target.value })} /></Field>
          {pinMsg && <p style={{ color: "#B23A2E", fontSize: 13, margin: "0 0 10px" }}>{pinMsg}</p>}
          <Btn type="submit" variant="subtle">Update PIN</Btn>
        </form>
      </Card>
    </div>
  );
}
