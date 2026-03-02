"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";

type Step = "upload" | "customize" | "generating" | "done";

interface StorySettings {
  recipientName: string;
  senderName: string;
  relationship: string;
  tone: string;
  occasion: string;
  personalNote: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [settings, setSettings] = useState<StorySettings>({
    recipientName: "",
    senderName: "",
    relationship: "partner",
    tone: "warm",
    occasion: "milestone",
    personalNote: "",
  });
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("Preparing your memories...");
  const [storyId, setStoryId] = useState<string>("");
  const [error, setError] = useState<string>("");

  const onDrop = useCallback((accepted: File[]) => {
    const all = [...files, ...accepted].slice(0, 50);
    setFiles(all);
    const newPreviews = all.map(f => URL.createObjectURL(f));
    setPreviews(newPreviews);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
    maxFiles: 50,
  });

  const removeFile = (i: number) => {
    const newFiles = files.filter((_, idx) => idx !== i);
    const newPreviews = previews.filter((_, idx) => idx !== i);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleGenerate = async () => {
    setStep("generating");
    setError("");

    const progressSteps = [
      { pct: 15, msg: "Uploading your precious memories..." },
      { pct: 35, msg: "Studying each photo with care..." },
      { pct: 55, msg: "Crafting your personalized narrative..." },
      { pct: 75, msg: "Weaving the story together..." },
      { pct: 90, msg: "Adding final touches..." },
    ];

    let stepIdx = 0;
    const progressTimer = setInterval(() => {
      if (stepIdx < progressSteps.length) {
        setProgress(progressSteps[stepIdx].pct);
        setProgressMsg(progressSteps[stepIdx].msg);
        stepIdx++;
      }
    }, 2500);

    try {
      const formData = new FormData();
      files.forEach(f => formData.append("files", f));
      formData.append("settings", JSON.stringify(settings));

      const res = await fetch("/api/generate-story", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const data = await res.json();
      setProgress(100);
      setProgressMsg("Your story is ready ✨");
      setStoryId(data.storyId);
      setTimeout(() => setStep("done"), 1000);
    } catch (err: any) {
      clearInterval(progressTimer);
      setError(err.message);
      setStep("customize");
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(253,248,240,0.05)",
    border: "1px solid rgba(253,248,240,0.12)",
    borderRadius: "10px",
    padding: "0.75rem 1rem",
    color: "#fdf8f0",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "rgba(253,248,240,0.4)",
    marginBottom: "0.5rem",
    display: "block",
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #120f1a 0%, #1e1829 60%, #2d2535 100%)",
    }}>
      {/* Header */}
      <header style={{
        padding: "1.5rem 2.5rem",
        borderBottom: "1px solid rgba(253,248,240,0.06)",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      }}>
        <button
          onClick={() => router.push("/")}
          style={{
            background: "none", border: "none", color: "rgba(253,248,240,0.4)",
            cursor: "pointer", fontSize: "1.2rem",
          }}
        >←</button>
        <span style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.2rem",
          color: "#f2d9b0",
        }}>Create Your Story</span>

