export interface StoryChapter {
  title: string;
  narration: string;
}

export interface GeneratedStory {
  title: string;
  chapters: StoryChapter[];
}

export async function generateStory(params: {
  recipientName: string;
  recipientRelationship: string;
  storyTone: string;
  authorName: string;
  personalNote: string;
}): Promise<GeneratedStory> {
  const response = await fetch("/api/generate-story", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!response.ok) throw new Error("Story generation failed");
  return response.json();
}
