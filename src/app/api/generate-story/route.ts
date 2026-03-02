import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { put } from "@vercel/blob";
import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const settingsRaw = formData.get("settings") as string;
    const settings = JSON.parse(settingsRaw);

    if (!files.length) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Upload files to Vercel Blob
    const uploadedUrls: string[] = [];
    const imageBlobs: { type: string; data: string; mediaType: string }[] = [];

    for (const file of files.slice(0, 50)) {
      const blob = await put(`stories/${uuidv4()}/${file.name}`, file, {
        access: "public",
      });
      uploadedUrls.push(blob.url);

      // Prepare images for Claude (only images, not videos)
      if (file.type.startsWith("image/") && imageBlobs.length < 10) {
        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        imageBlobs.push({
          type: "image",
          data: base64,
          mediaType: file.type as any,
        });
      }
    }

    // Build Claude prompt
    const { recipientName, senderName, relationship, tone, occasion, personalNote } = settings;
    
    const toneDescriptions: Record<string, string> = {
      warm: "tender, heartfelt, and loving",
      playful: "joyful, light-hearted, with moments of humor",
      reflective: "thoughtful, deep, and emotionally resonant",
      celebratory: "uplifting, proud, and filled with joy",
      bittersweet: "honest about both joy and the poignancy of passing time",
    };

    const occasionDescriptions: Record<string, string> = {
      milestone: "a major life milestone",
      anniversary: "a meaningful anniversary",
      farewell: "a farewell or life transition",
      illness: "facing serious illness",
      celebration: "a joyful celebration",
      memorial: "in memory and honor",
      just_because: "an expression of love and appreciation",
    };

    const systemPrompt = `You are a deeply empathetic storyteller helping people create profound, personal multimedia stories for their loved ones. You write with emotional intelligence, literary beauty, and genuine warmth. Your stories feel like they were written by someone who truly knows and loves the recipient.`;

    const userPrompt = `Create a rich, beautiful story presentation for the following:

- FROM: ${senderName}
- TO: ${recipientName}  
- RELATIONSHIP: ${relationship}
- OCCASION: ${occasionDescriptions[occasion] || occasion}
- DESIRED TONE: ${toneDescriptions[tone] || tone}
${personalNote ? `- PERSONAL NOTE FROM SENDER: "${personalNote}"` : ""}
- NUMBER OF MEMORIES: ${files.length} photos and videos were shared

I'm going to show you up to 10 of the photos. Please create a story that:
1. Has a compelling, personal TITLE (for ${recipientName}, from ${senderName})
2. An opening verse or poem (4-6 lines) that captures the essence of their relationship
3. 6-8 STORY CHAPTERS — each chapter has:
   - A chapter title (evocative, poetic)
   - A narrative paragraph (3-5 sentences, deeply personal, referencing what the images might show)
   - An "image caption" suggestion (what this image moment might represent)
4. A closing MESSAGE — a final heartfelt paragraph from ${senderName} to ${recipientName}
5. A CLOSING VERSE (4 lines)

Respond ONLY in this exact JSON format:
{
  "title": "Story title here",
  "subtitle": "A short subtitle",
  "openingVerse": "Line 1\\nLine 2\\nLine 3\\nLine 4",
  "chapters": [
    {
      "title": "Chapter title",
      "narrative": "Paragraph text here...",
      "imageCaption": "Caption for this image moment"
    }
  ],
  "closingMessage": "Final heartfelt message...",
  "closingVerse": "Line 1\\nLine 2\\nLine 3\\nLine 4"
}`;

    // Build message content with images
    const messageContent: any[] = [
      { type: "text", text: userPrompt },
    ];

    // Add up to 10 images
    for (const img of imageBlobs.slice(0, 10)) {
      messageContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type: img.mediaType,
          data: img.data,
        },
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: messageContent }],
    });

    const rawText = response.content[0].type === "text" ? response.content[0].text : "";
    
    // Parse JSON from response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse story from AI response");
    }
    const storyContent = JSON.parse(jsonMatch[0]);

    // Save to KV store
    const storyId = uuidv4();
    const storyData = {
      id: storyId,
      content: storyContent,
      settings,
      mediaUrls: uploadedUrls,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`story:${storyId}`, JSON.stringify(storyData), { ex: 60 * 60 * 24 * 365 }); // 1 year

    return NextResponse.json({ storyId, success: true });
  } catch (error: any) {
    console.error("Story generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate story" },
      { status: 500 }
    );
  }
}

export const config = {
  api: { bodyParser: false },
};
