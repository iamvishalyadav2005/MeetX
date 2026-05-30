import { useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import { motion } from "framer-motion";
import {
  Video, Shield, Zap, Globe, Users, MessageSquare,
  ArrowRight, Menu, X
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    {
      icon: <Video size={26} />,
      title: "Crystal Clear Video",
      desc: "High-definition video quality with adaptive streaming for smooth, uninterrupted calls."
    },
    {
      icon: <Shield size={26} />,
      title: "End-to-End Encrypted",
      desc: "Every meeting is protected with strong encryption to keep your conversations private."
    },
    {
      icon: <Zap size={26} />,
      title: "Ultra Low Latency",
      desc: "Real-time communication with minimal delay so conversations feel natural."
    },
    {
      icon: <Globe size={26} />,
      title: "Works Everywhere",
      desc: "Join from any device, any browser, anywhere in the world — no downloads needed."
    },
    {
      icon: <Users size={26} />,
      title: "Multi-Participant",
      desc: "Host meetings with multiple participants and manage them easily in one place."
    },
    {
      icon: <MessageSquare size={26} />,
      title: "Real-time Chat",
      desc: "Send messages during your meeting without interrupting the conversation flow."
    },
  ];

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div style={styles.root}>

      {/* ── Ambient background ────────────────────────────── */}
      <div style={styles.ambientWrapper}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />
        <div style={styles.grid} />
      </div>

      {/* ── Navbar ───────────────────────────────────────── */}
      <motion.nav
        style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div style={styles.navInner}>

          {/* Logo */}
          <div style={styles.logo} onClick={() => navigate("/")}>
            <div style={styles.logoIcon}><Video size={17} color="#fff" /></div>
            <span style={styles.logoText}>MeetX</span>
          </div>

          {/* Desktop nav links */}
          <div style={styles.navLinks}>
            {navLinks.map(link => (
              <a key={link.label} href={link.href} style={styles.navLink}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div style={styles.navActions}>
            <motion.button
              style={styles.loginBtn}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              Login
            </motion.button>
            <motion.button
              style={styles.signupBtn}
              whileHover={{ scale: 1.04, boxShadow: "0 0 28px rgba(99,102,241,0.5)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              Sign Up <ArrowRight size={14} />
            </motion.button>
          </div>

          {/* Hamburger */}
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen
              ? <X size={22} color="#f1f5f9" />
              : <Menu size={22} color="#f1f5f9" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div
            style={styles.mobileMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div style={styles.mobileDivider} />
            <button
              style={styles.mobileBtnOutline}
              onClick={() => navigate("/auth")}
            >
              Login
            </button>
            <button
              style={styles.mobileBtnFill}
              onClick={() => navigate("/auth")}
            >
              Sign Up
            </button>
          </motion.div>
        )}
      </motion.nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section id="home" style={styles.hero}>
        <motion.div
          style={styles.heroContent}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            style={styles.heroBadge}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            ✦ Video meetings, reimagined
          </motion.div>

          <motion.h1
            style={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Connect Beyond<br />
            <span style={styles.heroGradient}>Limits</span>
          </motion.h1>

          <motion.p
            style={styles.heroSub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            MeetX brings people together with seamless video calls, real-time chat,
            and screen sharing — right from your browser. No downloads, no friction.
          </motion.p>

          <motion.div
            style={styles.heroBtns}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              style={styles.primaryBtn}
              whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(99,102,241,0.55)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              <Video size={17} /> Start a Meeting
            </motion.button>
            <motion.button
              style={styles.outlineBtn}
              whileHover={{ scale: 1.05, borderColor: "#818cf8" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              Join a Meeting
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Hero mockup */}
        <motion.div
          style={styles.mockup}
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.75, duration: 0.8 }}
        >
          <div style={styles.mockupBar}>
            <div style={styles.mockupDots}>
              <span style={{ ...styles.dot, background: "#f87171" }} />
              <span style={{ ...styles.dot, background: "#fbbf24" }} />
              <span style={{ ...styles.dot, background: "#34d399" }} />
            </div>
            <span style={styles.mockupBarTitle}>MeetX — Team Meeting · 00:08:14</span>
            <span style={styles.liveTag}>● LIVE</span>
          </div>
          <div style={styles.mockupGrid}>
            {["Alex", "Sarah", "James", "You"].map((name, i) => (
              <div
                key={name}
                style={{
                  ...styles.mockupCell,
                  ...(i === 3 ? styles.mockupCellYou : {}),
                }}
              >
                <div style={{
                  ...styles.mockupAvatar,
                  background: avatarColors[i],
                }}>
                  {name[0]}
                </div>
                <span style={styles.mockupName}>{name}</span>
                {i === 0 && <div style={styles.speakingRing} />}
              </div>
            ))}
          </div>
          <div style={styles.mockupControls}>
            {["🎤", "📷", "🖥️", "💬"].map((icon, i) => (
              <div key={i} style={styles.mockupCtrl}>{icon}</div>
            ))}
            <div style={styles.mockupEndBtn}>✕</div>
          </div>
        </motion.div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section id="features" style={styles.featuresSection}>
        <motion.div
          style={styles.sectionHeader}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span style={styles.sectionBadge}>Features</span>
          <h2 style={styles.sectionTitle}>
            Everything you need to<br />
            <span style={styles.heroGradient}>collaborate better</span>
          </h2>
          <p style={styles.sectionSub}>
            Simple, powerful tools built for real conversations.
          </p>
        </motion.div>

        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              style={styles.featureCard}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: "0 20px 50px rgba(99,102,241,0.15)" }}
            >
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── About ────────────────────────────────────────── */}
      <section id="about" style={styles.aboutSection}>
        <motion.div
          style={styles.aboutCard}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={styles.aboutLeft}>
            <span style={styles.sectionBadge}>About MeetX</span>
            <h2 style={styles.aboutTitle}>
              Built for real people,<br />
              <span style={styles.heroGradient}>real conversations</span>
            </h2>
            <p style={styles.aboutDesc}>
              MeetX was built with one goal — to make video communication as simple and
              reliable as possible. No complicated setup, no expensive subscriptions.
              Just open your browser, create a meeting, and share the link.
            </p>
            <p style={styles.aboutDesc}>
              Whether you're catching up with a friend, running a team standup, or
              hosting an online class — MeetX gives you the tools to connect clearly
              and confidently.
            </p>
            <motion.button
              style={styles.primaryBtn}
              whileHover={{ scale: 1.04, boxShadow: "0 0 30px rgba(99,102,241,0.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              Get Started Free <ArrowRight size={15} />
            </motion.button>
          </div>

          <div style={styles.aboutRight}>
            {[
              { icon: "🚀", title: "Instant Meetings", desc: "Start a meeting in seconds — no scheduling needed." },
              { icon: "🔒", title: "Private & Secure", desc: "All calls are encrypted. Your data stays yours." },
              { icon: "🌐", title: "Browser-Based", desc: "No app downloads. Works on any modern browser." },
              { icon: "💬", title: "Built-in Chat", desc: "Send messages without leaving your meeting." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                style={styles.aboutItem}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={styles.aboutItemIcon}>{item.icon}</div>
                <div>
                  <div style={styles.aboutItemTitle}>{item.title}</div>
                  <div style={styles.aboutItemDesc}>{item.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section style={styles.ctaSection}>
        <motion.div
          style={styles.ctaCard}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={styles.ctaTitle}>Ready to Connect Beyond Limits?</h2>
          <p style={styles.ctaSub}>
            Create your free account and start your first meeting in under a minute.
          </p>
          <div style={styles.heroBtns}>
            <motion.button
              style={styles.primaryBtn}
              whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(99,102,241,0.5)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              <Video size={17} /> Start for Free
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer id="contact" style={styles.footer}>
        <div style={styles.footerInner}>

          {/* Brand */}
          <div style={styles.footerBrand}>
            <div style={styles.logo} onClick={() => navigate("/")}>
              <div style={styles.logoIcon}><Video size={17} color="#fff" /></div>
              <span style={styles.logoText}>MeetX</span>
            </div>
            <p style={styles.footerTagline}>Connect Beyond Limits</p>
            <div style={styles.socialRow}>
              <a href="/" style={styles.socialIcon} aria-label="X / Twitter">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                </svg>
              </a>
              <a href="/" style={styles.socialIcon} aria-label="LinkedIn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div style={styles.footerLinks}>
            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "About", href: "#about" },
                ],
              },
              {
                title: "Account",
                links: [
                  { label: "Login", href: "/auth" },
                  { label: "Sign Up", href: "/auth" },
                ],
              },
              {
                title: "Contact",
                links: [
                  { label: "Support", href: "#contact" },
                  { label: "Privacy", href: "#contact" },
                ],
              },
            ].map(col => (
              <div key={col.title} style={styles.footerCol}>
                <div style={styles.footerColTitle}>{col.title}</div>
                {col.links.map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={styles.footerLink}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.footerBottom}>
          <span>© {new Date().getFullYear()} MeetX. All rights reserved.</span>
          <span>Built with ❤️ for seamless collaboration</span>
        </div>
      </footer>
    </div>
  );
}

const avatarColors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"];

const styles = {
  root: {
    minHeight: "100vh",
    background: "#080b14",
    color: "#f1f5f9",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    overflowX: "hidden",
    position: "relative",
  },

  // ── Ambient ─────────────────────────────────────────────
  ambientWrapper: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden",
  },
  orb: {
    position: "absolute", borderRadius: "50%",
    filter: "blur(90px)", opacity: 0.15,
  },
  orb1: {
    width: 560, height: 560,
    background: "radial-gradient(circle, #6366f1, transparent)",
    top: -200, left: -100,
  },
  orb2: {
    width: 460, height: 460,
    background: "radial-gradient(circle, #8b5cf6, transparent)",
    top: 300, right: -140,
  },
  orb3: {
    width: 380, height: 380,
    background: "radial-gradient(circle, #06b6d4, transparent)",
    bottom: 0, left: "40%",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
    backgroundSize: "60px 60px",
  },

  // ── Navbar ──────────────────────────────────────────────
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "0 24px",
    transition: "background 0.3s, border-color 0.3s",
  },
  navScrolled: {
    background: "rgba(8,11,20,0.88)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(99,102,241,0.15)",
  },
  navInner: {
    maxWidth: 1200, margin: "0 auto",
    display: "flex", alignItems: "center", gap: 28,
    height: 68,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 9,
    cursor: "pointer",
  },
  logoIcon: {
    width: 34, height: 34, borderRadius: 9,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 18px rgba(99,102,241,0.4)",
  },
  logoText: {
    fontSize: 21, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex", gap: 28, marginLeft: "auto",
  },
  navLink: {
    color: "#94a3b8", fontSize: 14, textDecoration: "none",
    fontWeight: 500, transition: "color 0.2s",
  },
  navActions: {
    display: "flex", gap: 10, alignItems: "center",
  },
  loginBtn: {
    background: "transparent",
    border: "1px solid rgba(148,163,184,0.22)",
    color: "#cbd5e1", padding: "8px 18px", borderRadius: 9,
    fontSize: 14, fontWeight: 500, cursor: "pointer",
  },
  signupBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff", padding: "8px 18px", borderRadius: 9,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 6,
  },
  hamburger: {
    display: "none", background: "none", border: "none",
    cursor: "pointer", padding: 4, marginLeft: "auto",
  },
  mobileMenu: {
    background: "rgba(12,16,32,0.98)", backdropFilter: "blur(20px)",
    padding: "20px 24px 28px",
    display: "flex", flexDirection: "column", gap: 10,
    borderTop: "1px solid rgba(99,102,241,0.12)",
  },
  mobileLink: {
    color: "#94a3b8", fontSize: 15, textDecoration: "none",
    padding: "9px 0", fontWeight: 500,
  },
  mobileDivider: {
    height: 1, background: "rgba(99,102,241,0.1)", margin: "4px 0",
  },
  mobileBtnOutline: {
    background: "transparent", border: "1px solid rgba(148,163,184,0.22)",
    color: "#cbd5e1", padding: "11px", borderRadius: 10,
    fontSize: 14, fontWeight: 500, cursor: "pointer",
  },
  mobileBtnFill: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff", padding: "11px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
  },

  // ── Hero ────────────────────────────────────────────────
  hero: {
    minHeight: "100vh",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    paddingTop: 110, paddingBottom: 80,
    paddingLeft: 24, paddingRight: 24,
    position: "relative", zIndex: 1, gap: 48,
  },
  heroContent: {
    maxWidth: 760, width: "100%",
    textAlign: "center",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: 24,
  },
  heroBadge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.28)",
    borderRadius: 100, padding: "6px 16px",
    fontSize: 13, color: "#a78bfa", fontWeight: 500,
  },
  heroTitle: {
    fontSize: "clamp(44px, 7.5vw, 80px)",
    fontWeight: 800, lineHeight: 1.1,
    letterSpacing: "-2px", color: "#f8fafc", margin: 0,
  },
  heroGradient: {
    background: "linear-gradient(135deg, #818cf8, #a78bfa, #38bdf8)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "clamp(15px, 2vw, 18px)",
    color: "#94a3b8", lineHeight: 1.75,
    maxWidth: 580, margin: 0,
  },
  heroBtns: {
    display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff", padding: "13px 26px", borderRadius: 13,
    fontSize: 15, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 0 26px rgba(99,102,241,0.32)",
  },
  outlineBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#cbd5e1", padding: "13px 26px", borderRadius: 13,
    fontSize: 15, fontWeight: 500, cursor: "pointer",
    backdropFilter: "blur(10px)",
  },

  // ── Mockup ──────────────────────────────────────────────
  mockup: {
    width: "100%", maxWidth: 740,
    background: "rgba(13,18,38,0.75)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.18)",
    borderRadius: 18, overflow: "hidden",
    boxShadow: "0 40px 90px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)",
  },
  mockupBar: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "11px 16px",
    background: "rgba(99,102,241,0.07)",
    borderBottom: "1px solid rgba(99,102,241,0.1)",
  },
  mockupDots: { display: "flex", gap: 5 },
  dot: { width: 10, height: 10, borderRadius: "50%" },
  mockupBarTitle: {
    flex: 1, textAlign: "center", fontSize: 12,
    color: "#64748b", fontWeight: 500,
  },
  liveTag: {
    fontSize: 10, color: "#f87171", fontWeight: 700, letterSpacing: 1,
    background: "rgba(248,113,113,0.1)", padding: "3px 8px", borderRadius: 5,
  },
  mockupGrid: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, padding: 16,
  },
  mockupCell: {
    background: "rgba(28,33,58,0.7)", borderRadius: 12,
    padding: "18px 8px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
    border: "1px solid rgba(99,102,241,0.08)", position: "relative",
    minHeight: 100,
  },
  mockupCellYou: {
    border: "1.5px solid rgba(99,102,241,0.45)",
    background: "rgba(99,102,241,0.07)",
  },
  mockupAvatar: {
    width: 44, height: 44, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 700, color: "#fff",
  },
  mockupName: { fontSize: 11, color: "#94a3b8", fontWeight: 500 },
  speakingRing: {
    position: "absolute", inset: -2, borderRadius: 14,
    border: "2px solid #34d399",
    boxShadow: "0 0 10px rgba(52,211,153,0.4)",
    pointerEvents: "none",
  },
  mockupControls: {
    display: "flex", justifyContent: "center", gap: 8,
    padding: "12px 16px",
    borderTop: "1px solid rgba(99,102,241,0.08)",
  },
  mockupCtrl: {
    width: 40, height: 40, borderRadius: 10,
    background: "rgba(99,102,241,0.1)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 16,
  },
  mockupEndBtn: {
    width: 40, height: 40, borderRadius: 10,
    background: "rgba(239,68,68,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, color: "#f87171", fontWeight: 700, marginLeft: 8,
  },

  // ── Features ────────────────────────────────────────────
  featuresSection: {
    padding: "100px 24px",
    maxWidth: 1180, margin: "0 auto",
    position: "relative", zIndex: 1,
  },
  sectionHeader: { textAlign: "center", marginBottom: 56 },
  sectionBadge: {
    display: "inline-block",
    background: "rgba(99,102,241,0.1)",
    border: "1px solid rgba(99,102,241,0.28)",
    color: "#818cf8", borderRadius: 100,
    padding: "4px 14px", fontSize: 11,
    fontWeight: 700, letterSpacing: 1,
    textTransform: "uppercase", marginBottom: 18,
  },
  sectionTitle: {
    fontSize: "clamp(28px, 4vw, 44px)",
    fontWeight: 800, letterSpacing: "-1px",
    color: "#f8fafc", lineHeight: 1.18, margin: "0 0 14px",
  },
  sectionSub: {
    fontSize: 16, color: "#64748b", maxWidth: 460, margin: "0 auto",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
  },
  featureCard: {
    background: "rgba(13,18,38,0.65)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(99,102,241,0.1)",
    borderRadius: 18, padding: "32px 28px",
    transition: "all 0.3s",
  },
  featureIcon: {
    width: 52, height: 52, borderRadius: 13,
    background: "rgba(99,102,241,0.12)",
    border: "1px solid rgba(99,102,241,0.18)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#818cf8", marginBottom: 18,
  },
  featureTitle: {
    fontSize: 17, fontWeight: 700,
    color: "#f1f5f9", margin: "0 0 8px",
  },
  featureDesc: {
    fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0,
  },

  // ── About ───────────────────────────────────────────────
  aboutSection: {
    padding: "80px 24px",
    position: "relative", zIndex: 1,
    background: "rgba(99,102,241,0.03)",
    borderTop: "1px solid rgba(99,102,241,0.07)",
    borderBottom: "1px solid rgba(99,102,241,0.07)",
  },
  aboutCard: {
    maxWidth: 1100, margin: "0 auto",
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: 64, alignItems: "center",
  },
  aboutLeft: {
    display: "flex", flexDirection: "column", gap: 18,
  },
  aboutTitle: {
    fontSize: "clamp(26px, 3.5vw, 40px)",
    fontWeight: 800, letterSpacing: "-0.5px",
    color: "#f8fafc", margin: 0, lineHeight: 1.2,
  },
  aboutDesc: {
    fontSize: 15, color: "#64748b", lineHeight: 1.75, margin: 0,
  },
  aboutRight: {
    display: "flex", flexDirection: "column", gap: 16,
  },
  aboutItem: {
    display: "flex", alignItems: "flex-start", gap: 16,
    background: "rgba(13,18,38,0.6)",
    border: "1px solid rgba(99,102,241,0.1)",
    borderRadius: 14, padding: "16px 18px",
  },
  aboutItemIcon: {
    fontSize: 22, flexShrink: 0, marginTop: 2,
  },
  aboutItemTitle: {
    fontSize: 14, fontWeight: 700, color: "#f1f5f9", marginBottom: 4,
  },
  aboutItemDesc: {
    fontSize: 13, color: "#64748b", lineHeight: 1.55,
  },

  // ── CTA ─────────────────────────────────────────────────
  ctaSection: {
    padding: "80px 24px",
    position: "relative", zIndex: 1,
  },
  ctaCard: {
    maxWidth: 660, margin: "0 auto", textAlign: "center",
    background: "rgba(99,102,241,0.06)",
    border: "1px solid rgba(99,102,241,0.18)",
    borderRadius: 24, padding: "56px 40px",
    backdropFilter: "blur(18px)",
    boxShadow: "0 0 70px rgba(99,102,241,0.09)",
  },
  ctaTitle: {
    fontSize: "clamp(24px, 3.5vw, 38px)",
    fontWeight: 800, color: "#f8fafc",
    margin: "0 0 14px", letterSpacing: "-0.5px",
  },
  ctaSub: {
    fontSize: 15, color: "#64748b", margin: "0 0 32px", lineHeight: 1.65,
  },

  // ── Footer ──────────────────────────────────────────────
  footer: {
    borderTop: "1px solid rgba(99,102,241,0.08)",
    padding: "56px 24px 28px",
    position: "relative", zIndex: 1,
  },
  footerInner: {
    maxWidth: 1100, margin: "0 auto 40px",
    display: "flex", gap: 56, flexWrap: "wrap",
  },
  footerBrand: {
    display: "flex", flexDirection: "column", gap: 14, minWidth: 180,
  },
  footerTagline: { fontSize: 13, color: "#475569", margin: 0 },
  socialRow: { display: "flex", gap: 10 },
  socialIcon: {
    color: "#475569", display: "flex",
    transition: "color 0.2s", textDecoration: "none",
  },
  footerLinks: {
    display: "flex", gap: 52, flex: 1, flexWrap: "wrap",
  },
  footerCol: { display: "flex", flexDirection: "column", gap: 10 },
  footerColTitle: {
    fontSize: 13, fontWeight: 700, color: "#94a3b8", marginBottom: 2,
  },
  footerLink: {
    fontSize: 13, color: "#475569",
    textDecoration: "none", transition: "color 0.2s",
  },
  footerBottom: {
    maxWidth: 1100, margin: "0 auto",
    display: "flex", justifyContent: "space-between",
    flexWrap: "wrap", gap: 10,
    fontSize: 12, color: "#334155",
    borderTop: "1px solid rgba(99,102,241,0.07)",
    paddingTop: 20,
  },
};