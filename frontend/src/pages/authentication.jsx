import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Eye, EyeOff, User, Lock, Mail,
  ArrowRight, Check, AlertCircle, Loader
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

export default function Authentication() {
  const navigate = useNavigate();
  const { handleLogin, handleRegister } = useContext(AuthContext);

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  // Focus states
  const [focused, setFocused] = useState("");

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthLabel = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (mode === "register" && !name) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await handleLogin(username, password);
      } else {
        const msg = await handleRegister(name, username, password);
        setSuccess(msg || "Account created! Please sign in.");
        setTimeout(() => {
          setMode("login");
          setSuccess("");
          setName("");
          setPassword("");
        }, 1800);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setName("");
    setUsername("");
    setPassword("");
  };

  const strength = passwordStrength();

  return (
    <div style={styles.root}>
      {/* Ambient background */}
      <div style={styles.ambientWrapper}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={styles.grid} />
      </div>

      {/* Logo */}
      <motion.div
        style={styles.logoRow}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate("/")}
      >
        <div style={styles.logoIcon}><Video size={18} color="#fff" /></div>
        <span style={styles.logoText}>MeetX</span>
      </motion.div>

      {/* Card */}
      <div style={styles.cardWrapper}>
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Glow border top */}
          <div style={styles.cardGlowBar} />

          {/* Toggle tabs */}
          <div style={styles.tabs}>
            {["login", "register"].map(tab => (
              <button
                key={tab}
                style={{ ...styles.tab, ...(mode === tab ? styles.tabActive : {}) }}
                onClick={() => switchMode(tab)}
              >
                {tab === "login" ? "Sign In" : "Sign Up"}
                {mode === tab && (
                  <motion.div style={styles.tabIndicator} layoutId="tabIndicator" />
                )}
              </button>
            ))}
          </div>

          {/* Header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              style={styles.cardHeader}
            >
              <h1 style={styles.cardTitle}>
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p style={styles.cardSub}>
                {mode === "login"
                  ? "Sign in to your MeetX account to continue"
                  : "Join MeetX and connect beyond limits"}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Error / Success */}
          <AnimatePresence>
            {error && (
              <motion.div
                style={styles.errorBox}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle size={15} color="#f87171" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div
                style={styles.successBox}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Check size={15} color="#34d399" />
                <span>{success}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div style={styles.form}>

            {/* Name field — register only */}
            <AnimatePresence>
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Full Name</label>
                    <div style={{
                      ...styles.inputWrapper,
                      ...(focused === "name" ? styles.inputWrapperFocused : {})
                    }}>
                      <User size={16} color={focused === "name" ? "#818cf8" : "#475569"} />
                      <input
                        style={styles.input}
                        type="text"
                        placeholder="Vishal Yadav"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onFocus={() => setFocused("name")}
                        onBlur={() => setFocused("")}
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Username */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Username</label>
              <div style={{
                ...styles.inputWrapper,
                ...(focused === "username" ? styles.inputWrapperFocused : {})
              }}>
                <Mail size={16} color={focused === "username" ? "#818cf8" : "#475569"} />
                <input
                  style={styles.input}
                  type="text"
                  placeholder="vishal123"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused("")}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <div style={styles.labelRow}>
                <label style={styles.label}>Password</label>
                {mode === "login" && (
                  <a href="#" style={styles.forgotLink}>Forgot password?</a>
                )}
              </div>
              <div style={{
                ...styles.inputWrapper,
                ...(focused === "password" ? styles.inputWrapperFocused : {})
              }}>
                <Lock size={16} color={focused === "password" ? "#818cf8" : "#475569"} />
                <input
                  style={styles.input}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  onKeyDown={handleKeyDown}
                />
                <button
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff size={16} color="#475569" />
                    : <Eye size={16} color="#475569" />}
                </button>
              </div>

              {/* Password strength — register only */}
              {mode === "register" && password.length > 0 && (
                <motion.div
                  style={styles.strengthWrapper}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div style={styles.strengthBars}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        style={{
                          ...styles.strengthBar,
                          background: i <= strength ? strengthColor[strength] : "rgba(255,255,255,0.08)"
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ ...styles.strengthLabel, color: strengthColor[strength] }}>
                    {strengthLabel[strength]}
                  </span>
                </motion.div>
              )}
            </div>

            {/* Remember me */}
            {mode === "login" && (
              <div style={styles.rememberRow}>
                <div
                  style={{ ...styles.checkbox, ...(remember ? styles.checkboxChecked : {}) }}
                  onClick={() => setRemember(!remember)}
                >
                  {remember && <Check size={11} color="#fff" strokeWidth={3} />}
                </div>
                <span style={styles.rememberLabel}>Remember me</span>
              </div>
            )}

            {/* Submit button */}
            <motion.button
              style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnLoading : {}) }}
              whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 40px rgba(99,102,241,0.55)" } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                >
                  <Loader size={18} />
                </motion.div>
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.dividerLine} />
              <span style={styles.dividerText}>or continue with</span>
              <div style={styles.dividerLine} />
            </div>

            {/* Social buttons */}
            <div style={styles.socialBtns}>
              <motion.button
                style={styles.socialBtn}
                whileHover={{ scale: 1.03, borderColor: "#818cf8" }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Google SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </motion.button>

              <motion.button
                style={styles.socialBtn}
                whileHover={{ scale: 1.03, borderColor: "#818cf8" }}
                whileTap={{ scale: 0.97 }}
              >
                {/* GitHub SVG */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </motion.button>
            </div>

          </div>

          {/* Switch mode */}
          <div style={styles.switchRow}>
            <span style={styles.switchText}>
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              style={styles.switchBtn}
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>

        </motion.div>

        {/* Bottom trust note */}
        <motion.p
          style={styles.trustNote}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          🔒 Secured with end-to-end encryption · No spam, ever.
        </motion.p>
      </div>
    </div>
  );
}

