import { useState, useCallback } from "react";
import type { Story, StoryTheme, MediaItem } from "@/types";

interface GeneratorOptions {
  theme: StoryTheme;
  recipientName: string;
  authorName: string;
  media: MediaItem[];
}

export function useStoryGenerator() {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async ({ theme, recipientName, authorName, media }: GeneratorOptions) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    const messages = [
      "Reading the light in your photos…",
      "Feeling the moments between frames…",
      "Finding the words only love can say…",
      "Weaving your story together…",
      "Adding the final touches…",
    ];

    for (let i = 0; i < messages.length; i++) {
      setMessage(messages[i]);
      await new Promise(r => setTimeout(r, 1500));
      setProgress((i + 1) * 20);
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme,
          recipientName,
          authorName,
          photoCount: media.length,
          photoDescriptions: media.slice(0, 8).map((m, i) => `${i + 1}. ${m.type} - ${m.name}`).join("\n"),
        }),
      });

      const { story: generated, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      const slidesWithMedia = generated.slides.map((slide: any, i: number) => ({
        ...slide,
        media: media[Math.floor(i * media.length / 6)] || media[i % media.length],
      }));

      setStory({ ...generated, slides: slidesWithMedia });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }, []);

  return { story, loading, progress, message, error, generate };
}
