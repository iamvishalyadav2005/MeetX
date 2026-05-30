import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff,
  Monitor, MessageSquare, Users, Hand,
  Copy, Check, X, Send,
  MoreVertical, Smile, Settings
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import { io } from "socket.io-client";
import server from "../environment";
import Peer from "simple-peer";

export default function VideoMeetComponent() {
  const { url } = useParams();
  const navigate = useNavigate();
  const { addToUserHistory, currentUser } = useContext(AuthContext);

  // ─── Media state ───────────────────────────────────────────────
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [remoteMedia, setRemoteMedia] = useState({});

  // ─── UI state ──────────────────────────────────────────────────
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]); // [{ id, stream }]
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false); // FIX: was missing
  const [duration, setDuration] = useState(0);
  const [toast, setToast] = useState(null);

  // FIX: get username from localStorage directly — works for all users
  const username = localStorage.getItem("username") || currentUser?.username || "Guest";

  // ─── Refs ──────────────────────────────────────────────────────
  const localVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const peersRef = useRef({});
  const videoRefs = useRef({});

  // ─── Timer ─────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Auto-scroll chat ──────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ─── Main socket + media setup ─────────────────────────────────
  useEffect(() => {
    let stream = null;
    let socket = null;

    const init = async () => {
      // Get local camera + mic
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch {
        showToast("Camera/mic access denied — joining without media.");
      }

      // Connect socket once
      socket = io(server, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join-call", url);
      });

      // ── user-joined ────────────────────────────────────────────
      // Fired for EVERY client already in the room when someone new arrives.
      // Only the EXISTING clients should initiate (create) peers toward the newcomer.
      socket.on("user-joined", (joinedId, allClients) => {
        // Skip our own join event
        if (joinedId === socket.id) return;
        // Skip if peer already exists
        if (peersRef.current[joinedId]) return;

        // We are an existing user — initiate peer toward the new user
        if (stream) {
          const peer = createPeer(joinedId, socket, stream);
          peersRef.current[joinedId] = peer;
        }

        setParticipants(prev => {
          if (prev.find(p => p.id === joinedId)) return prev;
          return [...prev, { id: joinedId, stream: null }];
        });

        showToast("A participant joined.");
      });

      // ── signal ─────────────────────────────────────────────────
      // The NEW user receives signals from existing users and creates
      // non-initiator peers in response.
      socket.on("signal", (fromId, signal) => {
        if (fromId === socket.id) return;

        if (peersRef.current[fromId]) {
          // Peer exists — just pass the signal
          try { peersRef.current[fromId].signal(signal); } catch {}
        } else if (stream) {
          // We are the NEW user — accept this peer
          const peer = acceptPeer(fromId, socket, stream, signal);
          peersRef.current[fromId] = peer;

          setParticipants(prev => {
            if (prev.find(p => p.id === fromId)) return prev;
            return [...prev, { id: fromId, stream: null }];
          });
        }
      });

      // ── chat-message ───────────────────────────────────────────
      // Server broadcasts to everyone in the room including sender.
      // We use senderSocketId to mark our own messages as self=true.
      socket.on("chat-message", (data, sender, senderSocketId) => {
        setMessages(prev => [...prev, {
          id: Date.now() + Math.random(),
          text: data,
          sender,
          self: senderSocketId === socket.id,
          time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit",
          }),
        }]);
      });

      // ── user-left ──────────────────────────────────────────────
      socket.on("user-left", (socketId) => {
        setParticipants(prev => prev.filter(p => p.id !== socketId));
        const peer = peersRef.current[socketId];
        if (peer && typeof peer.destroy === "function") peer.destroy();
        delete peersRef.current[socketId];
        showToast("A participant left.");
      });

      // ── remote media toggle ────────────────────────────────────
      socket.on("media-toggled", (id, type, state) => {
        setRemoteMedia(prev => ({ ...prev, [id]: { ...prev[id], [type]: state } }));
      });
    };

    init();

    // Cleanup on unmount
    return () => {
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      socketRef.current?.disconnect();
      Object.values(peersRef.current).forEach(p => {
        if (p && typeof p.destroy === "function") p.destroy();
      });
      peersRef.current = {};
    };
  }, [url]);

  // ─── Create peer (initiator = existing user) ───────────────────
  const createPeer = (targetId, socket, stream) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", signal => {
      socket.emit("signal", targetId, signal);
    });

    peer.on("stream", remoteStream => {
      // Attach stream to video element
      if (videoRefs.current[targetId]) {
        videoRefs.current[targetId].srcObject = remoteStream;
      }
      // Update participant state with stream
      setParticipants(prev =>
        prev.map(p => p.id === targetId ? { ...p, stream: remoteStream } : p)
      );
    });

    peer.on("error", err => console.warn("Peer error:", err));
    return peer;
  };

  // ─── Accept peer (non-initiator = new user joining) ────────────
  const acceptPeer = (fromId, socket, stream, incomingSignal) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", signal => {
      socket.emit("signal", fromId, signal);
    });

    peer.on("stream", remoteStream => {
      if (videoRefs.current[fromId]) {
        videoRefs.current[fromId].srcObject = remoteStream;
      }
      setParticipants(prev =>
        prev.map(p => p.id === fromId ? { ...p, stream: remoteStream } : p)
      );
    });

    peer.on("error", err => console.warn("Peer error:", err));
    peer.signal(incomingSignal);
    return peer;
  };

  // ─── Helpers ───────────────────────────────────────────────────
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleMic = () => {
    const tracks = localStreamRef.current?.getAudioTracks();
    if (tracks?.length) {
      tracks[0].enabled = !micOn;
      setMicOn(v => !v);
      socketRef.current?.emit("toggle-media", "mic", !micOn);
    }
  };

  const toggleCam = () => {
    const tracks = localStreamRef.current?.getVideoTracks();
    if (tracks?.length) {
      tracks[0].enabled = !camOn;
      setCamOn(v => !v);
      socketRef.current?.emit("toggle-media", "cam", !camOn);
    }
  };

  const toggleScreen = async () => {
    if (!screenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" }, audio: false,
        });
        screenStreamRef.current = screenStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        setScreenSharing(true);
        showToast("Screen sharing started.");
        screenStream.getVideoTracks()[0].onended = stopScreenShare;
      } catch {
        showToast("Screen sharing cancelled.");
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
    setScreenSharing(false);
    showToast("Screen sharing stopped.");
  };

  // FIX: sendChat — don't add to local messages manually.
  // The server broadcasts back to everyone including us via "chat-message".
  // self=true is determined by senderSocketId === socket.id on that event.
  const sendChat = () => {
    if (!chatMsg.trim()) return;
    socketRef.current?.emit("chat-message", chatMsg.trim(), username);
    setChatMsg("");
  };

  // FIX: setCodeCopied(true) added so waiting card hides after copy
  const copyMeetingId = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setCodeCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const endCall = async () => {
    try { await addToUserHistory(url); } catch {}
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    socketRef.current?.disconnect();
    Object.values(peersRef.current).forEach(p => {
      if (p && typeof p.destroy === "function") p.destroy();
    });
    peersRef.current = {};
    navigate("/home");
  };

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const sidePanelOpen = chatOpen || participantsOpen;

  return (
    <div style={styles.root}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMini}><Video size={14} color="#fff" /></div>
          <span style={styles.logoText}>MeetX</span>
        </div>

        <div style={styles.headerCenter}>
          <div style={styles.timerBadge}>
            <span style={styles.liveDot} />
            {formatDuration(duration)}
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.meetIdRow}>
            <span style={styles.meetIdLabel}>ID:</span>
            <span style={styles.meetIdValue}>{url}</span>
            <motion.button style={styles.copyBtn} whileTap={{ scale: 0.9 }} onClick={copyMeetingId}>
              {copied
                ? <Check size={13} color="#34d399" />
                : <Copy size={13} color="#94a3b8" />}
            </motion.button>
          </div>
          <motion.button style={styles.headerIconBtn} whileHover={{ scale: 1.1 }}>
            <Settings size={16} color="#64748b" />
          </motion.button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────── */}
      <div style={styles.body}>

        {/* Video area */}
        <div style={{ ...styles.videoArea, width: sidePanelOpen ? "calc(100% - 340px)" : "100%" }}>

          {participants.length === 0 ? (
            /* ── Solo view ────────────────────────────────────── */
            <div style={styles.soloVideo}>
              <video
                ref={localVideoRef}
                autoPlay muted playsInline
                style={{ ...styles.videoEl, transform: "scaleX(-1)" }}
              />
              {!camOn && (
                <div style={styles.camOffOverlay}>
                  <div style={styles.camOffAvatar}>
                    {username[0]?.toUpperCase() || "?"}
                  </div>
                  <span style={styles.camOffName}>{username} (Camera Off)</span>
                </div>
              )}
              {screenSharing && (
                <div style={styles.screenShareBadge}>
                  <Monitor size={13} /> Sharing Screen
                </div>
              )}
              <div style={styles.videoLabel}>
                <span>{username} (You)</span>
                {!micOn && <MicOff size={12} color="#f87171" />}
                {handRaised && <span>✋</span>}
              </div>

              {/* Waiting card — hides after code is copied */}
              {!codeCopied && (
                <motion.div
                  style={styles.waitingCard}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div style={styles.waitingIcon}><Users size={28} color="#818cf8" /></div>
                  <div style={styles.waitingTitle}>Waiting for others to join...</div>
                  <div style={styles.waitingCode}>
                    Share this code:{" "}
                    <strong style={{ color: "#818cf8" }}>{url}</strong>
                  </div>
                  <motion.button
                    style={styles.copyCodeBtn}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={copyMeetingId}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy Meeting ID"}
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            /* ── Multi-participant grid ────────────────────────── */
            <div style={{
              ...styles.multiGrid,
              gridTemplateColumns:
                participants.length === 1
                  ? "repeat(2, 1fr)"         // 2 cells side by side
                  : participants.length <= 3
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
            }}>

              {/* Your tile — always first */}
              <div style={styles.gridCell}>
                <video
                  ref={localVideoRef}
                  autoPlay muted playsInline
                  style={{ ...styles.videoEl, transform: "scaleX(-1)" }}
                />
                {!camOn && (
                  <div style={styles.camOffOverlay}>
                    <div style={styles.camOffAvatar}>
                      {username[0]?.toUpperCase() || "?"}
                    </div>
                  </div>
                )}
                <div style={styles.videoLabel}>
                  <span>{username} (You)</span>
                  {!micOn && <MicOff size={12} color="#f87171" />}
                  {handRaised && <span>✋</span>}
                </div>
              </div>

              {/* Remote participant tiles */}
              {participants.map((p, i) => (
                <motion.div
                  key={p.id}
                  style={styles.gridCell}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <video
                    ref={el => {
                      videoRefs.current[p.id] = el;
                      if (el && p.stream) el.srcObject = p.stream;
                    }}
                    autoPlay playsInline
                    style={styles.videoEl}
                  />
                  {/* Show avatar while stream is connecting */}
                  {!p.stream && (
                    <div style={styles.camOffOverlay}>
                      <div style={{
                        ...styles.camOffAvatar,
                        background: pColors[i % pColors.length],
                      }}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span style={styles.camOffName}>Connecting...</span>
                    </div>
                  )}
                  <div style={styles.videoLabel}>
                    <span>Participant {i + 1}</span>
                    {remoteMedia[p.id]?.mic === false && (
                      <MicOff size={12} color="#f87171" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* ── Side panel ─────────────────────────────────────────── */}
        <AnimatePresence>
          {sidePanelOpen && (
            <motion.div
              style={styles.sidePanel}
              initial={{ x: 340, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 340, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Tabs */}
              <div style={styles.panelTabs}>
                <button
                  style={{ ...styles.panelTab, ...(chatOpen ? styles.panelTabActive : {}) }}
                  onClick={() => { setChatOpen(true); setParticipantsOpen(false); }}
                >
                  <MessageSquare size={15} /> Chat
                  {messages.length > 0 && (
                    <span style={styles.msgCount}>{messages.length}</span>
                  )}
                </button>
                <button
                  style={{ ...styles.panelTab, ...(participantsOpen ? styles.panelTabActive : {}) }}
                  onClick={() => { setParticipantsOpen(true); setChatOpen(false); }}
                >
                  {/* FIX: participants.length + 1 includes yourself */}
                  <Users size={15} /> People ({participants.length + 1})
                </button>
                <motion.button
                  style={styles.panelClose}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setChatOpen(false); setParticipantsOpen(false); }}
                >
                  <X size={16} color="#64748b" />
                </motion.button>
              </div>

              {/* Chat */}
              {chatOpen && (
                <div style={styles.chatPanel}>
                  <div style={styles.chatMessages}>
                    {messages.length === 0 ? (
                      <div style={styles.chatEmpty}>
                        <MessageSquare size={28} color="#1e293b" />
                        <span>No messages yet. Say hello! 👋</span>
                      </div>
                    ) : (
                      messages.map(msg => (
                        <motion.div
                          key={msg.id}
                          style={{ ...styles.msgRow, ...(msg.self ? styles.msgRowSelf : {}) }}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {!msg.self && (
                            <div style={styles.msgAvatar}>
                              {msg.sender?.[0]?.toUpperCase() || "?"}
                            </div>
                          )}
                          <div style={styles.msgContent}>
                            {!msg.self && (
                              <div style={styles.msgSender}>{msg.sender}</div>
                            )}
                            <div style={{
                              ...styles.msgBubble,
                              ...(msg.self ? styles.msgBubbleSelf : {}),
                            }}>
                              {msg.text}
                            </div>
                            <div style={{
                              ...styles.msgTime,
                              ...(msg.self ? { textAlign: "right" } : {}),
                            }}>
                              {msg.time}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div style={styles.chatInputRow}>
                    <motion.button style={styles.emojiBtn} whileHover={{ scale: 1.1 }}>
                      <Smile size={18} color="#475569" />
                    </motion.button>
                    <input
                      style={styles.chatInput}
                      placeholder="Type a message..."
                      value={chatMsg}
                      onChange={e => setChatMsg(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && sendChat()}
                    />
                    <motion.button
                      style={{
                        ...styles.sendBtn,
                        ...(chatMsg.trim() ? styles.sendBtnActive : {}),
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={sendChat}
                    >
                      <Send size={15} />
                    </motion.button>
                  </div>
                </div>
              )}

              {/* Participants */}
              {participantsOpen && (
                <div style={styles.participantsPanel}>
                  <div style={styles.participantsList}>

                    {/* You */}
                    <div style={styles.participantItem}>
                      <div style={{
                        ...styles.pAvatar,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      }}>
                        {username[0]?.toUpperCase() || "?"}
                      </div>
                      <div style={styles.pInfo}>
                        {/* FIX: show real username not hardcoded "You (Host)" */}
                        <div style={styles.pName}>{username} (You)</div>
                        <div style={styles.pStatus}>● In meeting</div>
                      </div>
                      <div style={styles.pIcons}>
                        {micOn
                          ? <Mic size={14} color="#34d399" />
                          : <MicOff size={14} color="#f87171" />}
                        {camOn
                          ? <Video size={14} color="#34d399" />
                          : <VideoOff size={14} color="#f87171" />}
                      </div>
                    </div>

                    {/* FIX: participants is [{id, stream}] — iterate p.id not id */}
                    {participants.map((p, i) => (
                      <motion.div
                        key={p.id}
                        style={styles.participantItem}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div style={{
                          ...styles.pAvatar,
                          background: pColors[i % pColors.length],
                        }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <div style={styles.pInfo}>
                          <div style={styles.pName}>Participant {i + 1}</div>
                          <div style={styles.pStatus}>● In meeting</div>
                        </div>
                        <div style={styles.pIcons}>
                          {remoteMedia[p.id]?.mic === false
                            ? <MicOff size={14} color="#f87171" />
                            : <Mic size={14} color="#34d399" />}
                          {remoteMedia[p.id]?.cam === false
                            ? <VideoOff size={14} color="#f87171" />
                            : <Video size={14} color="#34d399" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Control bar ────────────────────────────────────────── */}
      <div style={styles.controlBar}>
        <div style={styles.controls}>

          <div style={styles.ctrlGroup}>
            <motion.button
              style={{ ...styles.ctrlBtn, ...(!micOn ? styles.ctrlBtnOff : {}) }}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
              onClick={toggleMic}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </motion.button>
            <span style={styles.ctrlLabel}>{micOn ? "Mute" : "Unmute"}</span>
          </div>

          <div style={styles.ctrlGroup}>
            <motion.button
              style={{ ...styles.ctrlBtn, ...(!camOn ? styles.ctrlBtnOff : {}) }}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
              onClick={toggleCam}
            >
              {camOn ? <Video size={20} /> : <VideoOff size={20} />}
            </motion.button>
            <span style={styles.ctrlLabel}>{camOn ? "Stop Video" : "Start Video"}</span>
          </div>

          <div style={styles.ctrlGroup}>
            <motion.button
              style={{ ...styles.ctrlBtn, ...(screenSharing ? styles.ctrlBtnActive : {}) }}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
              onClick={toggleScreen}
            >
              <Monitor size={20} />
            </motion.button>
            <span style={styles.ctrlLabel}>{screenSharing ? "Stop Share" : "Share"}</span>
          </div>

          <div style={styles.ctrlGroup}>
            <motion.button
              style={{ ...styles.ctrlBtn, ...(chatOpen ? styles.ctrlBtnActive : {}) }}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
              onClick={() => { setChatOpen(v => !v); setParticipantsOpen(false); }}
            >
              <MessageSquare size={20} />
              {messages.length > 0 && !chatOpen && (
                <span style={styles.badge}>{messages.length}</span>
              )}
            </motion.button>
            <span style={styles.ctrlLabel}>Chat</span>
          </div>

          <div style={styles.ctrlGroup}>
            <motion.button
              style={{ ...styles.ctrlBtn, ...(participantsOpen ? styles.ctrlBtnActive : {}) }}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
              onClick={() => { setParticipantsOpen(v => !v); setChatOpen(false); }}
            >
              <Users size={20} />
              {participants.length > 0 && (
                <span style={styles.badge}>{participants.length + 1}</span>
              )}
            </motion.button>
            <span style={styles.ctrlLabel}>People</span>
          </div>

          <div style={styles.ctrlGroup}>
            <motion.button
              style={{ ...styles.ctrlBtn, ...(handRaised ? styles.ctrlBtnActive : {}) }}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
              onClick={() => {
                setHandRaised(v => !v);
                if (!handRaised) showToast("Hand raised ✋");
              }}
            >
              <Hand size={20} />
            </motion.button>
            <span style={styles.ctrlLabel}>Raise Hand</span>
          </div>

          <div style={styles.ctrlGroup}>
            <motion.button
              style={styles.ctrlBtn}
              whileHover={{ scale: 1.08, y: -2 }} whileTap={{ scale: 0.93 }}
            >
              <MoreVertical size={20} />
            </motion.button>
            <span style={styles.ctrlLabel}>More</span>
          </div>

          <div style={styles.ctrlDivider} />

          <div style={styles.ctrlGroup}>
            <motion.button
              style={styles.endBtn}
              whileHover={{ scale: 1.08, y: -2, boxShadow: "0 0 30px rgba(239,68,68,0.5)" }}
              whileTap={{ scale: 0.93 }}
              onClick={endCall}
            >
              <PhoneOff size={20} />
            </motion.button>
            <span style={{ ...styles.ctrlLabel, color: "#f87171" }}>End Call</span>
          </div>

        </div>
      </div>

      {/* ── Toast ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            style={styles.toast}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Constants ──────────────────────────────────────────────────────
const pColors = ["#6366f1", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981", "#f43f5e"];

// ─── Styles ─────────────────────────────────────────────────────────
const styles = {
  root: {
    height: "100vh", background: "#060810",
    color: "#f1f5f9", fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 24px", height: 56,
    background: "rgba(8,11,20,0.9)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(99,102,241,0.1)",
    flexShrink: 0, zIndex: 30,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 8 },
  logoMini: {
    width: 28, height: 28, borderRadius: 8,
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 16, fontWeight: 700, color: "#f1f5f9" },
  headerCenter: { display: "flex", alignItems: "center" },
  timerBadge: {
    display: "flex", alignItems: "center", gap: 7,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 8, padding: "5px 12px",
    fontSize: 13, fontWeight: 600, color: "#818cf8",
    fontVariantNumeric: "tabular-nums",
  },
  liveDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#f87171", boxShadow: "0 0 6px #f87171", display: "inline-block",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  meetIdRow: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8, padding: "5px 10px",
  },
  meetIdLabel: { fontSize: 11, color: "#475569" },
  meetIdValue: { fontSize: 12, fontWeight: 600, color: "#94a3b8", letterSpacing: 0.5 },
  copyBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 2, display: "flex", alignItems: "center",
  },
  headerIconBtn: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8, padding: 6, cursor: "pointer", display: "flex", alignItems: "center",
  },
  body: { flex: 1, display: "flex", overflow: "hidden" },
  videoArea: {
    flex: 1, display: "flex", flexDirection: "column",
    gap: 12, padding: 16, overflow: "hidden",
    transition: "width 0.3s",
  },

  // Solo view (only you in the room)
  soloVideo: {
    flex: 1, borderRadius: 16, overflow: "hidden",
    background: "#0d1120", position: "relative",   // FIX: position:relative for waitingCard
    border: "1px solid rgba(99,102,241,0.12)",
  },

  // Multi-participant grid
  multiGrid: {
    flex: 1, display: "grid", gap: 12,
    gridAutoRows: "1fr",                           // equal height rows
    overflow: "hidden",
  },
  gridCell: {
    borderRadius: 16, overflow: "hidden",
    background: "#0d1120", position: "relative",
    border: "1px solid rgba(99,102,241,0.12)",
    minHeight: 180,
  },

  videoEl: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  camOffOverlay: {
    position: "absolute", inset: 0, background: "#0d1120",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: 10,
  },
  camOffAvatar: {
    width: 72, height: 72, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 28, fontWeight: 700, color: "#fff",
  },
  camOffName: { fontSize: 13, color: "#475569" },
  screenShareBadge: {
    position: "absolute", top: 12, left: 12,
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(99,102,241,0.8)", borderRadius: 8,
    padding: "5px 10px", fontSize: 12, fontWeight: 600, color: "#fff",
  },
  videoLabel: {
    position: "absolute", bottom: 10, left: 12,
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
    borderRadius: 7, padding: "4px 10px",
    fontSize: 12, fontWeight: 600, color: "#f1f5f9",
  },
  waitingCard: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%,-50%)",
    background: "rgba(13,17,35,0.92)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20,
    padding: "36px 48px", textAlign: "center",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
    zIndex: 10,
  },
  waitingIcon: {
    width: 60, height: 60, borderRadius: 14,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  waitingTitle: { fontSize: 15, fontWeight: 700, color: "#94a3b8" },
  waitingCode: { fontSize: 13, color: "#475569" },
  copyCodeBtn: {
    display: "flex", alignItems: "center", gap: 6,
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
    color: "#818cf8", borderRadius: 10, padding: "9px 18px",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  // Side panel
  sidePanel: {
    width: 340, background: "rgba(10,13,28,0.97)",
    borderLeft: "1px solid rgba(99,102,241,0.1)",
    display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden",
  },
  panelTabs: {
    display: "flex", alignItems: "center",
    borderBottom: "1px solid rgba(99,102,241,0.1)", padding: "0 8px",
  },
  panelTab: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "14px", background: "none", border: "none",
    color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer",
    borderBottom: "2px solid transparent", transition: "all 0.2s",
  },
  panelTabActive: { color: "#818cf8", borderBottomColor: "#818cf8" },
  msgCount: {
    background: "#6366f1", color: "#fff", fontSize: 10, fontWeight: 700,
    borderRadius: 100, padding: "1px 6px",
  },
  panelClose: {
    marginLeft: "auto", background: "none", border: "none",
    cursor: "pointer", padding: 8, display: "flex", alignItems: "center",
  },

  // Chat
  chatPanel: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  chatMessages: {
    flex: 1, overflowY: "auto", padding: 16,
    display: "flex", flexDirection: "column", gap: 12,
  },
  chatEmpty: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 10, color: "#334155", fontSize: 13, paddingTop: 60,
  },
  msgRow: { display: "flex", gap: 8, alignItems: "flex-end" },
  msgRowSelf: { flexDirection: "row-reverse" },
  msgAvatar: {
    width: 28, height: 28, borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  msgContent: { maxWidth: "75%", display: "flex", flexDirection: "column", gap: 3 },
  msgSender: { fontSize: 11, color: "#475569", paddingLeft: 4 },
  msgBubble: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px 14px 14px 4px",
    padding: "10px 14px", fontSize: 13, color: "#f1f5f9", lineHeight: 1.5,
  },
  msgBubbleSelf: {
    background: "rgba(99,102,241,0.2)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "14px 14px 4px 14px",
  },
  msgTime: { fontSize: 10, color: "#334155", paddingLeft: 4 },
  chatInputRow: {
    display: "flex", alignItems: "center", gap: 8, padding: "12px 14px",
    borderTop: "1px solid rgba(99,102,241,0.1)",
  },
  emojiBtn: {
    background: "none", border: "none", cursor: "pointer",
    padding: 4, display: "flex", alignItems: "center",
  },
  chatInput: {
    flex: 1, background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "9px 12px",
    color: "#f1f5f9", fontSize: 13, outline: "none",
  },
  sendBtn: {
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
    borderRadius: 10, padding: "9px 10px", cursor: "pointer",
    color: "#475569", display: "flex", alignItems: "center", transition: "all 0.2s",
  },
  sendBtnActive: {
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    border: "none", color: "#fff",
  },

  // Participants panel
  participantsPanel: { flex: 1, overflowY: "auto", padding: 16 },
  participantsList: { display: "flex", flexDirection: "column", gap: 6 },
  participantItem: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "10px 12px", borderRadius: 12,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(99,102,241,0.08)",
  },
  pAvatar: {
    width: 36, height: 36, borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0,
  },
  pInfo: { flex: 1 },
  pName: { fontSize: 13, fontWeight: 600, color: "#94a3b8" },
  pStatus: { fontSize: 11, color: "#22c55e", marginTop: 2 },
  pIcons: { display: "flex", gap: 6 },

  // Control bar
  controlBar: {
    flexShrink: 0, padding: "14px 24px",
    background: "rgba(6,8,16,0.95)", backdropFilter: "blur(12px)",
    borderTop: "1px solid rgba(99,102,241,0.1)", zIndex: 30,
  },
  controls: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: 8, flexWrap: "wrap",
  },
  ctrlGroup: { display: "flex", flexDirection: "column", alignItems: "center", gap: 5 },
  ctrlBtn: {
    width: 48, height: 48, borderRadius: 14,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#f1f5f9", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s", position: "relative",
  },
  ctrlBtnOff: {
    background: "rgba(239,68,68,0.15)",
    border: "1px solid rgba(239,68,68,0.3)", color: "#f87171",
  },
  ctrlBtnActive: {
    background: "rgba(99,102,241,0.2)",
    border: "1px solid rgba(99,102,241,0.4)", color: "#818cf8",
  },
  ctrlLabel: { fontSize: 10, color: "#334155", fontWeight: 500, whiteSpace: "nowrap" },
  badge: {
    position: "absolute", top: -5, right: -5,
    background: "#6366f1", color: "#fff",
    fontSize: 9, fontWeight: 700, borderRadius: "50%",
    width: 16, height: 16, display: "flex",
    alignItems: "center", justifyContent: "center",
    border: "1.5px solid #060810",
  },
  ctrlDivider: {
    width: 1, height: 40, background: "rgba(255,255,255,0.07)", margin: "0 4px",
  },
  endBtn: {
    width: 52, height: 48, borderRadius: 14,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    border: "none", color: "#fff", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 20px rgba(239,68,68,0.3)",
  },
  toast: {
    position: "fixed", bottom: 100, left: "50%", transform: "translateX(-50%)",
    background: "rgba(13,17,35,0.95)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(99,102,241,0.2)", borderRadius: 12,
    padding: "10px 18px", fontSize: 13, fontWeight: 500, color: "#94a3b8",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 100, whiteSpace: "nowrap",
  },
};