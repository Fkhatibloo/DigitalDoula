import { useState, useEffect, useRef, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&display=swap');`;

const UNSPLASH = [
  "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?w=1200&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=1200&q=80",
  "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&q=80",
];

const TONES = [
  { value: "warm", label: "Warm & Loving", emoji: "🧡" },
  { value: "nostalgic", label: "Nostalgic & Tender", emoji: "🌿" },
  { value: "celebratory", label: "Joyful & Celebratory", emoji: "✨" },
  { value: "reflective", label: "Quiet & Reflective", emoji: "🌙" },
];

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Jost', sans-serif; background: #FAF7F2; }
  .display { font-family: 'Cormorant Garamond', Georgia, serif; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes kenBurns {
    from { transform: scale(1) translate(0,0); }
    to { transform: scale(1.08) translate(-2%,-1%); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .fade-up { animation: fadeUp 0.7s ease-out both; }
  .kb { animation: kenBurns 9s ease-in-out infinite alternate; }
  .spin { animation: spin 1.2s linear infinite; }
  input, textarea {
    background: #F5EFE6;
    border: 1px solid #E8C4B8;
    border-radius: 12px;
    padding: 12px 16px;
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    font-size: 0.95rem;
    color: #2C2C2C;
    width: 100%;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, textarea:focus { border-color: #C17B5A; }
  textarea { resize: none; line-height: 1.7; }
  button { cursor: pointer; border: none; transition: all 0.2s ease; }
  button:hover { filter: brightness(0.95); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #F5EFE6; }
  ::-webkit-scrollbar-thumb { background: #E8C4B8; border-radius: 2px; }
`;

// ──────────────────────────────────────────────
// LANDING PAGE
// ──────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F2", position: "relative", overflow: "hidden" }}>
      {/* Decorative blobs */}
      <div style={{ position: "absolute", top: "-120px", right: "-100px", width: "420px", height: "420px", borderRadius: "50%", background: "radial-gradient(circle, rgba(232,196,184,0.35), transparent)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-100px", left: "-80px", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle, rgba(125,155,118,0.2), transparent)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "760px", margin: "0 auto", padding: "0 24px" }}>
        {/* Nav */}
        <nav style={{ padding: "28px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span className="display" style={{ fontSize: "1.3rem", fontWeight: 400, color: "#2C2C2C" }}>🌸 Digital Doula</span>
          <button onClick={onStart}
            style={{ padding: "10px 24px", borderRadius: "24px", background: "#C17B5A", color: "white", fontFamily: "Jost", fontWeight: 400, fontSize: "0.9rem", letterSpacing: "0.03em" }}>
            Begin →
          </button>
        </nav>

        {/* Hero */}
        <div className="fade-up" style={{ textAlign: "center", paddingTop: "60px", paddingBottom: "80px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", borderRadius: "24px", background: "#F5EFE6", border: "1px solid #E8C4B8", marginBottom: "36px" }}>
            <span>🌸</span>
            <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.85rem", color: "#C17B5A", letterSpacing: "0.12em", textTransform: "uppercase" }}>A gift only you can give</span>
          </div>

          <h1 className="display" style={{ fontSize: "clamp(3rem, 9vw, 5.5rem)", fontWeight: 300, lineHeight: 1.08, color: "#2C2C2C", marginBottom: "28px" }}>
            Tell the story<br />
            <em style={{ color: "#C17B5A" }}>they deserve to hear</em>
          </h1>

          <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "1.1rem", lineHeight: 1.8, color: "#6B6560", maxWidth: "520px", margin: "0 auto 48px" }}>
            Select your most cherished photos and videos. Let AI help you weave them into a beautiful,
            heartfelt story — a lasting keepsake for the people who matter most.
          </p>

          <button onClick={onStart}
            style={{ padding: "16px 40px", borderRadius: "32px", background: "#C17B5A", color: "white", fontFamily: "Jost", fontWeight: 400, fontSize: "1rem", letterSpacing: "0.04em", boxShadow: "0 8px 32px rgba(193,123,90,0.3)" }}>
            Begin your story →
          </button>
        </div>

        {/* Steps */}
        <div style={{ background: "#F5EFE6", borderRadius: "24px", padding: "48px 40px", marginBottom: "60px" }}>
          <h2 className="display" style={{ fontSize: "2rem", fontWeight: 400, color: "#2C2C2C", textAlign: "center", marginBottom: "48px" }}>How it works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "36px" }}>
            {[
              { n: "01", t: "Choose your memories", d: "Select 25–50 photos and videos from your camera roll that tell your story." },
              { n: "02", t: "Shape the narrative", d: "Tell us who this is for. AI crafts the words to match your heart." },
              { n: "03", t: "Share with love", d: "Send a private link, download a keepsake PDF, or export a video." },
            ].map(s => (
              <div key={s.n}>
                <div className="display" style={{ fontSize: "2.8rem", fontWeight: 300, color: "#E8C4B8", marginBottom: "12px" }}>{s.n}</div>
                <h3 className="display" style={{ fontSize: "1.25rem", fontWeight: 400, color: "#2C2C2C", marginBottom: "10px" }}>{s.t}</h3>
                <p style={{ fontFamily: "Jost", fontWeight: 300, color: "#6B6560", lineHeight: 1.7, fontSize: "0.9rem" }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>

        <footer style={{ textAlign: "center", paddingBottom: "40px", fontFamily: "Jost", fontWeight: 300, fontSize: "0.85rem", color: "#9B9590" }}>
          🌸 Digital Doula — Made with tenderness
        </footer>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// UPLOAD STEP
// ──────────────────────────────────────────────
function UploadStep({ onNext }) {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((e) => {
    const newFiles = Array.from(e.target.files || []).map(f => ({
      file: f, preview: URL.createObjectURL(f),
      type: f.type.startsWith("video") ? "video" : "image"
    }));
    setFiles(prev => [...prev, ...newFiles].slice(0, 50));
  }, []);

  const remove = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  return (
    <div className="fade-up" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 className="display" style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 300, color: "#2C2C2C", marginBottom: "12px" }}>
        Choose your memories
      </h1>
      <p style={{ fontFamily: "Jost", fontWeight: 300, color: "#6B6560", fontSize: "1.05rem", marginBottom: "36px" }}>
        Select 25–50 photos and videos.
        <span style={{ marginLeft: "8px", color: "#C17B5A", fontWeight: 400 }}>{files.length}/50 selected</span>
      </p>

      {/* Drop zone */}
      <div onClick={() => fileInputRef.current?.click()}
        style={{ border: "2px dashed #E8C4B8", borderRadius: "20px", padding: "48px 24px", textAlign: "center", background: "#F5EFE6", cursor: "pointer", marginBottom: "28px", transition: "border-color 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#C17B5A"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#E8C4B8"}>
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>📷</div>
        <p className="display" style={{ fontSize: "1.4rem", fontWeight: 400, marginBottom: "6px" }}>
          Tap to select from your camera roll
        </p>
        <p style={{ fontFamily: "Jost", fontWeight: 300, color: "#9B9590", fontSize: "0.85rem" }}>
          Photos & videos · Up to 50 files · iPhone optimized
        </p>
        <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" className="hidden" style={{ display: "none" }} onChange={handleFiles} />
      </div>

      {/* Grid */}
      {files.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: "8px", marginBottom: "28px" }}>
          {files.map((m, i) => (
            <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "10px", overflow: "hidden" }}
              onMouseEnter={e => e.currentTarget.querySelector(".rm-btn").style.opacity = "1"}
              onMouseLeave={e => e.currentTarget.querySelector(".rm-btn").style.opacity = "0"}>
              {m.type === "image"
                ? <img src={m.preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <video src={m.preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              {m.type === "video" && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)" }}><span style={{ color: "white", fontSize: "1.1rem" }}>▶</span></div>}
              <button className="rm-btn" onClick={(e) => { e.stopPropagation(); remove(i); }}
                style={{ position: "absolute", top: "4px", right: "4px", width: "20px", height: "20px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "white", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.15s" }}>
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "Jost", fontWeight: 300, color: "#9B9590", fontSize: "0.85rem" }}>
          {files.length < 1 ? "Select at least 1 photo to continue" : `✓ ${files.length} selected — ready to continue`}
        </p>
        <button onClick={() => onNext(files)}
          disabled={files.length < 1}
          style={{ padding: "12px 32px", borderRadius: "24px", background: files.length < 1 ? "#ccc" : "#C17B5A", color: "white", fontFamily: "Jost", fontWeight: 400, fontSize: "0.95rem" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// CONFIGURE STEP
// ──────────────────────────────────────────────
function ConfigureStep({ onBack, onGenerate }) {
  const [cfg, setCfg] = useState({ recipientName: "", recipientRelationship: "", storyTone: "warm", authorName: "", personalNote: "" });

  return (
    <div className="fade-up" style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}>
      <button onClick={onBack} style={{ background: "none", color: "#9B9590", fontFamily: "Jost", fontWeight: 300, fontSize: "0.9rem", marginBottom: "32px", display: "flex", alignItems: "center", gap: "6px" }}>
        ← Back
      </button>

      <h1 className="display" style={{ fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 300, color: "#2C2C2C", marginBottom: "12px" }}>
        Shape your story
      </h1>
      <p style={{ fontFamily: "Jost", fontWeight: 300, color: "#6B6560", fontSize: "1.05rem", marginBottom: "36px" }}>
        Tell us about the person you're creating this for.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "Jost", fontWeight: 400, fontSize: "0.9rem", color: "#2C2C2C" }}>This story is for *</label>
          <input placeholder="e.g. Sarah, Mom, my daughter" value={cfg.recipientName} onChange={e => setCfg({...cfg, recipientName: e.target.value})} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "Jost", fontWeight: 400, fontSize: "0.9rem", color: "#2C2C2C" }}>Your relationship to them</label>
          <input placeholder="e.g. my daughter, my best friend, my mother" value={cfg.recipientRelationship} onChange={e => setCfg({...cfg, recipientRelationship: e.target.value})} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "12px", fontFamily: "Jost", fontWeight: 400, fontSize: "0.9rem", color: "#2C2C2C" }}>Story tone</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {TONES.map(t => (
              <button key={t.value} onClick={() => setCfg({...cfg, storyTone: t.value})}
                style={{ padding: "12px 16px", borderRadius: "12px", background: cfg.storyTone === t.value ? "#C17B5A" : "#F5EFE6", color: cfg.storyTone === t.value ? "white" : "#2C2C2C", border: `1px solid ${cfg.storyTone === t.value ? "#C17B5A" : "#E8C4B8"}`, fontFamily: "Jost", fontWeight: 300, fontSize: "0.88rem", textAlign: "left" }}>
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "Jost", fontWeight: 400, fontSize: "0.9rem", color: "#2C2C2C" }}>Your name (for the story)</label>
          <input placeholder="e.g. Mom, Grandma, Your best friend" value={cfg.authorName} onChange={e => setCfg({...cfg, authorName: e.target.value})} />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "8px", fontFamily: "Jost", fontWeight: 400, fontSize: "0.9rem", color: "#2C2C2C" }}>Anything else you want them to know</label>
          <textarea rows={4} placeholder="Share a memory, a feeling, something you've always wanted to say..." value={cfg.personalNote} onChange={e => setCfg({...cfg, personalNote: e.target.value})} />
        </div>

        <button onClick={() => onGenerate(cfg)}
          disabled={!cfg.recipientName}
          style={{ padding: "16px", borderRadius: "32px", background: !cfg.recipientName ? "#ccc" : "#C17B5A", color: "white", fontFamily: "Jost", fontWeight: 400, fontSize: "1rem", marginTop: "8px", boxShadow: cfg.recipientName ? "0 6px 24px rgba(193,123,90,0.3)" : "none" }}>
          Create my story ✨
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// GENERATING
// ──────────────────────────────────────────────
function Generating({ progress, message }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FAF7F2" }}>
      <div style={{ textAlign: "center", maxWidth: "380px", padding: "24px" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🌸</div>
        <h2 className="display" style={{ fontSize: "2.2rem", fontWeight: 400, color: "#2C2C2C", marginBottom: "12px" }}>Creating your story</h2>
        <p style={{ fontFamily: "Jost", fontWeight: 300, color: "#6B6560", marginBottom: "40px", minHeight: "24px" }}>{message}</p>
        <div style={{ width: "100%", height: "3px", background: "#F5EFE6", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#C17B5A", borderRadius: "2px", transition: "width 0.8s ease" }} />
        </div>
        <p style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8rem", color: "#9B9590", marginTop: "12px" }}>{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// STORY VIEWER
// ──────────────────────────────────────────────
function StoryViewer({ story, mediaFiles, onNew }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const imgs = mediaFiles.length > 0
    ? mediaFiles.slice(0, story.chapters.length).map(m => m.preview)
    : UNSPLASH.slice(0, story.chapters.length);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setActive(prev => {
          if (prev >= story.chapters.length - 1) { setPlaying(false); return prev; }
          return prev + 1;
        });
      }, 5500);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, story.chapters.length]);

  const chapter = story.chapters[active];

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#1a1a1a", overflow: "hidden" }}>
      {/* BG images */}
      {imgs.map((src, i) => (
        <div key={i} style={{ position: "absolute", inset: 0, opacity: i === active ? 1 : 0, transition: "opacity 1.4s ease" }}>
          <img src={src} alt="" className="kb" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.38)" }} />
        </div>
      ))}
      {/* Gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 45%, rgba(0,0,0,0.05) 100%)", pointerEvents: "none" }} />

      {/* Header */}
      <header style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px" }}>
        <button onClick={onNew} style={{ background: "none", color: "rgba(255,255,255,0.55)", fontFamily: "Jost", fontWeight: 300, fontSize: "0.9rem" }}>
          🌸 Digital Doula
        </button>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setShowShare(true)}
            style={{ padding: "8px 18px", borderRadius: "20px", background: "rgba(255,255,255,0.12)", color: "white", fontFamily: "Jost", fontWeight: 300, fontSize: "0.85rem", backdropFilter: "blur(8px)" }}>
            Share ↗
          </button>
          <button
            style={{ padding: "8px 18px", borderRadius: "20px", background: "#C17B5A", color: "white", fontFamily: "Jost", fontWeight: 300, fontSize: "0.85rem" }}>
            Export PDF
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "calc(100vh - 80px)", padding: "24px 24px 40px", maxWidth: "680px" }}>
        {/* Chapter dots */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {story.chapters.map((_, i) => (
            <button key={i} onClick={() => setActive(i)}
              style={{ height: "2px", borderRadius: "1px", background: i === active ? "white" : "rgba(255,255,255,0.3)", width: i === active ? "36px" : "14px", transition: "all 0.4s ease" }} />
          ))}
        </div>

        <p key={`label-${active}`} style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "10px", animation: "fadeUp 0.6s ease both" }}>
          {chapter.title}
        </p>
        <h2 key={`title-${active}`} className="display" style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 300, color: "white", marginBottom: "20px", lineHeight: 1.2, animation: "fadeUp 0.7s ease both" }}>
          {story.title}
        </h2>
        <p key={`narr-${active}`} style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "1rem", color: "rgba(255,255,255,0.82)", lineHeight: 1.85, maxWidth: "560px", animation: "fadeUp 0.8s ease both" }}>
          {chapter.narration}
        </p>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "32px" }}>
          <button onClick={() => setPlaying(p => !p)}
            style={{ width: "48px", height: "48px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", boxShadow: "0 4px 16px rgba(0,0,0,0.3)", color: "#2C2C2C" }}>
            {playing ? "⏸" : "▶"}
          </button>
          <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", opacity: active === 0 ? 0.3 : 1 }}>
            ←
          </button>
          <button onClick={() => setActive(Math.min(story.chapters.length - 1, active + 1))} disabled={active === story.chapters.length - 1}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", opacity: active === story.chapters.length - 1 ? 0.3 : 1 }}>
            →
          </button>
          <span style={{ fontFamily: "Jost", fontWeight: 300, fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
            {active + 1} / {story.chapters.length}
          </span>
        </div>
      </div>

      {/* Share modal */}
      {showShare && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
          onClick={() => setShowShare(false)}>
          <div style={{ width: "100%", maxWidth: "420px", background: "#FAF7F2", borderRadius: "20px", padding: "32px" }}
            onClick={e => e.stopPropagation()}>
            <h3 className="display" style={{ fontSize: "1.8rem", fontWeight: 400, color: "#2C2C2C", marginBottom: "8px" }}>Share this story</h3>
            <p style={{ fontFamily: "Jost", fontWeight: 300, color: "#6B6560", marginBottom: "20px", fontSize: "0.9rem" }}>Anyone with this link can view your story.</p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              <input readOnly value="https://digital-doula.vercel.app/shared/abc123xyz" style={{ flex: 1, fontSize: "0.8rem" }} />
              <button onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ padding: "12px 16px", borderRadius: "12px", background: "#C17B5A", color: "white", fontFamily: "Jost", fontWeight: 400, fontSize: "0.85rem", flexShrink: 0 }}>
                {copied ? "✓" : "Copy"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
              {["📧 Email", "💬 iMessage", "📱 WhatsApp"].map(s => (
                <button key={s} style={{ padding: "10px 8px", borderRadius: "10px", background: "#F5EFE6", fontFamily: "Jost", fontWeight: 300, fontSize: "0.8rem", color: "#2C2C2C" }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// MAIN APP
// ──────────────────────────────────────────────
const PROGRESS_MSGS = [
  "Gathering your memories...",
  "Reading the light in each photo...",
  "Weaving your story together...",
  "Crafting the perfect words...",
  "Adding the finishing touches...",
];

const DEMO_STORY = {
  title: "Everything You Mean to Me",
  chapters: [
    { title: "Where it all began", narration: "There is a moment I return to often — a quiet Tuesday in October, when the world was still and something new had entered it. You. I remember holding you for the first time, the impossible lightness of you, the warmth. I thought: here is a person who will change everything. I was right." },
    { title: "The years of small miracles", narration: "Every parent will tell you: the years go fast. But they don't quite prepare you for how much weight each moment carries. Your first steps. The way you laughed at everything — belly laughs that seemed too big for your small body. How you'd fall asleep so easily, so trusting, so certain that the world was safe." },
    { title: "The person you've become", narration: "Somewhere along the way, you became yourself. Not the child I imagined, but something far more interesting — a whole person with your own questions, your own laughter, your own way of seeing the world. I watch you now and I am in awe. I hope you know that." },
    { title: "What I want you to carry", narration: "If there is one thing I want you to know — to really know, in your bones — it is this: you were loved before you knew what love was. You are loved now, in all your complexity. And whatever comes, that love is the one constant. It was always there. It always will be." },
  ],
};

export default function App() {
  const [view, setView] = useState("landing"); // landing | upload | configure | generating | story
  const [mediaFiles, setMediaFiles] = useState([]);
  const [story, setStory] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState(PROGRESS_MSGS[0]);

  const handleGenerate = async (cfg) => {
    setView("generating");
    setProgress(0);
    setProgressMsg(PROGRESS_MSGS[0]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setProgress((step / PROGRESS_MSGS.length) * 90);
      setProgressMsg(PROGRESS_MSGS[Math.min(step, PROGRESS_MSGS.length - 1)]);
      if (step >= PROGRESS_MSGS.length) clearInterval(interval);
    }, 1600);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Create a 4-chapter multimedia story for ${cfg.recipientName || "a loved one"} (${cfg.recipientRelationship || "someone special"}) from ${cfg.authorName || "someone who loves them"}. Tone: ${cfg.storyTone}. ${cfg.personalNote ? `Author's note: "${cfg.personalNote}"` : ""}
            
Respond ONLY as valid JSON:
{
  "title": "story title",
  "chapters": [
    { "title": "chapter title", "narration": "3-4 sentence passage, first-person to recipient" },
    { "title": "chapter title", "narration": "3-4 sentence passage" },
    { "title": "chapter title", "narration": "3-4 sentence passage" },
    { "title": "chapter title", "narration": "3-4 sentence passage" }
  ]
}`
          }]
        })
      });

      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => { setStory(parsed); setView("story"); }, 700);
    } catch {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => { setStory(DEMO_STORY); setView("story"); }, 700);
    }
  };

  return (
    <>
      <style>{FONTS}{css}</style>

      {/* Header for create flow */}
      {(view === "upload" || view === "configure") && (
        <header style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F5EFE6", background: "#FAF7F2", position: "sticky", top: 0, zIndex: 20 }}>
          <button onClick={() => setView("landing")} style={{ background: "none", fontFamily: "Cormorant Garamond", fontSize: "1.2rem", fontWeight: 400, color: "#2C2C2C" }}>
            🌸 Digital Doula
          </button>
          <div style={{ display: "flex", gap: "6px", fontSize: "0.8rem", fontFamily: "Jost", fontWeight: 300, color: "#9B9590" }}>
            <span style={{ color: view === "upload" ? "#C17B5A" : undefined }}>1. Choose photos</span>
            <span>—</span>
            <span style={{ color: view === "configure" ? "#C17B5A" : undefined }}>2. Shape story</span>
          </div>
        </header>
      )}

      {view === "landing" && <Landing onStart={() => setView("upload")} />}
      {view === "upload" && <UploadStep onNext={(files) => { setMediaFiles(files); setView("configure"); }} />}
      {view === "configure" && <ConfigureStep onBack={() => setView("upload")} onGenerate={handleGenerate} />}
      {view === "generating" && <Generating progress={progress} message={progressMsg} />}
      {view === "story" && story && <StoryViewer story={story} mediaFiles={mediaFiles} onNew={() => { setView("landing"); setStory(null); setMediaFiles([]); }} />}
    </>
  );
}
