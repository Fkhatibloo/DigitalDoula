"use client";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

type Step = "upload" | "configure" | "generating" | "done";

interface StoryConfig {
  recipientName: string;
  recipientRelationship: string;
  storyTone: string;
  authorName: string;
  personalNote: string;
}

interface MediaFile {
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [config, setConfig] = useState<StoryConfig>({
    recipientName: "",
    recipientRelationship: "",
    storyTone: "warm",
    authorName: "",
    personalNote: "",
  });
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState("Gathering your memories...");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMedia = files.slice(0, 50 - mediaFiles.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" as const : "image" as const,
    }));
    setMediaFiles((prev) => [...prev, ...newMedia].slice(0, 50));
  }, [mediaFiles]);

  const removeMedia = (idx: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const generateStory = async () => {
    setStep("generating");
    
    const messages = [
      "Gathering your memories...",
      "Weaving your story together...",
      "Crafting the perfect words...",
      "Adding the finishing touches...",
      "Almost ready...",
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress((i / messages.length) * 100);
      setProgressMsg(messages[i] || messages[messages.length - 1]);
      if (i >= messages.length) clearInterval(interval);
    }, 1800);

    try {
      const formData = new FormData();
      formData.append("config", JSON.stringify(config));
      formData.append("mediaCount", String(mediaFiles.length));
      // In production: upload actual files
      // mediaFiles.forEach((m, i) => formData.append(`media_${i}`, m.file));

      const response = await fetch("/api/generate-story", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        router.push(`/story/${data.storyId}`);
      }, 800);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      // In demo, navigate to a mock story
      setTimeout(() => router.push("/story/demo"), 800);
    }
  };

  const toneOptions = [
    { value: "warm", label: "Warm & Loving", emoji: "🧡" },
    { value: "nostalgic", label: "Nostalgic & Tender", emoji: "🌿" },
    { value: "celebratory", label: "Joyful & Celebratory", emoji: "✨" },
    { value: "reflective", label: "Quiet & Reflective", emoji: "🌙" },
  ];

  if (step === "generating") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'var(--cream)' }}>
        <div className="text-center max-w-md">
          <div className="font-display mb-4" style={{ fontSize: '3.5rem' }}>🌸</div>
          <h2 className="font-display mb-3" style={{ fontSize: '2.2rem', fontWeight: 400, color: 'var(--charcoal)' }}>
            Creating your story
          </h2>
          <p className="mb-10" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#6B6560' }}>
            {progressMsg}
          </p>
          <div className="w-full rounded-full h-1 overflow-hidden" style={{ background: 'var(--parchment)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progress}%`, background: 'var(--terra)' }}
            />
          </div>
          <p className="mt-4 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#9B9590' }}>
            {Math.round(progress)}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--cream)' }}>
      {/* Header */}
      <header className="px-6 py-6 flex items-center justify-between border-b" style={{ borderColor: 'var(--parchment)' }}>
        <a href="/" className="font-display" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--charcoal)' }}>
          🌸 Digital Doula
        </a>
        <div className="flex items-center gap-3 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#9B9590' }}>
          {["upload", "configure"].map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              {i > 0 && <span>—</span>}
              <span style={{ color: step === s ? 'var(--terra)' : undefined }}>
                {i + 1}. {s === "upload" ? "Choose photos" : "Shape the story"}
              </span>
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {step === "upload" && (
          <div>
            <h1 className="font-display mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--charcoal)' }}>
              Choose your memories
            </h1>
            <p className="mb-10" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#6B6560', fontSize: '1.05rem' }}>
              Select 25–50 photos and videos. These will become the heart of your story.
              <span className="ml-2" style={{ color: 'var(--terra)' }}>{mediaFiles.length}/50 selected</span>
            </p>

            {/* Upload zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed p-12 text-center mb-8 cursor-pointer transition-all hover:border-opacity-80"
              style={{ borderColor: 'var(--blush)', background: 'var(--parchment)' }}
            >
              <div className="text-5xl mb-4">📷</div>
              <p className="font-display mb-2" style={{ fontSize: '1.4rem', fontWeight: 400 }}>
                Tap to select from your camera roll
              </p>
              <p style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#9B9590', fontSize: '0.9rem' }}>
                Photos and videos · Up to 50 files · iPhone optimized
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {/* Grid preview */}
            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-10">
                {mediaFiles.map((m, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                    {m.type === "image" ? (
                      <img src={m.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.preview} className="w-full h-full object-cover" />
                    )}
                    {m.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                        <span className="text-white text-lg">▶</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); removeMedia(i); }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white"
                      style={{ background: 'rgba(0,0,0,0.6)' }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <p style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#9B9590', fontSize: '0.85rem' }}>
                {mediaFiles.length < 25 ? `Please select at least ${25 - mediaFiles.length} more` : '✓ Ready to continue'}
              </p>
              <button
                onClick={() => setStep("configure")}
                disabled={mediaFiles.length < 1}
                className="px-8 py-3 rounded-full text-white transition-all disabled:opacity-40"
                style={{ background: 'var(--terra)', fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {step === "configure" && (
          <div className="max-w-xl">
            <button
              onClick={() => setStep("upload")}
              className="mb-8 text-sm flex items-center gap-2 transition-opacity hover:opacity-60"
              style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#9B9590' }}
            >
              ← Back
            </button>

            <h1 className="font-display mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'var(--charcoal)' }}>
              Shape your story
            </h1>
            <p className="mb-10" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#6B6560', fontSize: '1.05rem' }}>
              Tell us about the person you're creating this for.
            </p>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block mb-2 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400, color: 'var(--charcoal)' }}>
                  This story is for *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah, Mom, my daughter"
                  value={config.recipientName}
                  onChange={(e) => setConfig({ ...config, recipientName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                  style={{ background: 'var(--parchment)', border: '1px solid var(--blush)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Your relationship to them
                </label>
                <input
                  type="text"
                  placeholder="e.g. my daughter, my best friend, my mother"
                  value={config.recipientRelationship}
                  onChange={(e) => setConfig({ ...config, recipientRelationship: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: 'var(--parchment)', border: '1px solid var(--blush)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
                />
              </div>

              <div>
                <label className="block mb-3 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Story tone
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {toneOptions.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setConfig({ ...config, storyTone: t.value })}
                      className="px-4 py-3 rounded-xl text-left transition-all"
                      style={{
                        background: config.storyTone === t.value ? 'var(--terra)' : 'var(--parchment)',
                        color: config.storyTone === t.value ? 'white' : 'var(--charcoal)',
                        border: `1px solid ${config.storyTone === t.value ? 'var(--terra)' : 'var(--blush)'}`,
                        fontFamily: 'Jost, sans-serif',
                        fontWeight: 300,
                        fontSize: '0.9rem',
                      }}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Your name (for the story)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mom, Grandma, Your best friend"
                  value={config.authorName}
                  onChange={(e) => setConfig({ ...config, authorName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none"
                  style={{ background: 'var(--parchment)', border: '1px solid var(--blush)', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 400, color: 'var(--charcoal)' }}>
                  Anything else you want them to know
                </label>
                <textarea
                  rows={4}
                  placeholder="Share a memory, a feeling, something you've always wanted to say..."
                  value={config.personalNote}
                  onChange={(e) => setConfig({ ...config, personalNote: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none"
                  style={{ background: 'var(--parchment)', border: '1px solid var(--blush)', fontFamily: 'Jost, sans-serif', fontWeight: 300, lineHeight: 1.7 }}
                />
              </div>

              <button
                onClick={generateStory}
                disabled={!config.recipientName}
                className="w-full px-8 py-4 rounded-full text-white transition-all hover:scale-105 hover:shadow-lg disabled:opacity-40 disabled:scale-100"
                style={{ background: 'var(--terra)', fontFamily: 'Jost, sans-serif', fontWeight: 400, fontSize: '1rem' }}
              >
                Create my story ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
