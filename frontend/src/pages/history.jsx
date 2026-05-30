import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Clock, Calendar, Search, RefreshCw,
  ChevronRight, Trash2, Download, Filter,
  ArrowLeft, History, Hash, LogOut, Settings
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export default function HistoryPage() {
  const navigate = useNavigate();
  const { getHistoryOfUser, currentUser } = useContext(AuthContext);

  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | today | week | month
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchHistory(); }, []);

  useEffect(() => {
    applyFilter();
  }, [search, filter, history]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistoryOfUser();
      const sorted = (Array.isArray(data) ? data : []).sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setHistory(sorted);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let result = [...history];
    const now = new Date();

    if (filter === "today") {
      result = result.filter(h => {
        const d = new Date(h.date);
        return d.toDateString() === now.toDateString();
      });
    } else if (filter === "week") {
      const weekAgo = new Date(now - 7 * 86400000);
      result = result.filter(h => new Date(h.date) >= weekAgo);
    } else if (filter === "month") {
      const monthAgo = new Date(now - 30 * 86400000);
      result = result.filter(h => new Date(h.date) >= monthAgo);
    }

    if (search.trim()) {
      result = result.filter(h =>
        h.meetingCode.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRejoin = (code) => navigate(`/${code}`);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today - 86400000);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  const groupByDate = (items) => {
    return items.reduce((groups, item) => {
      const key = formatDate(item.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
      return groups;
    }, {});
  };

  const grouped = groupByDate(filtered);

  const filterTabs = [
    { id: "all", label: "All Time" },
    { id: "today", label: "Today" },
    { id: "week", label: "This Week" },
    { id: "month", label: "This Month" },
  ];

  const stats = [
    {
      icon: <History size={20} color="#818cf8" />,
      label: "Total Meetings",
      value: history.length,
      bg: "rgba(99,102,241,0.1)",
      border: "rgba(99,102,241,0.2)"
    },
    {
      icon: <Calendar size={20} color="#34d399" />,
      label: "This Week",
      value: history.filter(h => new Date(h.date) >= new Date(Date.now() - 7 * 86400000)).length,
      bg: "rgba(52,211,153,0.1)",
      border: "rgba(52,211,153,0.2)"
    },
    {
      icon: <Clock size={20} color="#f59e0b" />,
      label: "Today",
      value: history.filter(h => new Date(h.date).toDateString() === new Date().toDateString()).length,
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.2)"
    },
  ];

  return (
    <div style={styles.root}>
      {/* Ambient */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo} onClick={() => navigate("/")}>
          <div style={styles.logoIcon}><Video size={16} color="#fff" /></div>
          <span style={styles.logoText}>MeetX</span>
        </div>

        <nav style={styles.nav}>
          {[
            { label: "Home", icon: <Video size={17} />, path: "/home" },
            { label: "History", icon: <History size={17} />, path: "/history", active: true },
            { label: "Settings", icon: <Settings size={17} />, path: "/settings" },
          ].map(item => (
            <motion.button
              key={item.label}
              style={{ ...styles.navItem, ...(item.active ? styles.navItemActive : {}) }}
              whileHover={{ x: 4 }}
              onClick={() => {
                if (item.label === "Settings") {
                  showToast("Settings coming soon!");
                } else {
                  navigate(item.path);
                }
              }}
            >
              <span style={{ color: item.active ? "#818cf8" : "#475569" }}>{item.icon}</span>
              <span>{item.label}</span>
              {item.active && <motion.div style={styles.navBar} layoutId="navBar" />}
            </motion.button>
          ))}
        </nav>

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
      </aside>

      {/* Main */}
      <main style={styles.main}>

        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={styles.topbarLeft}>
            <motion.button
              style={styles.backBtn}
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
            >
              <ArrowLeft size={16} /> Back to Home
            </motion.button>
          </div>
          <div style={styles.topbarTitle}>Meeting History</div>
          <motion.button
            style={styles.refreshBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            onClick={fetchHistory}
          >
            <RefreshCw size={15} /> Refresh
          </motion.button>
        </div>

        <div style={styles.content}>

          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={styles.pageHeading}
          >
            <div style={styles.headingIcon}>
              <History size={22} color="#818cf8" />
            </div>
            <div>
              <h1 style={styles.pageTitle}>Meeting History</h1>
              <p style={styles.pageSub}>All your past meetings in one place</p>
            </div>
          </motion.div>

          {/* Stats */}
          <div style={styles.statsRow}>
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                style={{ ...styles.statCard, background: s.bg, border: `1px solid ${s.border}` }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div style={styles.statIconWrap}>{s.icon}</div>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Search + Filter */}
          <motion.div
            style={styles.toolbar}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Search */}
            <div style={styles.searchBar}>
              <Search size={15} color="#475569" />
              <input
                style={styles.searchInput}
                placeholder="Search by meeting code..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <motion.button
                  style={styles.clearBtn}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearch("")}
                >
                  ✕
                </motion.button>
              )}
            </div>

            {/* Filter tabs */}
            <div style={styles.filterTabs}>
              <Filter size={14} color="#475569" />
              {filterTabs.map(tab => (
                <motion.button
                  key={tab.id}
                  style={{ ...styles.filterTab, ...(filter === tab.id ? styles.filterTabActive : {}) }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setFilter(tab.id)}
                >
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Results count */}
          {!loading && (
            <div style={styles.resultsCount}>
              Showing <strong style={{ color: "#818cf8" }}>{filtered.length}</strong> meeting{filtered.length !== 1 ? "s" : ""}
              {search && <span> matching "<em>{search}</em>"</span>}
            </div>
          )}

          {/* History list */}
          {loading ? (
            <div style={styles.skeletonList}>
              {[1, 2, 3, 4, 5].map(i => (
                <motion.div
                  key={i}
                  style={styles.skeleton}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              style={styles.emptyState}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div style={styles.emptyIcon}>
                <History size={36} color="#1e293b" />
              </div>
              <div style={styles.emptyTitle}>
                {search ? "No meetings found" : "No meetings yet"}
              </div>
              <div style={styles.emptySub}>
                {search
                  ? `No results for "${search}". Try a different code.`
                  : "Start or join a meeting to see your history here."}
              </div>
              <motion.button
                style={styles.emptyBtn}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/home")}
              >
                <Video size={15} /> Start a Meeting
              </motion.button>
            </motion.div>
          ) : (
            <div style={styles.groupedList}>
              {Object.entries(grouped).map(([dateLabel, items], gi) => (
                <motion.div
                  key={dateLabel}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.08 }}
                >
                  {/* Date group header */}
                  <div style={styles.groupHeader}>
                    <div style={styles.groupLine} />
                    <div style={styles.groupLabel}>
                      <Calendar size={12} color="#475569" />
                      {dateLabel}
                    </div>
                    <div style={styles.groupLine} />
                  </div>

                  {/* Meeting items */}
                  <div style={styles.itemList}>
                    {items.map((item, i) => (
                      <motion.div
                        key={item._id || i}
                        style={styles.historyItem}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ backgroundColor: "rgba(99,102,241,0.05)", x: 3 }}
                      >
                        {/* Left icon */}
                        <div style={styles.itemIcon}>
                          <Video size={16} color="#818cf8" />
                        </div>

                        {/* Info */}
                        <div style={styles.itemInfo}>
                          <div style={styles.itemCode}>
                            <Hash size={12} color="#475569" />
                            {item.meetingCode}
                          </div>
                          <div style={styles.itemMeta}>
                            <Clock size={11} color="#334155" />
                            <span>{formatTime(item.date)}</span>
                            <span style={styles.metaDot}>·</span>
                            <span>{new Date(item.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={styles.itemActions}>
                          <motion.button
                            style={styles.rejoinBtn}
                            whileHover={{ scale: 1.05, borderColor: "#6366f1", color: "#818cf8" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleRejoin(item.meetingCode)}
                          >
                            Rejoin <ChevronRight size={13} />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={styles.toast}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
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
    filter: "blur(100px)", opacity: 0.08, top: -200, left: -100,
    pointerEvents: "none", zIndex: 0,
  },
  orb2: {
    position: "fixed", width: 400, height: 400, borderRadius: "50%",
    background: "radial-gradient(circle, #8b5cf6, transparent)",
    filter: "blur(100px)", opacity: 0.08, bottom: -100, right: -100,
    pointerEvents: "none", zIndex: 0,
  },

  // Sidebar
  sidebar: {
    position: "fixed", top: 0, left: 0, bottom: 0, width: 240,
    background: "rgba(10,13,28,0.95)", backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(99,102,241,0.1)",
    display: "flex", flexDirection: "column", padding: "24px 14px",
    zIndex: 50,
  },
  sidebarLogo: {
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 36, paddingLeft: 8, cursor: "pointer",
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
  navBar: {
    position: "absolute", left: 0, top: "20%", bottom: "20%",
    width: 3, borderRadius: 4,
    background: "linear-gradient(#6366f1, #8b5cf6)",
  },
  sidebarBottom: {
    borderTop: "1px solid rgba(99,102,241,0.1)",
    paddingTop: 16, display: "flex", alignItems: "center", gap: 10,
  },
  userRow: { display: "flex", alignItems: "center", gap: 10, flex: 1 },
  avatar: {
    width: 34, height: 34, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff",
  },
  userName: { fontSize: 13, fontWeight: 600, color: "#94a3b8" },
  userStatus: { fontSize: 11, color: "#22c55e", marginTop: 2 },
  logoutBtn: {
    background: "none", border: "none", cursor: "pointer",
    color: "#475569", padding: 6, display: "flex", transition: "color 0.2s",
  },

  // Main
  main: {
    flex: 1, marginLeft: 240, display: "flex",
    flexDirection: "column", minHeight: "100vh", position: "relative", zIndex: 1,
  },

  // Topbar
  topbar: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 28px",
    borderBottom: "1px solid rgba(99,102,241,0.08)",
    background: "rgba(8,11,20,0.6)", backdropFilter: "blur(12px)",
    position: "sticky", top: 0, zIndex: 40,
  },
  topbarLeft: {},
  topbarTitle: { fontSize: 15, fontWeight: 700, color: "#64748b" },
  backBtn: {
    display: "flex", alignItems: "center", gap: 7,
    background: "none", border: "none", color: "#64748b",
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    padding: "6px 10px", borderRadius: 8,
    transition: "color 0.2s",
  },
  refreshBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
    color: "#818cf8", fontSize: 12, fontWeight: 600,
    padding: "7px 14px", borderRadius: 9, cursor: "pointer",
  },

  // Content
  content: {
    padding: "32px 28px",
    display: "flex", flexDirection: "column", gap: 24,
    maxWidth: 900,
  },

  pageHeading: {
    display: "flex", alignItems: "center", gap: 16,
  },
  headingIcon: {
    width: 52, height: 52, borderRadius: 14,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  pageTitle: {
    fontSize: 26, fontWeight: 800, color: "#f8fafc",
    margin: 0, letterSpacing: "-0.5px",
  },
  pageSub: { fontSize: 13, color: "#475569", margin: "4px 0 0" },

  // Stats
  statsRow: {
    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14,
  },
  statCard: {
    borderRadius: 14, padding: "18px 20px",
    display: "flex", flexDirection: "column", gap: 8,
  },
  statIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  statValue: {
    fontSize: 30, fontWeight: 800, color: "#f8fafc", letterSpacing: "-1px",
  },
  statLabel: { fontSize: 12, color: "#475569", fontWeight: 500 },

  // Toolbar
  toolbar: {
    display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
  },
  searchBar: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "10px 14px", flex: 1, minWidth: 200,
  },
  searchInput: {
    flex: 1, background: "none", border: "none", outline: "none",
    color: "#94a3b8", fontSize: 14,
  },
  clearBtn: {
    background: "none", border: "none", color: "#475569",
    cursor: "pointer", fontSize: 13, padding: "0 2px",
  },
  filterTabs: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 12, padding: "6px 10px",
  },
  filterTab: {
    padding: "6px 12px", borderRadius: 8,
    background: "transparent", border: "none",
    color: "#475569", fontSize: 12, fontWeight: 500, cursor: "pointer",
    transition: "all 0.2s",
  },
  filterTabActive: {
    background: "rgba(99,102,241,0.18)",
    border: "1px solid rgba(99,102,241,0.3)",
    color: "#818cf8",
  },

  resultsCount: {
    fontSize: 13, color: "#334155",
  },

  // Skeleton
  skeletonList: { display: "flex", flexDirection: "column", gap: 10 },
  skeleton: {
    height: 68, borderRadius: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.05)",
  },

  // Empty
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 14, padding: "80px 0", textAlign: "center",
  },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 20,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  emptyTitle: { fontSize: 17, fontWeight: 700, color: "#334155" },
  emptySub: { fontSize: 13, color: "#1e293b", maxWidth: 320 },
  emptyBtn: {
    display: "flex", alignItems: "center", gap: 7, marginTop: 8,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 12, color: "#fff",
    fontSize: 14, fontWeight: 600, padding: "11px 22px", cursor: "pointer",
  },

  // Grouped list
  groupedList: { display: "flex", flexDirection: "column", gap: 24 },
  groupHeader: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
  },
  groupLine: { flex: 1, height: 1, background: "rgba(99,102,241,0.08)" },
  groupLabel: {
    display: "flex", alignItems: "center", gap: 6,
    fontSize: 12, fontWeight: 600, color: "#475569",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 100, padding: "4px 12px", whiteSpace: "nowrap",
  },
  itemList: { display: "flex", flexDirection: "column", gap: 8 },
  historyItem: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "16px 18px", borderRadius: 14,
    background: "rgba(13,17,35,0.8)",
    border: "1px solid rgba(99,102,241,0.08)",
    backdropFilter: "blur(10px)",
    transition: "all 0.2s", cursor: "default",
  },
  itemIcon: {
    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  itemInfo: { flex: 1 },
  itemCode: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 14, fontWeight: 600, color: "#94a3b8", letterSpacing: 0.5,
  },
  itemMeta: {
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 11, color: "#334155", marginTop: 4,
  },
  metaDot: { color: "#1e293b" },
  itemActions: { display: "flex", gap: 8 },
  rejoinBtn: {
    display: "flex", alignItems: "center", gap: 4,
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.2)",
    color: "#64748b", fontSize: 12, fontWeight: 600,
    padding: "7px 14px", borderRadius: 9, cursor: "pointer",
    transition: "all 0.2s",
  },

  // Toast
  toast: {
    position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
    background: "rgba(13,17,35,0.95)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.25)", borderRadius: 12,
    padding: "11px 20px", fontSize: 13, fontWeight: 500, color: "#94a3b8",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    zIndex: 100, whiteSpace: "nowrap",
  },
};