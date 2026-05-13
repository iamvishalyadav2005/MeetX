import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Video, Shield, Zap, Globe, Users, MessageSquare,
  ArrowRight, Menu, X, Star, Check, ChevronRight, Play
} from "lucide-react";
export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const features = [
    { icon: <Video size={28} />, title: "Crystal Clear Video", desc: "Up to 4K video quality with adaptive bitrate streaming for flawless calls." },
    { icon: <Shield size={28} />, title: "End-to-End Encrypted", desc: "Military-grade encryption keeps every meeting private and secure." },
    { icon: <Zap size={28} />, title: "Ultra Low Latency", desc: "Sub-100ms latency powered by our global edge infrastructure." },
    { icon: <Globe size={28} />, title: "Global Reach", desc: "Connect with teammates across 190+ countries without interruption." },
    { icon: <Users size={28} />, title: "Up to 1000 Participants", desc: "Host large webinars, town halls, and all-hands meetings with ease." },
    { icon: <MessageSquare size={28} />, title: "Real-time Chat", desc: "Integrated messaging with file sharing, reactions, and threads." },
  ];

  const stats = [
    { value: "10M+", label: "Active Users" },
    { value: "190+", label: "Countries" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "4K", label: "Video Quality" },
  ];

  const plans = [
    {
      name: "Starter", price: "Free", desc: "Perfect for individuals and small teams.",
      features: ["Up to 10 participants", "40-min meeting limit", "HD video", "Chat messaging"],
      cta: "Get Started", highlight: false
    },
    {
      name: "Pro", price: "$12", desc: "For growing teams that need more power.",
      features: ["Up to 100 participants", "Unlimited meetings", "4K video", "Cloud recording", "Custom backgrounds"],
      cta: "Start Free Trial", highlight: true
    },
    {
      name: "Enterprise", price: "Custom", desc: "For large organizations at scale.",
      features: ["Up to 1000 participants", "SSO & advanced security", "SLA guarantee", "Dedicated support", "Custom integrations"],
      cta: "Contact Sales", highlight: false
    },
  ];

  const navLinks = ["Home", "Features", "Pricing", "Contact"];

  return (
    <div style={styles.root}>
      {/* Ambient background */}
      <div style={styles.ambientWrapper}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />
        <div style={styles.grid} />
      </div>

      {/* Navbar */}
      <motion.nav
        style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => navigate("/")}>
            <div style={styles.logoIcon}><Video size={18} color="#fff" /></div>
            <span style={styles.logoText}>MeetX</span>
          </div>

          <div style={styles.navLinks}>
            {navLinks.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`} style={styles.navLink}>{link}</a>
            ))}
          </div>

          <div style={styles.navActions}>
            <motion.button
              style={styles.signInBtn}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              Sign In
            </motion.button>
            <motion.button
              style={styles.getStartedBtn}
              whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(99,102,241,0.5)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              Get Started <ArrowRight size={15} />
            </motion.button>
          </div>

          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
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
              <a key={link} href={`#${link.toLowerCase()}`} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{link}</a>
            ))}
            <button style={styles.mobileAuthBtn} onClick={() => navigate("/auth")}>Sign In</button>
            <button style={{ ...styles.mobileAuthBtn, ...styles.getStartedBtn }} onClick={() => navigate("/auth")}>Get Started</button>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero */}
      <section id="home" ref={heroRef} style={styles.hero}>
        <motion.div style={{ ...styles.heroContent, y: yParallax }}>
          <motion.div
            style={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Star size={13} color="#a78bfa" fill="#a78bfa" />
            <span>Trusted by 10M+ teams worldwide</span>
          </motion.div>

          <motion.h1
            style={styles.heroTitle}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            Connect Beyond<br />
            <span style={styles.heroGradient}>Limits</span>
          </motion.h1>

          <motion.p
            style={styles.heroSub}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            MeetX brings teams together with crystal-clear video, real-time collaboration,<br />
            and enterprise-grade security — all in one seamless platform.
          </motion.p>

          <motion.div
            style={styles.heroBtns}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <motion.button
              style={styles.primaryBtn}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.55)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              <Video size={18} /> Start a Meeting
            </motion.button>
            <motion.button
              style={styles.secondaryBtn}
              whileHover={{ scale: 1.05, borderColor: "#818cf8" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              <Play size={16} fill="#a78bfa" color="#a78bfa" /> Watch Demo
            </motion.button>
          </motion.div>

          {/* Mock video UI */}
          <motion.div
            style={styles.mockup}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div style={styles.mockupBar}>
              <div style={styles.mockupDots}>
                <span style={{ ...styles.dot, background: "#f87171" }} />
                <span style={{ ...styles.dot, background: "#fbbf24" }} />
                <span style={{ ...styles.dot, background: "#34d399" }} />
              </div>
              <div style={styles.mockupTitle}>MeetX — Team Standup · 00:12:34</div>
              <div style={styles.mockupActions}>
                <span style={styles.liveTag}>● LIVE</span>
              </div>
            </div>
            <div style={styles.mockupGrid}>
              {["Alex", "Sarah", "James", "You"].map((name, i) => (
                <div key={name} style={{ ...styles.mockupCell, ...(i === 3 ? styles.mockupCellActive : {}) }}>
                  <div style={{ ...styles.mockupAvatar, background: avatarColors[i] }}>
                    {name[0]}
                  </div>
                  <span style={styles.mockupName}>{name}</span>
                  {i === 0 && <div style={styles.speakingDot} />}
                </div>
              ))}
            </div>
            <div style={styles.mockupControls}>
              {["🎤", "📷", "🖥️", "💬", "⋯"].map((icon, i) => (
                <div key={i} style={{ ...styles.mockupCtrl, ...(i === 4 ? styles.mockupCtrlEnd : {}) }}>{icon}</div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <div style={styles.statsGrid}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              style={styles.statCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={styles.section}>
        <motion.div
          style={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={styles.sectionBadge}>Features</div>
          <h2 style={styles.sectionTitle}>Everything you need to<br /><span style={styles.heroGradient}>collaborate better</span></h2>
          <p style={styles.sectionSub}>Powerful tools designed for modern teams — from startups to enterprises.</p>
        </motion.div>

        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              style={styles.featureCard}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(99,102,241,0.18)" }}
            >
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={styles.section}>
        <motion.div
          style={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div style={styles.sectionBadge}>Pricing</div>
          <h2 style={styles.sectionTitle}>Simple, transparent<br /><span style={styles.heroGradient}>pricing</span></h2>
          <p style={styles.sectionSub}>Start free, scale as you grow. No hidden fees, ever.</p>
        </motion.div>

        <div style={styles.pricingGrid}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              style={{ ...styles.pricingCard, ...(plan.highlight ? styles.pricingCardHighlight : {}) }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              {plan.highlight && <div style={styles.popularBadge}>Most Popular</div>}
              <div style={styles.planName}>{plan.name}</div>
              <div style={styles.planPrice}>{plan.price}<span style={styles.planPer}>{plan.price !== "Free" && plan.price !== "Custom" ? "/mo" : ""}</span></div>
              <div style={styles.planDesc}>{plan.desc}</div>
              <div style={styles.planDivider} />
              <ul style={styles.planFeatures}>
                {plan.features.map(f => (
                  <li key={f} style={styles.planFeature}>
                    <Check size={15} color="#818cf8" strokeWidth={2.5} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                style={{ ...styles.planBtn, ...(plan.highlight ? styles.planBtnHighlight : {}) }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/auth")}
              >
                {plan.cta} <ChevronRight size={15} />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <motion.div
          style={styles.ctaInner}
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={styles.ctaTitle}>Ready to Connect Beyond Limits?</h2>
          <p style={styles.ctaSub}>Join millions of teams using MeetX to collaborate without boundaries.</p>
          <div style={styles.heroBtns}>
            <motion.button
              style={styles.primaryBtn}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(99,102,241,0.55)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth")}
            >
              <Video size={18} /> Start for Free
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" style={styles.footer}>
        <div style={styles.footerTop}>
          <div style={styles.footerBrand}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}><Video size={18} color="#fff" /></div>
              <span style={styles.logoText}>MeetX</span>
            </div>
            <p style={styles.footerTagline}>Connect Beyond Limits</p>
            <div style={styles.socialRow}>
  <motion.a href="#" style={styles.socialIcon} whileHover={{ scale: 1.2, color: "#818cf8" }}
    aria-label="X / Twitter">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
    </svg>
  </motion.a>
  {/* <motion.a href="#" style={styles.socialIcon} whileHover={{ scale: 1.2, color: "#818cf8" }}
    aria-label="GitHub">
    <Github size={18} />
  </motion.a> */}
  <motion.a href="#" style={styles.socialIcon} whileHover={{ scale: 1.2, color: "#818cf8" }}
    aria-label="LinkedIn">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </motion.a>
</div>
          </div>
          <div style={styles.footerLinks}>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "Changelog"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
              { title: "Support", links: ["Help Center", "Contact", "Status", "Privacy"] },
            ].map(col => (
              <div key={col.title} style={styles.footerCol}>
                <div style={styles.footerColTitle}>{col.title}</div>
                {col.links.map(link => (
                  <a key={link} href="#" style={styles.footerLink}>{link}</a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span>© 2025 MeetX. All rights reserved.</span>
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
  ambientWrapper: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden",
  },
  orb: {
    position: "absolute", borderRadius: "50%", filter: "blur(90px)", opacity: 0.18,
  },
  orb1: {
    width: 600, height: 600, background: "radial-gradient(circle, #6366f1, transparent)",
    top: -200, left: -100,
  },
  orb2: {
    width: 500, height: 500, background: "radial-gradient(circle, #8b5cf6, transparent)",
    top: 300, right: -150,
  },
  orb3: {
    width: 400, height: 400, background: "radial-gradient(circle, #06b6d4, transparent)",
    bottom: 0, left: "40%",
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
  },

  // Nav
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "0 24px",
    transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
  },
  navScrolled: {
    background: "rgba(8,11,20,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(99,102,241,0.15)",
  },
  navInner: {
    maxWidth: 1200, margin: "0 auto",
    display: "flex", alignItems: "center", gap: 32,
    height: 70,
  },
  logo: {
    display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textDecoration: "none",
  },
  logoIcon: {
    width: 36, height: 36, borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px rgba(99,102,241,0.4)",
  },
  logoText: {
    fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex", gap: 32, marginLeft: "auto",
    "@media(max-width:768px)": { display: "none" },
  },
  navLink: {
    color: "#94a3b8", fontSize: 15, textDecoration: "none", fontWeight: 500,
    transition: "color 0.2s", cursor: "pointer",
  },
  navActions: {
    display: "flex", gap: 12, alignItems: "center",
  },
  signInBtn: {
    background: "transparent", border: "1px solid rgba(148,163,184,0.25)",
    color: "#cbd5e1", padding: "8px 20px", borderRadius: 10,
    fontSize: 14, fontWeight: 500, cursor: "pointer",
    transition: "border-color 0.2s, color 0.2s",
  },
  getStartedBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff", padding: "9px 20px", borderRadius: 10,
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 6,
  },
  hamburger: {
    display: "none", background: "none", border: "none", cursor: "pointer", padding: 4,
    "@media(max-width:768px)": { display: "block" },
  },
  mobileMenu: {
    background: "rgba(15,20,40,0.98)", backdropFilter: "blur(20px)",
    padding: "20px 24px", display: "flex", flexDirection: "column", gap: 12,
    borderTop: "1px solid rgba(99,102,241,0.15)",
  },
  mobileLink: {
    color: "#94a3b8", fontSize: 16, textDecoration: "none", padding: "8px 0",
  },
  mobileAuthBtn: {
    background: "transparent", border: "1px solid rgba(148,163,184,0.25)",
    color: "#cbd5e1", padding: "12px 20px", borderRadius: 10,
    fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "center",
  },

  // Hero
  hero: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    paddingTop: 100, paddingBottom: 60, paddingLeft: 24, paddingRight: 24,
    position: "relative", zIndex: 1,
  },
  heroContent: {
    maxWidth: 900, width: "100%", textAlign: "center", display: "flex",
    flexDirection: "column", alignItems: "center", gap: 28,
  },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
    borderRadius: 100, padding: "6px 16px", fontSize: 13, color: "#a78bfa", fontWeight: 500,
  },
  heroTitle: {
    fontSize: "clamp(48px, 8vw, 84px)", fontWeight: 800,
    lineHeight: 1.08, letterSpacing: "-2px", color: "#f8fafc", margin: 0,
  },
  heroGradient: {
    background: "linear-gradient(135deg, #818cf8, #a78bfa, #38bdf8)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: "clamp(16px, 2vw, 19px)", color: "#94a3b8", lineHeight: 1.7,
    maxWidth: 620, margin: 0,
  },
  heroBtns: {
    display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff", padding: "14px 28px", borderRadius: 14,
    fontSize: 16, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8,
    boxShadow: "0 0 30px rgba(99,102,241,0.35)",
  },
  secondaryBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)",
    color: "#cbd5e1", padding: "14px 28px", borderRadius: 14,
    fontSize: 16, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 8,
    backdropFilter: "blur(10px)",
  },

  // Mockup
  mockup: {
    width: "100%", maxWidth: 780,
    background: "rgba(15,20,40,0.7)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 20, overflow: "hidden",
    boxShadow: "0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)",
    marginTop: 12,
  },
  mockupBar: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 18px", background: "rgba(99,102,241,0.08)",
    borderBottom: "1px solid rgba(99,102,241,0.12)",
  },
  mockupDots: { display: "flex", gap: 6 },
  dot: { width: 11, height: 11, borderRadius: "50%" },
  mockupTitle: { flex: 1, textAlign: "center", fontSize: 13, color: "#64748b", fontWeight: 500 },
  mockupActions: {},
  liveTag: {
    fontSize: 11, color: "#f87171", fontWeight: 700, letterSpacing: 1,
    background: "rgba(248,113,113,0.1)", padding: "3px 8px", borderRadius: 6,
  },
  mockupGrid: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, padding: 20,
  },
  mockupCell: {
    background: "rgba(30,35,60,0.7)", borderRadius: 14, padding: "20px 10px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    border: "1px solid rgba(99,102,241,0.1)", position: "relative",
    minHeight: 110,
  },
  mockupCellActive: {
    border: "1.5px solid rgba(99,102,241,0.5)",
    background: "rgba(99,102,241,0.08)",
  },
  mockupAvatar: {
    width: 48, height: 48, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20, fontWeight: 700, color: "#fff",
  },
  mockupName: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },
  speakingDot: {
    position: "absolute", top: 10, right: 10,
    width: 8, height: 8, borderRadius: "50%", background: "#34d399",
    boxShadow: "0 0 8px #34d399",
  },
  mockupControls: {
    display: "flex", justifyContent: "center", gap: 10, padding: "14px 20px",
    borderTop: "1px solid rgba(99,102,241,0.1)",
  },
  mockupCtrl: {
    width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.12)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, cursor: "pointer",
  },
  mockupCtrlEnd: { background: "rgba(239,68,68,0.2)", marginLeft: 16 },

  // Stats
  statsSection: {
    padding: "60px 24px", position: "relative", zIndex: 1,
    borderTop: "1px solid rgba(99,102,241,0.08)",
    borderBottom: "1px solid rgba(99,102,241,0.08)",
    background: "rgba(99,102,241,0.03)",
  },
  statsGrid: {
    maxWidth: 900, margin: "0 auto",
    display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24,
  },
  statCard: {
    textAlign: "center", padding: "20px 10px",
  },
  statValue: {
    fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-1px",
    background: "linear-gradient(135deg, #818cf8, #a78bfa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  statLabel: { fontSize: 14, color: "#64748b", fontWeight: 500, marginTop: 4 },

  // Sections
  section: {
    padding: "100px 24px", maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1,
  },
  sectionHeader: { textAlign: "center", marginBottom: 64 },
  sectionBadge: {
    display: "inline-block",
    background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)",
    color: "#818cf8", borderRadius: 100, padding: "5px 16px", fontSize: 12,
    fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 20,
  },
  sectionTitle: {
    fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-1px",
    color: "#f8fafc", lineHeight: 1.15, margin: "0 0 16px",
  },
  sectionSub: { fontSize: 17, color: "#64748b", maxWidth: 500, margin: "0 auto" },

  // Features
  featuresGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24,
  },
  featureCard: {
    background: "rgba(15,20,40,0.6)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.12)", borderRadius: 20,
    padding: "36px 32px", transition: "all 0.3s",
  },
  featureIcon: {
    width: 56, height: 56, borderRadius: 14,
    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
    border: "1px solid rgba(99,102,241,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#818cf8", marginBottom: 20,
  },
  featureTitle: { fontSize: 19, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px" },
  featureDesc: { fontSize: 15, color: "#64748b", lineHeight: 1.65, margin: 0 },

  // Pricing
  pricingGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24, maxWidth: 1000, margin: "0 auto",
  },
  pricingCard: {
    background: "rgba(15,20,40,0.6)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.12)", borderRadius: 24,
    padding: "40px 36px", position: "relative", transition: "all 0.3s",
  },
  pricingCardHighlight: {
    border: "1.5px solid rgba(99,102,241,0.4)",
    background: "rgba(99,102,241,0.07)",
    boxShadow: "0 0 60px rgba(99,102,241,0.12)",
  },
  popularBadge: {
    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "#fff", fontSize: 12, fontWeight: 700,
    padding: "4px 18px", borderRadius: 100, whiteSpace: "nowrap",
  },
  planName: { fontSize: 18, fontWeight: 700, color: "#94a3b8", marginBottom: 12 },
  planPrice: { fontSize: 48, fontWeight: 800, color: "#f8fafc", letterSpacing: "-2px" },
  planPer: { fontSize: 18, fontWeight: 400, color: "#64748b" },
  planDesc: { fontSize: 14, color: "#64748b", marginTop: 8, marginBottom: 24 },
  planDivider: { height: 1, background: "rgba(99,102,241,0.1)", marginBottom: 24 },
  planFeatures: { listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: 12 },
  planFeature: { display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#94a3b8" },
  planBtn: {
    width: "100%", padding: "14px", borderRadius: 12,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
    color: "#818cf8", fontSize: 15, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  },
  planBtnHighlight: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff",
    boxShadow: "0 0 30px rgba(99,102,241,0.35)",
  },

  // CTA
  ctaBanner: {
    padding: "80px 24px", position: "relative", zIndex: 1,
  },
  ctaInner: {
    maxWidth: 700, margin: "0 auto", textAlign: "center",
    background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 28, padding: "64px 48px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 0 80px rgba(99,102,241,0.1)",
  },
  ctaTitle: { fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#f8fafc", margin: "0 0 16px", letterSpacing: "-1px" },
  ctaSub: { fontSize: 17, color: "#64748b", margin: "0 0 36px" },

  // Footer
  footer: {
    borderTop: "1px solid rgba(99,102,241,0.1)",
    padding: "64px 24px 32px", position: "relative", zIndex: 1,
  },
  footerTop: {
    maxWidth: 1200, margin: "0 auto 48px",
    display: "flex", gap: 60, flexWrap: "wrap",
  },
  footerBrand: { display: "flex", flexDirection: "column", gap: 16, minWidth: 200 },
  footerTagline: { fontSize: 14, color: "#475569", margin: 0 },
  socialRow: { display: "flex", gap: 12 },
  socialIcon: { color: "#475569", display: "flex", transition: "color 0.2s", cursor: "pointer" },
  footerLinks: { display: "flex", gap: 60, flex: 1, flexWrap: "wrap" },
  footerCol: { display: "flex", flexDirection: "column", gap: 12 },
  footerColTitle: { fontSize: 14, fontWeight: 700, color: "#94a3b8", marginBottom: 4 },
  footerLink: { fontSize: 14, color: "#475569", textDecoration: "none", transition: "color 0.2s" },
  footerBottom: {
    maxWidth: 1200, margin: "0 auto",
    display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
    fontSize: 13, color: "#334155",
    borderTop: "1px solid rgba(99,102,241,0.08)", paddingTop: 24,
  },
};