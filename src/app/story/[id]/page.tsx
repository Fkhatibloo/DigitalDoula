"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function StoryViewer() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch(`/api/share?id=${id}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0a0f", display: "flex", alignItems: "center", justifyContent: "center", color: "#9a8880", fontFamily: "Georgia, serif" }}>
      <p>Loading your story…</p>
    </div>
  );

  if (!data?.story) return (
    <div style={{ minHeight: "100vh", background: "#0d0a0f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#9a8880", fontFamily: "Georgia, serif", gap: "1rem" }}>
      <span style={{ fontSize: "2rem" }}>✦</span>
      <p>This story could not be found.</p>
    </div>
  );

  const { story, mediaUrls } = data;
  const slide = story.slides[currentSlide];
  const media = mediaUrls?.[Math.floor(currentSlide * mediaUrls.length / 6)];

  return (
    <div style={{ minHeight: "100vh", background: "#0d0a0f", color: "#f0ebe8", fontFamily: "Georgia, serif" }}>
      <header style={{ padding: "1.25rem 2rem", background: "rgba(13,10,15,0.9)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#c9956e", fontSize: "0.9rem", letterSpacing: "0.08em" }}>✦ Digital Doula</span>
        <span style={{ color: "#5a4f48", fontSize: "0.8rem" }}>Shared story</span>
      </header>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 400, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>{story.storyTitle}</h1>
        <p style={{ color: "#9a8880", fontStyle: "italic", marginBottom: "3rem" }}>{story.openingLine}</p>
        {story.slides.map((s: any, i: number) => (
          <div key={i} style={{ marginBottom: "3rem", padding: "2rem", background: "#140f12", borderRadius: 16, border: "1px solid #2a2025" }}>
            {mediaUrls?.[Math.floor(i * mediaUrls.length / 6)] && (
              <img src={mediaUrls[Math.floor(i * mediaUrls.length / 6)]} alt="" style={{ width: "100%", borderRadius: 12, marginBottom: "1.5rem", aspectRatio: "16/9", objectFit: "cover" }} />
            )}
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#c9956e", marginBottom: "0.5rem" }}>{s.emotion}</p>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "1rem" }}>{s.title}</h2>
            <p style={{ color: "#c4b4aa", lineHeight: 1.85, marginBottom: "1rem" }}>{s.prose}</p>
            <p style={{ color: "#7a6a60", fontStyle: "italic", fontSize: "0.85rem" }}>"{s.caption}"</p>
          </div>
        ))}
        <div style={{ textAlign: "center", padding: "2rem", borderTop: "1px solid #2a2025", color: "#9a8880", fontStyle: "italic", lineHeight: 1.8 }}>
          {story.closingMessage}
        </div>
      </div>
    </div>
  );
}