        {/* Step indicator */}
        <div style={{ marginLeft: "auto", display: "flex", gap: "6px", alignItems: "center" }}>
          {["upload", "customize"].map((s, i) => (
            <div key={s} style={{
              width: step === s ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: step === s || (step === "generating" && s === "customize") || step === "done"
                ? "#d4852e" : "rgba(253,248,240,0.2)",
              transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      </header>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "3rem 2rem" }}>

        {/* STEP 1: Upload */}
        {step === "upload" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 300,
                color: "#fdf8f0",
                marginBottom: "0.75rem",
              }}>
                Choose your memories
              </h2>
              <p style={{ color: "rgba(253,248,240,0.5)", fontSize: "0.95rem" }}>
                Select 25–50 photos or videos. These are the moments that will tell your story.
              </p>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? "#d4852e" : "rgba(253,248,240,0.15)"}`,
                borderRadius: "20px",
                padding: "4rem 2rem",
                textAlign: "center",
                cursor: "pointer",
                background: isDragActive ? "rgba(212,133,46,0.05)" : "rgba(253,248,240,0.02)",
                transition: "all 0.3s ease",
                marginBottom: "2rem",
              }}
            >
              <input {...getInputProps()} />
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📸</div>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.4rem",
                color: "#f2d9b0",
                marginBottom: "0.5rem",
              }}>
                {isDragActive ? "Drop them here..." : "Drag & drop your photos and videos"}
              </p>
              <p style={{ color: "rgba(253,248,240,0.35)", fontSize: "0.85rem" }}>
                or tap to browse your camera roll · {files.length}/50 selected
              </p>
            </div>

            {/* Photo grid */}
            {previews.length > 0 && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "8px",
                marginBottom: "2.5rem",
              }}>
                {previews.map((src, i) => (
                  <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "10px", overflow: "hidden" }}>
                    {files[i]?.type.startsWith("video") ? (
                      <video src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      style={{
                        position: "absolute", top: "4px", right: "4px",
                        background: "rgba(18,15,26,0.8)", border: "none",
                        borderRadius: "50%", width: "20px", height: "20px",
                        color: "#fdf8f0", cursor: "pointer", fontSize: "12px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >×</button>
                  </div>
                ))}
              </div>
            )}

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setStep("customize")}
                disabled={files.length < 1}
                style={{
                  background: files.length >= 1
                    ? "linear-gradient(135deg, #d4852e, #e8a855)"
                    : "rgba(253,248,240,0.1)",
                  border: "none",
                  color: files.length >= 1 ? "#120f1a" : "rgba(253,248,240,0.3)",
                  padding: "1rem 3rem",
                  borderRadius: "3rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: files.length >= 1 ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                }}
              >
                Continue → {files.length > 0 && `(${files.length} memories)`}
              </button>
              {files.length > 0 && files.length < 25 && (
                <p style={{ color: "#d4852e", fontSize: "0.8rem", marginTop: "0.75rem", opacity: 0.8 }}>
                  For the richest story, try to include at least 25 photos
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Customize */}
        {step === "customize" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 300,
                color: "#fdf8f0",
                marginBottom: "0.75rem",
              }}>
                Tell us about this story
              </h2>
              <p style={{ color: "rgba(253,248,240,0.5)", fontSize: "0.95rem" }}>
                A few details help us craft something truly personal.
              </p>
            </div>

            {error && (
              <div style={{
                background: "rgba(200,60,60,0.1)", border: "1px solid rgba(200,60,60,0.3)",
                borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem", color: "#f08080",
                fontSize: "0.9rem",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>This story is for</label>
                <input
                  style={inputStyle}
                  value={settings.recipientName}
                  onChange={e => setSettings(s => ({ ...s, recipientName: e.target.value }))}
                  placeholder="Their name..."
                />
              </div>
              <div>
                <label style={labelStyle}>From</label>
                <input
                  style={inputStyle}
                  value={settings.senderName}
                  onChange={e => setSettings(s => ({ ...s, senderName: e.target.value }))}
                  placeholder="Your name..."
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={labelStyle}>Your relationship</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={settings.relationship}
                  onChange={e => setSettings(s => ({ ...s, relationship: e.target.value }))}
                >
                  <option value="partner">Partner / Spouse</option>
                  <option value="child">Child</option>
                  <option value="parent">Parent</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Best Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>The occasion</label>
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={settings.occasion}
                  onChange={e => setSettings(s => ({ ...s, occasion: e.target.value }))}
                >
                  <option value="milestone">Life milestone</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="farewell">Farewell / moving on</option>
                  <option value="illness">Facing illness</option>
                  <option value="celebration">Celebration</option>
                  <option value="memorial">In memory of</option>
                  <option value="just_because">Just because I love you</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={labelStyle}>Tone of the story</label>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { v: "warm", label: "Warm & Tender" },
                  { v: "playful", label: "Playful & Joyful" },
                  { v: "reflective", label: "Reflective & Deep" },
                  { v: "celebratory", label: "Celebratory" },
                  { v: "bittersweet", label: "Bittersweet" },
                ].map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => setSettings(s => ({ ...s, tone: opt.v }))}
                    style={{
                      background: settings.tone === opt.v ? "rgba(212,133,46,0.2)" : "rgba(253,248,240,0.04)",
                      border: `1px solid ${settings.tone === opt.v ? "rgba(212,133,46,0.6)" : "rgba(253,248,240,0.12)"}`,
                      color: settings.tone === opt.v ? "#d4852e" : "rgba(253,248,240,0.5)",
                      padding: "0.5rem 1.25rem",
                      borderRadius: "2rem",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "2.5rem" }}>
              <label style={labelStyle}>A personal note (optional)</label>
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: "120px",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
                value={settings.personalNote}
                onChange={e => setSettings(s => ({ ...s, personalNote: e.target.value }))}
                placeholder="Share a memory, an inside joke, something only they would understand... This helps us make the story uniquely yours."
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={() => setStep("upload")}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(253,248,240,0.15)",
                  color: "rgba(253,248,240,0.5)",
                  padding: "1rem 2rem",
                  borderRadius: "3rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={!settings.recipientName || !settings.senderName}
                style={{
                  background: settings.recipientName && settings.senderName
                    ? "linear-gradient(135deg, #d4852e, #e8a855)"
                    : "rgba(253,248,240,0.1)",
                  border: "none",
                  color: settings.recipientName && settings.senderName ? "#120f1a" : "rgba(253,248,240,0.3)",
                  padding: "1rem 3rem",
                  borderRadius: "3rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 500,
                  cursor: settings.recipientName && settings.senderName ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                }}
              >
                Create My Story ✨
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Generating */}
        {step === "generating" && (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "2rem", animation: "pulse 2s ease infinite" }}>🌸</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.5rem",
              fontWeight: 300,
              color: "#fdf8f0",
              marginBottom: "1rem",
            }}>
              Creating something beautiful
            </h2>
            <p style={{
              color: "rgba(253,248,240,0.5)", fontSize: "1rem", marginBottom: "3rem",
              transition: "all 0.5s ease",
            }}>
              {progressMsg}
            </p>
            <div style={{
              maxWidth: "400px", margin: "0 auto",
              background: "rgba(253,248,240,0.06)",
              borderRadius: "100px", height: "6px", overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #d4852e, #e8a855)",
                borderRadius: "100px",
                width: `${progress}%`,
                transition: "width 1s ease",
              }} />
            </div>
            <p style={{ color: "rgba(253,248,240,0.25)", fontSize: "0.75rem", marginTop: "1rem" }}>
              {progress}%
            </p>
          </div>
        )}

        {/* STEP 4: Done */}
        {step === "done" && (
          <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🎉</div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 300,
              color: "#fdf8f0",
              marginBottom: "1rem",
            }}>
              Your story is ready
            </h2>
            <p style={{ color: "rgba(253,248,240,0.5)", marginBottom: "3rem", fontSize: "0.95rem" }}>
              {settings.recipientName} is going to treasure this forever.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => router.push(`/story/${storyId}`)}
                style={{
                  background: "linear-gradient(135deg, #d4852e, #e8a855)",
                  border: "none", color: "#120f1a",
                  padding: "1rem 2.5rem", borderRadius: "3rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1rem", fontWeight: 500, cursor: "pointer",
                }}
              >
                View Your Story
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/story/${storyId}`);
                }}
                style={{
                  background: "rgba(253,248,240,0.05)",
                  border: "1px solid rgba(253,248,240,0.15)",
                  color: "rgba(253,248,240,0.7)",
                  padding: "1rem 2.5rem", borderRadius: "3rem",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "1rem", cursor: "pointer",
                }}
              >
                Copy Share Link
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
