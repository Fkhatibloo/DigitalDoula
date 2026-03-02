"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// In production: fetch story by token from Vercel KV
export default function SharedPage({ params }: { params: { token: string } }) {
  const router = useRouter();
  useEffect(() => {
    // Redirect to story viewer with resolved ID
    // In production: lookup token → storyId in KV
    router.replace("/story/demo");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="text-center">
        <div className="font-display mb-4 text-5xl">🌸</div>
        <p style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#6B6560' }}>
          Opening your story...
        </p>
      </div>
    </div>
  );
}
