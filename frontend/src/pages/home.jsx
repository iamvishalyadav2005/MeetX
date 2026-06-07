import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Plus, LogOut, History, Home, Settings,
  Search, Bell, Copy, Check, Hash, Clock,
  ChevronRight, Users, Mic, Camera,
  LayoutGrid, Menu, X
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export default function HomeComponent() {
  const navigate = useNavigate();
  const { getHistoryOfUser, addToUserHistory, currentUser } = useContext(AuthContext);


  const [meetingCode, setMeetingCode] = useState("");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [activeNav] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [joinError, setJoinError] = useState("");
  const [newMeetingCode] = useState(() => generateCode());
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  function generateCode() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 9 }, (_, i) =>
      (i === 3 || i === 6 ? "-" : chars[Math.floor(Math.random() * chars.length)])
    ).join("");
  }

  useEffect(() => {
  fetchHistory();
}, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistoryOfUser();
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const startMeeting = async () => {
    try {
      await addToUserHistory(newMeetingCode);
      navigate(`/${newMeetingCode}`);
    } catch {
      navigate(`/${newMeetingCode}`);
    }
  };

  const joinMeeting = async () => {
    setJoinError("");
    if (!meetingCode.trim()) {
      setJoinError("Please enter a meeting code.");
      return;
    }
    try {
      await addToUserHistory(meetingCode.trim());
    } catch {}
    navigate(`/${meetingCode.trim()}`);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast("Meeting code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  };

  const navItems = [
    { id: "home", icon: <Home size={18} />, label: "Home", path: "/home" },
    { id: "history", icon: <History size={18} />, label: "History", path: "/history" },
    { id: "settings", icon: <Settings size={18} />, label: "Settings", path: "/settings" },
  ];

  const quickStats = [
    { icon: <Video size={20} color="#818cf8" />, label: "Total Meetings", value: history.length, bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.2)" },
    { icon: <Clock size={20} color="#34d399" />, label: "This Week", value: history.filter(h => new Date(h.date) > new Date(Date.now() - 7 * 86400000)).length, bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
    { icon: <Users size={20} color="#f59e0b" />, label: "Participants", value: "—", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
    { icon: <LayoutGrid size={20} color="#38bdf8" />, label: "Upcoming", value: "—", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.2)" },
  ];

  return (
    <div style={styles.root}>
      {/* Ambient */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            style={styles.sidebar}
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Logo */}
            <div style={styles.sidebarLogo}>
              <div style={styles.logoIcon}><Video size={16} color="#fff" /></div>
              <span style={styles.logoText}>MeetX</span>
            </div>

            {/* Nav */}
            <nav style={styles.nav}>
              {navItems.map(item => (
                <motion.button
                  key={item.id}
                  style={{
                    ...styles.navItem,
                    ...(activeNav === item.id ? styles.navItemActive : {})
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (item.id === "settings") {
                      showToast("Settings coming soon!");
                    } else {
                      navigate(item.path);
                    }
                  }}
                >
                  <span style={{ color: activeNav === item.id ? "#818cf8" : "#475569" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {activeNav === item.id && (
                    <motion.div style={styles.navActiveBar} layoutId="navBar" />
                  )}
                </motion.button>
              ))}
            </nav>

            {/* New meeting shortcut */}
            <motion.button
              style={styles.sidebarNewBtn}
              whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
              whileTap={{ scale: 0.97 }}
              onClick={startMeeting}
            >
              <Plus size={16} /> New Meeting
            </motion.button>

            {/* User + logout */}
            <div style={styles.sidebarBottom}>
              <div style={styles.userRow}>
                <div style={styles.avatar}>{currentUser?.username?.[0]?.toUpperCase() || "?"}</div>

                <div>
                  <div style={styles.userName}>{currentUser?.username || "User"}</div>
                  <div style={styles.userStatus}>● Online</div>
                </div>
              </div>
              <motion.button
                style={styles.logoutBtn}
                whileHover={{ color: "#f87171" }}
                onClick={handleLogout}
              >
                <LogOut size={16} />
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main style={{ ...styles.main, marginLeft: sidebarOpen ? 260 : 0 }}>

        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <motion.button
              style={styles.menuBtn}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} color="#94a3b8" /> : <Menu size={20} color="#94a3b8" />}
            </motion.button>
            <div style={styles.searchBar}>
              <Search size={15} color="#475569" />
              <input
                style={styles.searchInput}
                placeholder="Search meetings..."
              />
            </div>
          </div>
          <div style={styles.topbarRight}>
            <motion.button style={styles.iconBtn} whileHover={{ scale: 1.1 }}>
              <Bell size={18} color="#475569" />
              <span style={styles.notifDot} />
            </motion.button>
            <div style={styles.topAvatar}>{currentUser?.username?.[0]?.toUpperCase() || "?"}</div>
          </div>
        </div>

        {/* Page content */}
        <div style={styles.content}>

          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div style={styles.greeting}>Good day, {currentUser?.username || "there"} 👋</div>

            <div style={styles.greetingSub}>Here's what's happening with your meetings today.</div>
          </motion.div>

          {/* Stats row */}
          <div style={styles.statsRow}>
            {quickStats.map((s, i) => (
              <motion.div
                key={s.label}
                style={{ ...styles.statCard, background: s.bg, border: `1px solid ${s.border}` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div style={styles.statIcon}>{s.icon}</div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Two column grid */}
          <div style={styles.grid}>

            {/* Start meeting card */}
            <motion.div
              style={styles.card}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div style={styles.cardHeader}>
                <div style={styles.cardIconWrap}>
                  <Video size={20} color="#818cf8" />
                </div>
                <div>
                  <div style={styles.cardTitle}>Start a Meeting</div>
                  <div style={styles.cardSub}>Launch an instant meeting room</div>
                </div>
              </div>

              <div style={styles.codePreview}>
                <Hash size={13} color="#475569" />
                <span style={styles.codeText}>{newMeetingCode}</span>
                <motion.button
                  style={styles.copyBtn}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyCode(newMeetingCode)}
                >
                  {copied ? <Check size={13} color="#34d399" /> : <Copy size={13} color="#475569" />}
                </motion.button>
              </div>

              <motion.button
                style={styles.primaryBtn}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(99,102,241,0.45)" }}
                whileTap={{ scale: 0.97 }}
                onClick={startMeeting}
              >
                <Video size={16} /> Start Meeting
              </motion.button>

              <div style={styles.meetingFeatures}>
                {[
                  { icon: <Mic size={13} />, label: "Audio" },
                  { icon: <Camera size={13} />, label: "Video" },
                ].map(f => (
                  <div key={f.label} style={styles.meetingFeature}>
                    {f.icon} {f.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Join meeting card */}
            <motion.div
              style={styles.card}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <div style={styles.cardHeader}>
                <div style={{ ...styles.cardIconWrap, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}>
                  <ChevronRight size={20} color="#34d399" />
                </div>
                <div>
                  <div style={styles.cardTitle}>Join a Meeting</div>
                  <div style={styles.cardSub}>Enter a code to join instantly</div>
                </div>
              </div>

              <div style={styles.fieldGroup}>
                <div style={{
                  ...styles.inputWrapper,
                  ...(joinError ? styles.inputError : {})
                }}>
                  <Hash size={15} color="#475569" />
                  <input
                    style={styles.input}
                    placeholder="Enter meeting code (e.g. abc-123-xyz)"
                    value={meetingCode}
                    onChange={e => { setMeetingCode(e.target.value); setJoinError(""); }}
                    onKeyDown={e => e.key === "Enter" && joinMeeting()}
                  />
                </div>
                {joinError && (
                  <span style={styles.errorText}>{joinError}</span>
                )}
              </div>

              <motion.button
                style={styles.secondaryBtn}
                whileHover={{ scale: 1.02, borderColor: "#34d399", color: "#34d399" }}
                whileTap={{ scale: 0.97 }}
                onClick={joinMeeting}
              >
                <ChevronRight size={16} /> Join Meeting
              </motion.button>

              <div style={styles.tipBox}>
                💡 Ask the host to share their meeting code with you.
              </div>
            </motion.div>
          </div>

          {/* Meeting history */}
          <motion.div
            style={styles.historySection}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div style={styles.historyHeader}>
              <div>
                <div style={styles.sectionTitle}>Recent Meetings</div>
                <div style={styles.sectionSub}>Your past meeting history</div>
              </div>
              <motion.button
                style={styles.refreshBtn}
                whileHover={{ scale: 1.05 }}
                onClick={fetchHistory}
              >
                Refresh
              </motion.button>
            </div>

            {loading ? (
              <div style={styles.emptyState}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={styles.skeleton} />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}><History size={32} color="#334155" /></div>
                <div style={styles.emptyTitle}>No meetings yet</div>
                <div style={styles.emptySub}>Start or join a meeting to see your history here.</div>
              </div>
            ) : (
              <div style={styles.historyList}>
                {history.slice().reverse().map((item, i) => (
                  <motion.div
                    key={item._id || i}
                    style={styles.historyItem}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(99,102,241,0.06)", x: 4 }}
                  >
                    <div style={styles.historyIconWrap}>
                      <Video size={16} color="#818cf8" />
                    </div>
                    <div style={styles.historyInfo}>
                      <div style={styles.historyCode}>{item.meetingCode}</div>
                      <div style={styles.historyDate}>
                        <Clock size={11} color="#334155" />
                        {formatDate(item.date)} at {formatTime(item.date)}
                      </div>
                    </div>
                    <motion.button
                      style={styles.rejoinBtn}
                      whileHover={{ scale: 1.05, borderColor: "#818cf8", color: "#818cf8" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/${item.meetingCode}`)}
                    >
                      Rejoin <ChevronRight size={13} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={styles.toast}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <Check size={14} color="#34d399" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh", background: "#080b14",
    color: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: "flex", position: "relative", overflow: "hidden",
  },
  orb1: {
    position: "fixed", width: 500, height: 500, borderRadius: "50%",
    background: "radial-gradient(circle, #6366f1, transparent)",
    filter: "blur(100px)", opacity: 0.1, top: -200, left: -100, pointerEvents: "none",
  },
  orb2: {
    position: "fixed", width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, #8b5cf6, transparent)",
    filter: "blur(100px)", opacity: 0.1, bottom: -100, right: -100, pointerEvents: "none",
  },

  // Sidebar
  sidebar: {
    position: "fixed", top: 0, left: 0, bottom: 0, width: 260,
    background: "rgba(10,13,28,0.95)", backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(99,102,241,0.1)",
    display: "flex", flexDirection: "column", padding: "24px 16px",
    zIndex: 50,
  },
  sidebarLogo: {
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 36, paddingLeft: 8,
  },
  logoIcon: {
    width: 32, height: 32, borderRadius: 9,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 16px rgba(99,102,241,0.4)",
  },
  logoText: { fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" },

  nav: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  navItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "11px 12px", borderRadius: 10,
    background: "transparent", border: "none", color: "#475569",
    fontSize: 14, fontWeight: 500, cursor: "pointer",
    position: "relative", textAlign: "left", width: "100%",
    transition: "color 0.2s",
  },
  navItemActive: { color: "#f1f5f9", background: "rgba(99,102,241,0.1)" },
  navActiveBar: {
    position: "absolute", left: 0, top: "20%", bottom: "20%",
    width: 3, borderRadius: 4,
    background: "linear-gradient(#6366f1, #8b5cf6)",
  },

  sidebarNewBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    margin: "16px 0", padding: "12px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 12, color: "#fff",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 0 20px rgba(99,102,241,0.3)",
  },

  sidebarBottom: {
    borderTop: "1px solid rgba(99,102,241,0.1)",
    paddingTop: 16, display: "flex", alignItems: "center", gap: 10,
  },
  userRow: { display: "flex", alignItems: "center", gap: 10, flex: 1 },
  avatar: {
    width: 36, height: 36, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  userName: { fontSize: 13, fontWeight: 600, color: "#94a3b8" },
  userStatus: { fontSize: 11, color: "#22c55e", marginTop: 2 },
  logoutBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#475569", padding: 6, borderRadius: 8,
    display: "flex", alignItems: "center", transition: "color 0.2s",
  },

  // Main
  main: {
    flex: 1, display: "flex", flexDirection: "column",
    transition: "margin-left 0.3s",
    minHeight: "100vh",
  },

  // Topbar
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 28px",
    borderBottom: "1px solid rgba(99,102,241,0.08)",
    background: "rgba(8,11,20,0.6)", backdropFilter: "blur(12px)",
    position: "sticky", top: 0, zIndex: 40,
  },
  topbarLeft: { display: "flex", alignItems: "center", gap: 16 },
  menuBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 6, borderRadius: 8,
    display: "flex", alignItems: "center",
  },
  searchBar: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10, padding: "8px 14px", width: 240,
  },
  searchInput: {
    background: "none", border: "none", outline: "none",
    color: "#94a3b8", fontSize: 13, width: "100%",
  },
  topbarRight: { display: "flex", alignItems: "center", gap: 12 },
  iconBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 8, borderRadius: 10, position: "relative",
    display: "flex", alignItems: "center",
  },
  notifDot: {
    position: "absolute", top: 6, right: 6,
    width: 7, height: 7, borderRadius: "50%",
    background: "#f87171", border: "1.5px solid #080b14",
  },
  topAvatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff", cursor: "pointer",
  },

  // Content
  content: {
    padding: "32px 28px",
    display: "flex", flexDirection: "column", gap: 28,
    maxWidth: 1100, width: "100%",
  },

  greeting: { fontSize: 26, fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.5px" },
  greetingSub: { fontSize: 14, color: "#475569", marginTop: 4 },

  // Stats
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
  },
  statCard: {
    borderRadius: 16, padding: "20px",
    display: "flex", flexDirection: "column", gap: 10,
    cursor: "default",
  },
  statIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  statValue: { fontSize: 28, fontWeight: 800, color: "#f8fafc", letterSpacing: "-1px" },
  statLabel: { fontSize: 12, color: "#475569", fontWeight: 500 },

  // Grid
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },

  // Cards
  card: {
    background: "rgba(13,17,35,0.8)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.12)", borderRadius: 20,
    padding: "28px", display: "flex", flexDirection: "column", gap: 20,
  },
  cardHeader: { display: "flex", alignItems: "center", gap: 14 },
  cardIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
  cardSub: { fontSize: 12, color: "#475569", marginTop: 2 },

  codePreview: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)",
    borderRadius: 10, padding: "10px 14px",
  },
  codeText: { flex: 1, fontSize: 14, fontWeight: 600, color: "#818cf8", letterSpacing: 1 },
  copyBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 4, display: "flex", alignItems: "center",
  },

  primaryBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 12, color: "#fff",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    boxShadow: "0 0 20px rgba(99,102,241,0.3)",
  },

  meetingFeatures: { display: "flex", gap: 12 },
  meetingFeature: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 12, color: "#475569",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "5px 10px", borderRadius: 8,
  },

  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  inputWrapper: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "12px 14px",
    transition: "border-color 0.2s",
  },
  inputError: { borderColor: "rgba(239,68,68,0.4)" },
  input: {
    flex: 1, background: "none", border: "none", outline: "none",
    color: "#f1f5f9", fontSize: 14,
  },
  errorText: { fontSize: 12, color: "#f87171" },

  secondaryBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px", background: "rgba(52,211,153,0.06)",
    border: "1px solid rgba(52,211,153,0.2)", borderRadius: 12, color: "#34d399",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    transition: "all 0.2s",
  },

  tipBox: {
    background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)",
    borderRadius: 10, padding: "10px 14px",
    fontSize: 12, color: "#475569", lineHeight: 1.5,
  },

  // History
  historySection: {
    background: "rgba(13,17,35,0.8)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.12)", borderRadius: 20,
    padding: "28px",
  },
  historyHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: "#f1f5f9" },
  sectionSub: { fontSize: 12, color: "#475569", marginTop: 2 },
  refreshBtn: {
    background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
    color: "#818cf8", fontSize: 12, fontWeight: 600,
    padding: "6px 14px", borderRadius: 8, cursor: "pointer",
  },

  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 12, padding: "48px 0",
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: 16,
    background: "rgba(255,255,255,0.03)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  emptyTitle: { fontSize: 15, fontWeight: 600, color: "#334155" },
  emptySub: { fontSize: 13, color: "#1e293b", textAlign: "center" },

  skeleton: {
    width: "100%", height: 60, borderRadius: 12,
    background: "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    marginBottom: 10,
  },

  historyList: { display: "flex", flexDirection: "column", gap: 8 },
  historyItem: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "14px 16px", borderRadius: 12,
    border: "1px solid rgba(99,102,241,0.08)",
    transition: "all 0.2s", cursor: "default",
  },
  historyIconWrap: {
    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  historyInfo: { flex: 1 },
  historyCode: { fontSize: 14, fontWeight: 600, color: "#94a3b8", letterSpacing: 0.5 },
  historyDate: {
    fontSize: 11, color: "#334155", marginTop: 3,
    display: "flex", alignItems: "center", gap: 4,
  },
  rejoinBtn: {
    display: "flex", alignItems: "center", gap: 4,
    background: "none", border: "1px solid rgba(99,102,241,0.2)",
    color: "#475569", fontSize: 12, fontWeight: 600,
    padding: "6px 12px", borderRadius: 8, cursor: "pointer",
    transition: "all 0.2s",
  },

  // Toast
  toast: {
    position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
    background: "rgba(13,17,35,0.95)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(52,211,153,0.3)", borderRadius: 12,
    padding: "12px 20px", fontSize: 13, fontWeight: 600, color: "#34d399",
    display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 100,
  },
};