const styles = {
  root: {
    minHeight: "100vh",
    background: "#080b14",
    color: "#f1f5f9",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    position: "relative",
    overflow: "hidden",
  },
  ambientWrapper: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
  },
  orb: {
    position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: 0.2,
  },
  orb1: {
    width: 500, height: 500,
    background: "radial-gradient(circle, #6366f1, transparent)",
    top: -150, left: -100,
  },
  orb2: {
    width: 400, height: 400,
    background: "radial-gradient(circle, #8b5cf6, transparent)",
    bottom: -100, right: -80,
  },
  grid: {
    position: "absolute", inset: 0,
    backgroundImage: "linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
  },

  // Logo
  logoRow: {
    display: "flex", alignItems: "center", gap: 10,
    cursor: "pointer", marginBottom: 32, position: "relative", zIndex: 1,
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

  // Card
  cardWrapper: {
    width: "100%", maxWidth: 460,
    display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
    position: "relative", zIndex: 1,
  },
  card: {
    width: "100%",
    background: "rgba(13,17,35,0.85)",
    backdropFilter: "blur(24px)",
    border: "1px solid rgba(99,102,241,0.18)",
    borderRadius: 24,
    padding: "36px 40px",
    boxShadow: "0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)",
    position: "relative",
    overflow: "hidden",
  },
  cardGlowBar: {
    position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
    background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(139,92,246,0.6), transparent)",
  },

  // Tabs
  tabs: {
    display: "flex", background: "rgba(255,255,255,0.04)",
    borderRadius: 12, padding: 4, marginBottom: 28,
    border: "1px solid rgba(99,102,241,0.1)",
  },
  tab: {
    flex: 1, padding: "10px", borderRadius: 9,
    background: "transparent", border: "none",
    color: "#475569", fontSize: 14, fontWeight: 600,
    cursor: "pointer", position: "relative",
    transition: "color 0.2s",
  },
  tabActive: {
    color: "#f1f5f9",
  },
  tabIndicator: {
    position: "absolute", inset: 0, borderRadius: 9,
    background: "rgba(99,102,241,0.18)",
    border: "1px solid rgba(99,102,241,0.25)",
    zIndex: -1,
  },

  // Header
  cardHeader: { marginBottom: 24 },
  cardTitle: {
    fontSize: 26, fontWeight: 800, color: "#f8fafc",
    margin: "0 0 8px", letterSpacing: "-0.5px",
  },
  cardSub: { fontSize: 14, color: "#475569", margin: 0, lineHeight: 1.6 },

  // Alerts
  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
    borderRadius: 10, padding: "10px 14px", marginBottom: 16,
    fontSize: 13, color: "#f87171",
  },
  successBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
    borderRadius: 10, padding: "10px 14px", marginBottom: 16,
    fontSize: 13, color: "#34d399",
  },

  // Form
  form: { display: "flex", flexDirection: "column", gap: 18 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: "#94a3b8" },
  labelRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  forgotLink: {
    fontSize: 12, color: "#818cf8", textDecoration: "none", fontWeight: 500,
  },

  // Input
  inputWrapper: {
    display: "flex", alignItems: "center", gap: 10,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, padding: "12px 14px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputWrapperFocused: {
    borderColor: "rgba(99,102,241,0.5)",
    boxShadow: "0 0 0 3px rgba(99,102,241,0.1)",
  },
  input: {
    flex: 1, background: "transparent", border: "none", outline: "none",
    color: "#f1f5f9", fontSize: 15,
    "::placeholder": { color: "#334155" },
  },
  eyeBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 0, display: "flex", alignItems: "center",
  },

  // Password strength
  strengthWrapper: {
    display: "flex", alignItems: "center", gap: 10, marginTop: 8,
  },
  strengthBars: { display: "flex", gap: 4, flex: 1 },
  strengthBar: {
    flex: 1, height: 4, borderRadius: 4,
    transition: "background 0.3s",
  },
  strengthLabel: { fontSize: 11, fontWeight: 600, minWidth: 60 },

  // Remember
  rememberRow: { display: "flex", alignItems: "center", gap: 10 },
  checkbox: {
    width: 18, height: 18, borderRadius: 5,
    border: "1.5px solid rgba(99,102,241,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "all 0.2s", background: "transparent",
  },
  checkboxChecked: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderColor: "transparent",
  },
  rememberLabel: { fontSize: 13, color: "#64748b" },

  // Submit
  submitBtn: {
    width: "100%", padding: "14px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", borderRadius: 12,
    color: "#fff", fontSize: 15, fontWeight: 700,
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 8,
    boxShadow: "0 0 30px rgba(99,102,241,0.35)",
    transition: "opacity 0.2s",
  },
  submitBtnLoading: { opacity: 0.7, cursor: "not-allowed" },

  // Divider
  divider: {
    display: "flex", alignItems: "center", gap: 12,
  },
  dividerLine: {
    flex: 1, height: 1, background: "rgba(255,255,255,0.07)",
  },
  dividerText: { fontSize: 12, color: "#334155", whiteSpace: "nowrap" },

  // Social
  socialBtns: { display: "flex", gap: 12 },
  socialBtn: {
    flex: 1, padding: "11px 16px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12, color: "#94a3b8",
    fontSize: 14, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "border-color 0.2s, background 0.2s",
  },

  // Switch
  switchRow: {
    display: "flex", justifyContent: "center", alignItems: "center",
    gap: 6, marginTop: 24,
  },
  switchText: { fontSize: 13, color: "#475569" },
  switchBtn: {
    background: "none", border: "none", color: "#818cf8",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
    padding: 0,
  },

  // Trust note
  trustNote: {
    fontSize: 12, color: "#334155", textAlign: "center", margin: 0,
  },
};