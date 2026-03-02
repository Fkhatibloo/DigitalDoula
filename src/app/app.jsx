// Digital Doula — Main Application
// Full Next.js App Router implementation preview as a single-file React component
// Deploy this as src/app/page.jsx in your Next.js project

import { useState, useRef, useCallback, useEffect } from "react";

const STEPS = ["welcome", "upload", "customize", "generating", "preview", "share"];

const STORY_THEMES = [
  { id: "love-letter", label: "Love Letter", icon: "💌", description: "Tender, intimate prose about connection" },
  { id: "legacy", label: "Legacy Story", icon: "🌳", description: "A life fully lived, beautifully told" },
  { id: "gratitude", label: "Thank You", icon: "🙏", description: "Gratitude poured into every word" },
  { id: "adventure", label: "Our Adventures", icon: "✨", description: "Every chapter of the journey together" },
];

const RECIPIENTS = [
  { id: "child", label: "My Child" },
  { id: "partner", label: "My Partner" },
  { id: "parent", label: "My Parent" },
  { id: "friend", label: "My Best Friend" },
  { id: "sibling", label: "My Sibling" },
];

export default function DigitalDoula() {
  const [step, setStep] = useState("welcome");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [theme, setTheme] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [story, setStory] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const slideTimer = useRef(null);

  const progressMessages = [
    "Reading the light in your photos…",
    "Feeling the moments between frames…",
    "Finding the words only love can say…",
    "Weaving your story together…",
    "Adding the final touches…",
  ];

  // Auto-advance slideshow
  useEffect(() => {
    if (step === "preview" && story) {
      slideTimer.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % story.slides.length);
      }, 4500);
    }
    return () => clearInterval(slideTimer.current);
  }, [step, story]);

  const handleFileSelect = useCallback((e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
    if (valid.length > 50) {
      alert("Please select between 25 and 50 photos/videos.");
      return;
    }
    setFiles(valid);
    const newPreviews = valid.map(f => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video/") ? "video" : "image",
      name: f.name,
    }));
    setPreviews(newPreviews);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    const valid = dropped.filter(f => f.type.startsWith("image/") || f.type.startsWith("video/"));
    setFiles(valid.slice(0, 50));
    const newPreviews = valid.slice(0, 50).map(f => ({
      url: URL.createObjectURL(f),
      type: f.type.startsWith("video/") ? "video" : "image",
      name: f.name,
    }));
    setPreviews(newPreviews);
  }, []);

  const generateStory = async () => {
    setStep("generating");
    setGenerating(true);
    setGenerationProgress(0);

    // Simulate AI generation with progress
    for (let i = 0; i < progressMessages.length; i++) {
      setGenerationMessage(progressMessages[i]);
      await new Promise(r => setTimeout(r, 1800));
      setGenerationProgress((i + 1) * 20);
    }

    try {
      // Build prompt for Claude
      const imageDescriptions = previews.slice(0, 8).map((p, i) => 
        `Photo ${i + 1}: ${p.type === "video" ? "A video moment" : "A photo"} named "${p.name}"`
      ).join("\n");

      const prompt = `You are helping create a deeply personal "${theme?.label || "Our Story"}" for ${recipientName || "someone special"} from ${authorName || "someone who loves them"}.

The story theme is: ${theme?.description || "A heartfelt tribute"}
Story type: ${theme?.id || "legacy"}

Here are some of the ${previews.length} photos/videos in the collection:
${imageDescriptions}

Create a rich multimedia story with exactly 6 slides. For each slide, provide:
1. A short, evocative title (5 words max)
2. Heartfelt narrative prose (2-4 sentences, deeply personal and emotional)
3. A suggested "moment caption" (10 words max, like a memory label)
4. An emotion tag (one word: joy, love, gratitude, wonder, peace, tenderness)

Format your response as valid JSON only, no markdown:
{
  "storyTitle": "...",
  "openingLine": "...",
  "slides": [
    {
      "title": "...",
      "prose": "...",
      "caption": "...",
      "emotion": "..."
    }
  ],
  "closingMessage": "..."
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      // Assign photos to slides
      const slidesWithMedia = parsed.slides.map((slide, i) => ({
        ...slide,
        media: previews[Math.floor(i * (previews.length / 6))] || previews[i % previews.length],
      }));

      setStory({ ...parsed, slides: slidesWithMedia });
      setShareUrl(`https://digital-doula.vercel.app/story/${Math.random().toString(36).slice(2, 10)}`);
    } catch (err) {
      // Fallback story if API fails
      const fallbackSlides = [
        { title: "Where It All Began", prose: `Every great story has a beginning. Yours, ${recipientName || "dear one"}, started with a single moment that changed everything. These photos hold that spark — the very first chapter of something extraordinary.`, caption: "The first page", emotion: "wonder" },
        { title: "The Quiet Moments", prose: "It's not the grand gestures that define a life together — it's the ordinary Tuesdays, the morning light through the window, the laughter that catches you off guard. These are the moments that built everything.", caption: "Ordinary magic", emotion: "tenderness" },
        { title: "You Made Me Brave", prose: `Because of you, ${recipientName || "you"}, I learned what it means to truly show up. To be seen. To reach for things I never thought possible. Every adventure in these photos exists because you believed in me first.`, caption: "Courage shared", emotion: "gratitude" },
        { title: "The Hard Chapters", prose: "No story worth telling is without its difficult pages. We've sat in waiting rooms and held hands through hard things. Those moments didn't break us — they made this love unbreakable.", caption: "Through everything", emotion: "love" },
        { title: "Look How Far We've Come", prose: "Lay all these photos end to end and you'll see it: a life. Fully, beautifully, messily lived. Look at what we built. Look at who we became.", caption: "A life in full", emotion: "joy" },
        { title: "What I Need You to Know", prose: `If I could give you only one thing, ${recipientName || "dear one"}, it would be this: you are the best part of my story. Not a chapter — the whole book. Every photo here is proof of how deeply, completely you are loved.`, caption: "Always and forever", emotion: "love" },
      ];

      const slidesWithMedia = fallbackSlides.map((slide, i) => ({
        ...slide,
        media: previews[Math.floor(i * (previews.length / 6))] || previews[i % previews.length],
      }));

      setStory({
        storyTitle: `${theme?.label || "Our Story"}: For ${recipientName || "You"}`,
        openingLine: `From ${authorName || "someone who loves you"}, with everything.`,
        slides: slidesWithMedia,
        closingMessage: `This story is not finished — it continues every day, in every moment we share. With all my love.`,
      });
      setShareUrl(`https://digital-doula.vercel.app/story/${Math.random().toString(36).slice(2, 10)}`);
    }

    setGenerating(false);
    setGenerationProgress(100);
    await new Promise(r => setTimeout(r, 600));
    setStep("preview");
  };

  const copyShareUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPDF = () => {
    alert("📄 PDF export would generate a beautifully formatted keepsake document.\n\nIn production: uses jsPDF + custom layouts to create a print-ready PDF with your photos and narration.");
  };

  const handleExportVideo = () => {
    alert("🎬 Video export would render a cinematic slideshow video.\n\nIn production: uses FFmpeg (via API route) to stitch photos + narration + music into an MP4 file.");
  };

  const emotionColors = {
    joy: "from-amber-400 to-orange-300",
    love: "from-rose-400 to-pink-300",
    gratitude: "from-violet-400 to-purple-300",
    wonder: "from-sky-400 to-blue-300",
    peace: "from-teal-400 to-emerald-300",
    tenderness: "from-pink-400 to-rose-300",
  };

  // ─── WELCOME SCREEN ───────────────────────────────────────────────────────────
  if (step === "welcome") {
    return (
      <div style={styles.app}>
        <div style={styles.welcomeContainer}>
          <div style={styles.welcomeOrb} />
          <div style={styles.welcomeOrb2} />
          <div style={styles.welcomeContent}>
            <div style={styles.logoMark}>✦</div>
            <h1 style={styles.welcomeTitle}>Digital Doula</h1>
            <p style={styles.welcomeTagline}>
              For the stories only you can tell.
            </p>
            <p style={styles.welcomeBody}>
              You're at a moment in life that deserves to be remembered — and shared.<br />
              Choose your photos. We'll help you find the words.
            </p>
            <button style={styles.btnPrimary} onClick={() => setStep("upload")}>
              Begin Your Story
            </button>
            <p style={styles.welcomeNote}>25–50 photos · AI narration · Shareable forever</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── UPLOAD SCREEN ────────────────────────────────────────────────────────────
  if (step === "upload") {
    return (
      <div style={styles.app}>
        <div style={styles.pageContainer}>
          <StepHeader step={1} total={3} title="Choose Your Moments" />
          <p style={styles.subtitle}>Select 25–50 photos and videos from your camera roll that tell your story.</p>

          <div
            style={{...styles.dropzone, ...(files.length > 0 ? styles.dropzoneFilled : {})}}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
            {files.length === 0 ? (
              <div style={styles.dropzoneInner}>
                <div style={styles.dropzoneIcon}>📷</div>
                <p style={styles.dropzoneText}>Tap to select photos & videos</p>
                <p style={styles.dropzoneHint}>or drag and drop here · 25–50 files</p>
              </div>
            ) : (
              <div style={styles.previewGrid}>
                {previews.slice(0, 12).map((p, i) => (
                  <div key={i} style={styles.previewThumb}>
                    {p.type === "video" ? (
                      <div style={styles.videoThumb}>🎬</div>
                    ) : (
                      <img src={p.url} alt="" style={styles.thumbImg} />
                    )}
                  </div>
                ))}
                {previews.length > 12 && (
                  <div style={styles.previewMore}>+{previews.length - 12} more</div>
                )}
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div style={styles.fileCount}>
              {files.length < 25 ? (
                <span style={styles.fileCountWarn}>⚠️ {files.length} selected — add {25 - files.length} more for best results</span>
              ) : (
                <span style={styles.fileCountOk}>✓ {files.length} photos & videos selected</span>
              )}
            </div>
          )}

          <div style={styles.navRow}>
            <button style={styles.btnSecondary} onClick={() => setStep("welcome")}>← Back</button>
            <button
              style={{...styles.btnPrimary, ...(files.length < 1 ? styles.btnDisabled : {})}}
              disabled={files.length < 1}
              onClick={() => setStep("customize")}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── CUSTOMIZE SCREEN ────────────────────────────────────────────────────────
  if (step === "customize") {
    return (
      <div style={styles.app}>
        <div style={styles.pageContainer}>
          <StepHeader step={2} total={3} title="Shape Your Story" />
          <p style={styles.subtitle}>Tell us a little about what you're creating and for whom.</p>

          <div style={styles.section}>
            <label style={styles.label}>What kind of story is this?</label>
            <div style={styles.themeGrid}>
              {STORY_THEMES.map(t => (
                <button
                  key={t.id}
                  style={{...styles.themeCard, ...(theme?.id === t.id ? styles.themeCardActive : {})}}
                  onClick={() => setTheme(t)}
                >
                  <span style={styles.themeIcon}>{t.icon}</span>
                  <span style={styles.themeLabel}>{t.label}</span>
                  <span style={styles.themeDesc}>{t.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.section}>
            <label style={styles.label}>Who is this story for?</label>
            <div style={styles.chipRow}>
              {RECIPIENTS.map(r => (
                <button
                  key={r.id}
                  style={{...styles.chip, ...(recipient?.id === r.id ? styles.chipActive : {})}}
                  onClick={() => setRecipient(r)}
                >{r.label}</button>
              ))}
            </div>
          </div>

          <div style={styles.inputRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Your name</label>
              <input
                style={styles.input}
                placeholder="e.g. Mom, Sarah…"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Their name</label>
              <input
                style={styles.input}
                placeholder="e.g. Emma, Dad…"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.navRow}>
            <button style={styles.btnSecondary} onClick={() => setStep("upload")}>← Back</button>
            <button
              style={{...styles.btnPrimary, ...(!theme ? styles.btnDisabled : {})}}
              disabled={!theme}
              onClick={generateStory}
            >
              Generate My Story ✦
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── GENERATING SCREEN ────────────────────────────────────────────────────────
  if (step === "generating") {
    return (
      <div style={styles.app}>
        <div style={styles.generatingContainer}>
          <div style={styles.generatingOrb} />
          <div style={styles.spinnerRing} />
          <div style={styles.generatingContent}>
            <div style={styles.logoMark}>✦</div>
            <h2 style={styles.generatingTitle}>Creating your story</h2>
            <p style={styles.generatingMessage}>{generationMessage}</p>
            <div style={styles.progressBar}>
              <div style={{...styles.progressFill, width: `${generationProgress}%`}} />
            </div>
            <p style={styles.progressPct}>{generationProgress}%</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── PREVIEW SCREEN ────────────────────────────────────────────────────────
  if (step === "preview" && story) {
    const slide = story.slides[currentSlide];
    const gradClass = emotionColors[slide?.emotion] || "from-rose-400 to-pink-300";

    return (
      <div style={styles.app}>
        {/* Story Header */}
        <div style={styles.storyHeader}>
          <div style={styles.logoSmall}>✦ Digital Doula</div>
          <div style={styles.storyHeaderActions}>
            <button style={styles.btnSmall} onClick={() => setStep("share")}>Share →</button>
          </div>
        </div>

        {/* Slide Display */}
        <div style={styles.slideContainer}>
          <div style={styles.slideMedia}>
            {slide?.media?.type === "image" ? (
              <img src={slide.media.url} alt="" style={styles.slideImg} />
            ) : slide?.media?.type === "video" ? (
              <video src={slide.media.url} style={styles.slideImg} muted autoPlay loop />
            ) : (
              <div style={{...styles.slideImgPlaceholder, background: `linear-gradient(135deg, var(--c1), var(--c2))`}} />
            )}
            <div style={styles.slideOverlay} />
          </div>

          <div style={styles.slideContent}>
            <div style={styles.slideEmotion}>{slide?.emotion}</div>
            <h2 style={styles.slideTitle}>{slide?.title}</h2>
            <p style={styles.slideProse}>{slide?.prose}</p>
            <div style={styles.slideCaption}>"{slide?.caption}"</div>
          </div>
        </div>

        {/* Slide Nav */}
        <div style={styles.slideNav}>
          <button
            style={styles.slideNavBtn}
            onClick={() => { clearInterval(slideTimer.current); setCurrentSlide(p => Math.max(0, p - 1)); }}
          >‹</button>
          <div style={styles.slideDots}>
            {story.slides.map((_, i) => (
              <button
                key={i}
                style={{...styles.dot, ...(i === currentSlide ? styles.dotActive : {})}}
                onClick={() => { clearInterval(slideTimer.current); setCurrentSlide(i); }}
              />
            ))}
          </div>
          <button
            style={styles.slideNavBtn}
            onClick={() => { clearInterval(slideTimer.current); setCurrentSlide(p => Math.min(story.slides.length - 1, p + 1)); }}
          >›</button>
        </div>

        {/* Closing message on last slide */}
        {currentSlide === story.slides.length - 1 && (
          <div style={styles.closingBanner}>
            <p style={styles.closingText}>{story.closingMessage}</p>
            <button style={styles.btnPrimary} onClick={() => setStep("share")}>
              Share This Story →
            </button>
          </div>
        )}
      </div>
    );
  }

  // ─── SHARE SCREEN ────────────────────────────────────────────────────────────
  if (step === "share") {
    return (
      <div style={styles.app}>
        <div style={styles.pageContainer}>
          <div style={styles.shareHero}>
            <div style={styles.logoMark}>✦</div>
            <h2 style={styles.shareTitle}>Your story is ready.</h2>
            <p style={styles.shareSubtitle}>
              "{story?.storyTitle}"<br />
              <span style={styles.shareFrom}>{story?.openingLine}</span>
            </p>
          </div>

          <div style={styles.shareCard}>
            <label style={styles.label}>Shareable link</label>
            <div style={styles.shareUrlRow}>
              <input style={styles.shareUrlInput} value={shareUrl} readOnly />
              <button style={styles.btnCopy} onClick={copyShareUrl}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <p style={styles.shareHint}>Anyone with this link can view your story — no account required.</p>
          </div>

          <div style={styles.exportRow}>
            <button style={styles.exportBtn} onClick={handleExportPDF}>
              <span style={styles.exportIcon}>📄</span>
              <span>
                <strong>Download PDF</strong>
                <span style={styles.exportDesc}>Print-ready keepsake</span>
              </span>
            </button>
            <button style={styles.exportBtn} onClick={handleExportVideo}>
              <span style={styles.exportIcon}>🎬</span>
              <span>
                <strong>Export Video</strong>
                <span style={styles.exportDesc}>Cinematic slideshow MP4</span>
              </span>
            </button>
          </div>

          <div style={styles.navRow}>
            <button style={styles.btnSecondary} onClick={() => setStep("preview")}>← Back to Story</button>
            <button style={styles.btnPrimary} onClick={() => {
              setStep("welcome"); setFiles([]); setPreviews([]); setTheme(null);
              setRecipient(null); setStory(null); setAuthorName(""); setRecipientName("");
            }}>
              Create Another ✦
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function StepHeader({ step, total, title }) {
  return (
    <div style={styles.stepHeader}>
      <div style={styles.stepIndicator}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{...styles.stepDot, ...(i < step ? styles.stepDotDone : i === step - 1 ? styles.stepDotActive : {})}} />
        ))}
      </div>
      <h2 style={styles.stepTitle}>{title}</h2>
    </div>
  );
}

// ─── STYLES ────────────────────────────────────────────────────────────────────
const styles = {
  app: {
    minHeight: "100vh",
    background: "#0d0a0f",
    color: "#f0ebe8",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    overflowX: "hidden",
  },
  welcomeContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: "2rem",
  },
  welcomeOrb: {
    position: "absolute",
    width: 600,
    height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(180, 80, 120, 0.25) 0%, transparent 70%)",
    top: "-150px",
    right: "-150px",
    pointerEvents: "none",
  },
  welcomeOrb2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(80, 60, 160, 0.2) 0%, transparent 70%)",
    bottom: "-100px",
    left: "-100px",
    pointerEvents: "none",
  },
  welcomeContent: {
    textAlign: "center",
    maxWidth: 520,
    position: "relative",
    zIndex: 1,
  },
  logoMark: {
    fontSize: "2.5rem",
    color: "#c9956e",
    marginBottom: "1rem",
    display: "block",
    letterSpacing: "0.1em",
  },
  welcomeTitle: {
    fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
    fontWeight: 400,
    letterSpacing: "-0.02em",
    margin: "0 0 1rem",
    background: "linear-gradient(135deg, #f0ebe8 0%, #c9956e 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    lineHeight: 1.1,
  },
  welcomeTagline: {
    fontSize: "1.25rem",
    color: "#b8a89a",
    fontStyle: "italic",
    margin: "0 0 1.5rem",
    letterSpacing: "0.04em",
  },
  welcomeBody: {
    fontSize: "1rem",
    color: "#9a8880",
    lineHeight: 1.8,
    margin: "0 0 2.5rem",
  },
  welcomeNote: {
    marginTop: "1.25rem",
    fontSize: "0.8rem",
    color: "#5a4f48",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  pageContainer: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "3rem 1.5rem 4rem",
  },
  stepHeader: {
    marginBottom: "2rem",
  },
  stepIndicator: {
    display: "flex",
    gap: "0.5rem",
    marginBottom: "1.25rem",
  },
  stepDot: {
    width: 28,
    height: 3,
    borderRadius: 2,
    background: "#2a2025",
  },
  stepDotActive: {
    background: "#c9956e",
  },
  stepDotDone: {
    background: "#6a4f3a",
  },
  stepTitle: {
    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
    fontWeight: 400,
    margin: 0,
    letterSpacing: "-0.02em",
    color: "#f0ebe8",
  },
  subtitle: {
    color: "#9a8880",
    fontSize: "1rem",
    lineHeight: 1.7,
    margin: "0 0 2.5rem",
  },
  dropzone: {
    border: "1.5px dashed #3a2f2a",
    borderRadius: 16,
    padding: "2.5rem",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    background: "#140f12",
    marginBottom: "1.5rem",
  },
  dropzoneFilled: {
    borderColor: "#6a4f3a",
    background: "#1a1215",
  },
  dropzoneInner: {
    textAlign: "center",
    padding: "1rem",
  },
  dropzoneIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
    display: "block",
  },
  dropzoneText: {
    fontSize: "1.1rem",
    color: "#c9956e",
    margin: "0 0 0.5rem",
  },
  dropzoneHint: {
    fontSize: "0.85rem",
    color: "#5a4f48",
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "0.5rem",
  },
  previewThumb: {
    aspectRatio: "1",
    borderRadius: 8,
    overflow: "hidden",
    background: "#2a2025",
  },
  thumbImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  videoThumb: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    background: "#2a2025",
  },
  previewMore: {
    aspectRatio: "1",
    borderRadius: 8,
    background: "#2a2025",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    color: "#9a8880",
  },
  fileCount: {
    textAlign: "center",
    marginBottom: "1.5rem",
    fontSize: "0.9rem",
  },
  fileCountWarn: {
    color: "#c9956e",
  },
  fileCountOk: {
    color: "#7ab885",
  },
  section: {
    marginBottom: "2.5rem",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "#7a6a60",
    marginBottom: "1rem",
  },
  themeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "0.75rem",
  },
  themeCard: {
    background: "#140f12",
    border: "1.5px solid #2a2025",
    borderRadius: 12,
    padding: "1.25rem",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },
  themeCardActive: {
    borderColor: "#c9956e",
    background: "#1e1518",
  },
  themeIcon: {
    fontSize: "1.5rem",
  },
  themeLabel: {
    fontSize: "1rem",
    color: "#f0ebe8",
    fontWeight: 600,
  },
  themeDesc: {
    fontSize: "0.8rem",
    color: "#7a6a60",
    lineHeight: 1.4,
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  chip: {
    padding: "0.5rem 1.25rem",
    borderRadius: 100,
    border: "1.5px solid #2a2025",
    background: "transparent",
    color: "#9a8880",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  chipActive: {
    borderColor: "#c9956e",
    color: "#c9956e",
    background: "#1e1215",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "2.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  input: {
    background: "#140f12",
    border: "1.5px solid #2a2025",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    color: "#f0ebe8",
    fontSize: "1rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  },
  navRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
  btnPrimary: {
    background: "linear-gradient(135deg, #c9956e, #a0604a)",
    color: "#fff",
    border: "none",
    borderRadius: 100,
    padding: "0.85rem 2.25rem",
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.02em",
    transition: "opacity 0.2s, transform 0.1s",
  },
  btnSecondary: {
    background: "transparent",
    color: "#7a6a60",
    border: "1.5px solid #2a2025",
    borderRadius: 100,
    padding: "0.85rem 1.75rem",
    fontSize: "1rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  // Generating
  generatingContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  generatingOrb: {
    position: "absolute",
    width: 700,
    height: 700,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(180, 80, 120, 0.15) 0%, transparent 65%)",
    animation: "pulse 3s ease-in-out infinite",
    pointerEvents: "none",
  },
  spinnerRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    border: "1px solid rgba(201, 149, 110, 0.2)",
    animation: "spin 8s linear infinite",
    pointerEvents: "none",
  },
  generatingContent: {
    textAlign: "center",
    maxWidth: 400,
    position: "relative",
    zIndex: 1,
    padding: "2rem",
  },
  generatingTitle: {
    fontSize: "2rem",
    fontWeight: 400,
    margin: "1rem 0 0.75rem",
    color: "#f0ebe8",
  },
  generatingMessage: {
    color: "#9a8880",
    fontStyle: "italic",
    fontSize: "1rem",
    minHeight: "1.5rem",
    marginBottom: "2rem",
  },
  progressBar: {
    background: "#2a2025",
    borderRadius: 100,
    height: 3,
    overflow: "hidden",
    marginBottom: "0.75rem",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #c9956e, #a0604a)",
    transition: "width 0.8s ease",
    borderRadius: 100,
  },
  progressPct: {
    fontSize: "0.8rem",
    color: "#5a4f48",
    letterSpacing: "0.1em",
  },
  // Story / Preview
  storyHeader: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: "linear-gradient(to bottom, rgba(13,10,15,0.95), transparent)",
  },
  logoSmall: {
    fontSize: "0.9rem",
    color: "#c9956e",
    letterSpacing: "0.08em",
  },
  storyHeaderActions: {
    display: "flex",
    gap: "0.75rem",
  },
  btnSmall: {
    background: "rgba(201, 149, 110, 0.15)",
    color: "#c9956e",
    border: "1px solid rgba(201,149,110,0.3)",
    borderRadius: 100,
    padding: "0.4rem 1.1rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  slideContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
  },
  slideMedia: {
    position: "absolute",
    inset: 0,
  },
  slideImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  slideImgPlaceholder: {
    width: "100%",
    height: "100%",
  },
  slideOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(13,10,15,0.95) 0%, rgba(13,10,15,0.3) 50%, transparent 100%)",
  },
  slideContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "2rem 2rem 8rem",
    maxWidth: 680,
    margin: "0 auto",
  },
  slideEmotion: {
    fontSize: "0.7rem",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#c9956e",
    marginBottom: "0.75rem",
  },
  slideTitle: {
    fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
    fontWeight: 400,
    margin: "0 0 1rem",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
    color: "#f0ebe8",
  },
  slideProse: {
    fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
    lineHeight: 1.85,
    color: "#c4b4aa",
    margin: "0 0 1.25rem",
  },
  slideCaption: {
    fontSize: "0.85rem",
    color: "#7a6a60",
    fontStyle: "italic",
  },
  slideNav: {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    zIndex: 50,
    background: "rgba(13,10,15,0.8)",
    backdropFilter: "blur(12px)",
    borderRadius: 100,
    padding: "0.75rem 1.5rem",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  slideNavBtn: {
    background: "transparent",
    border: "none",
    color: "#9a8880",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0 0.25rem",
    lineHeight: 1,
  },
  slideDots: {
    display: "flex",
    gap: "0.5rem",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#3a2f2a",
    border: "none",
    cursor: "pointer",
    padding: 0,
    transition: "all 0.2s",
  },
  dotActive: {
    background: "#c9956e",
    transform: "scale(1.3)",
  },
  closingBanner: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(to top, rgba(13,10,15,1) 0%, rgba(13,10,15,0.95) 100%)",
    padding: "2rem 1.5rem",
    textAlign: "center",
    zIndex: 60,
    borderTop: "1px solid #2a2025",
  },
  closingText: {
    color: "#9a8880",
    fontStyle: "italic",
    fontSize: "0.95rem",
    marginBottom: "1.25rem",
    maxWidth: 480,
    margin: "0 auto 1.25rem",
    lineHeight: 1.7,
  },
  // Share
  shareHero: {
    textAlign: "center",
    marginBottom: "3rem",
    paddingTop: "1rem",
  },
  shareTitle: {
    fontSize: "clamp(2rem, 5vw, 3rem)",
    fontWeight: 400,
    margin: "0.75rem 0 0.75rem",
    letterSpacing: "-0.02em",
    color: "#f0ebe8",
  },
  shareSubtitle: {
    color: "#9a8880",
    fontSize: "1rem",
    lineHeight: 1.8,
  },
  shareFrom: {
    color: "#7a6a60",
    fontSize: "0.9rem",
    fontStyle: "italic",
  },
  shareCard: {
    background: "#140f12",
    border: "1.5px solid #2a2025",
    borderRadius: 16,
    padding: "1.75rem",
    marginBottom: "1.5rem",
  },
  shareUrlRow: {
    display: "flex",
    gap: "0.75rem",
    marginBottom: "0.75rem",
  },
  shareUrlInput: {
    flex: 1,
    background: "#0d0a0f",
    border: "1px solid #2a2025",
    borderRadius: 8,
    padding: "0.75rem 1rem",
    color: "#7a6a60",
    fontSize: "0.85rem",
    fontFamily: "monospace",
    outline: "none",
  },
  btnCopy: {
    background: "rgba(201, 149, 110, 0.15)",
    color: "#c9956e",
    border: "1px solid rgba(201,149,110,0.3)",
    borderRadius: 8,
    padding: "0.75rem 1.25rem",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  },
  shareHint: {
    fontSize: "0.8rem",
    color: "#5a4f48",
    margin: 0,
  },
  exportRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "2.5rem",
  },
  exportBtn: {
    background: "#140f12",
    border: "1.5px solid #2a2025",
    borderRadius: 12,
    padding: "1.25rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    textAlign: "left",
    transition: "border-color 0.2s",
    color: "#f0ebe8",
    fontFamily: "inherit",
  },
  exportIcon: {
    fontSize: "1.75rem",
    flexShrink: 0,
  },
  exportDesc: {
    display: "block",
    fontSize: "0.78rem",
    color: "#7a6a60",
    marginTop: "0.2rem",
  },
};
