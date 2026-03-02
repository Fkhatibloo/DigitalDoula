"use client";
import { useState, useEffect, useRef } from "react";

// Demo story data
const DEMO_STORY = {
  id: "demo",
  recipientName: "Sarah",
  authorName: "Mom",
  title: "Everything You Mean to Me",
  chapters: [
    {
      title: "Where it all began",
      narration: "There is a moment I return to often — a quiet Tuesday in October, when the world was still and something new had entered it. You. I remember holding you for the first time, the impossible lightness of you, the warmth. I thought: here is a person who will change everything. I was right.",
      mediaIndex: 0,
    },
    {
      title: "The years of small miracles",
      narration: "Every parent will tell you: the years go fast. But they don't quite prepare you for how much weight each moment carries. Your first steps. The way you said 'birdbird' instead of 'bird' until you were four. How you'd climb into my bed during thunderstorms and fall asleep so easily, so trusting.",
      mediaIndex: 1,
    },
    {
      title: "The person you've become",
      narration: "Somewhere along the way, you became yourself. Not the child I imagined, but something far more interesting — a whole person with your own questions, your own laughter, your own way of seeing the world. I watch you now and I am in awe. I hope you know that.",
      mediaIndex: 2,
    },
    {
      title: "What I want you to carry",
      narration: "If there is one thing I want you to know — to really know, in your bones — it is this: you were loved before you knew what love was. You are loved now, in all your complexity. And whatever comes, that love is the one constant. It was always there. It always will be.",
      mediaIndex: 3,
    },
  ],
  shareUrl: "https://digital-doula.vercel.app/shared/demo-abc123",
};

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?w=800&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?w=800&q=80",
];

export default function StoryPage({ params }: { params: { id: string } }) {
  const story = DEMO_STORY; // In production: fetch by params.id
  const [activeChapter, setActiveChapter] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playRef = useRef<NodeJS.Timeout | null>(null);

  const copyLink = () => {
    navigator.clipboard.writeText(story.shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePlay = () => {
    if (isPlaying) {
      clearInterval(playRef.current!);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playRef.current = setInterval(() => {
        setActiveChapter((prev) => {
          if (prev >= story.chapters.length - 1) {
            clearInterval(playRef.current!);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 6000);
    }
  };

  useEffect(() => () => { if (playRef.current) clearInterval(playRef.current); }, []);

  const chapter = story.chapters[activeChapter];

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--charcoal)' }}>
      {/* Full-screen story viewer */}
      <div className="relative flex-1 flex flex-col min-h-screen">
        {/* Background image with ken burns */}
        <div className="absolute inset-0 overflow-hidden">
          {PLACEHOLDER_IMAGES.map((src, i) => (
            <div
              key={i}
              className="absolute inset-0 transition-opacity duration-1500"
              style={{ opacity: i === activeChapter ? 1 : 0 }}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover story-slide"
                style={{ filter: 'brightness(0.45)' }}
              />
            </div>
          ))}
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.1) 100%)' }} />
        </div>

        {/* Header bar */}
        <header className="relative z-10 flex items-center justify-between px-6 py-5">
          <a href="/" className="font-display text-white opacity-60 hover:opacity-100 transition-opacity" style={{ fontSize: '1.1rem', fontWeight: 300 }}>
            🌸 Digital Doula
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShare(true)}
              className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontFamily: 'Jost, sans-serif', fontWeight: 300, backdropFilter: 'blur(10px)' }}
            >
              Share ↗
            </button>
            <button
              className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105"
              style={{ background: 'var(--terra)', color: 'white', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}
            >
              Export PDF
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-8 md:px-16 md:pb-16 max-w-4xl">
          {/* Chapter indicator */}
          <div className="flex gap-2 mb-6">
            {story.chapters.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveChapter(i)}
                className="h-0.5 rounded-full transition-all duration-500"
                style={{
                  width: i === activeChapter ? '40px' : '16px',
                  background: i === activeChapter ? 'white' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </div>

          <p className="text-xs mb-3 tracking-widest uppercase opacity-50" style={{ fontFamily: 'Jost, sans-serif', color: 'white', fontWeight: 300 }}>
            {chapter.title}
          </p>
          <h2 className="font-display text-white mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, lineHeight: 1.3 }}>
            {story.title}
          </h2>
          <p
            key={activeChapter}
            className="text-white leading-relaxed"
            style={{ 
              fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '1.05rem', 
              opacity: 0.85, maxWidth: '600px',
              animation: 'fadeIn 0.8s ease-out forwards'
            }}
          >
            {chapter.narration}
          </p>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: 'white' }}
            >
              <span style={{ color: 'var(--charcoal)', fontSize: '1.1rem' }}>{isPlaying ? '⏸' : '▶'}</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                disabled={activeChapter === 0}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
              >
                ←
              </button>
              <button
                onClick={() => setActiveChapter(Math.min(story.chapters.length - 1, activeChapter + 1))}
                disabled={activeChapter === story.chapters.length - 1}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
              >
                →
              </button>
            </div>
            <span className="text-xs opacity-40 text-white" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>
              {activeChapter + 1} / {story.chapters.length}
            </span>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowShare(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl p-8"
            style={{ background: 'var(--cream)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display mb-2" style={{ fontSize: '2rem', fontWeight: 400, color: 'var(--charcoal)' }}>
              Share this story
            </h3>
            <p className="mb-6" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#6B6560' }}>
              Anyone with this link can view your story.
            </p>
            <div className="flex gap-2 mb-4">
              <input
                readOnly
                value={story.shareUrl}
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{ background: 'var(--parchment)', border: '1px solid var(--blush)', fontFamily: 'Jost, sans-serif', color: 'var(--charcoal)' }}
              />
              <button
                onClick={copyLink}
                className="px-4 py-3 rounded-xl text-sm transition-all"
                style={{ background: 'var(--terra)', color: 'white', fontFamily: 'Jost, sans-serif', fontWeight: 400 }}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["📧 Email", "💬 iMessage", "📱 WhatsApp"].map((s) => (
                <button key={s} className="py-3 rounded-xl text-sm text-center transition-all hover:scale-105"
                  style={{ background: 'var(--parchment)', fontFamily: 'Jost, sans-serif', fontWeight: 300, color: 'var(--charcoal)' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
