# 🌸 Digital Doula

> *A companion for life's most meaningful transitions*

Digital Doula helps people approaching pivotal life stages create rich, heartfelt multimedia stories from their photos and videos — beautifully crafted "what you mean to me" and "our life together" narratives to share with the people they love most.

## ✨ Features

- **📱 iPhone Camera Roll Import** — Select 25–50 photos and videos directly from your device
- **🤖 AI-Generated Narration** — Claude AI weaves your media into a personalized, emotionally resonant story
- **🎞️ Cinematic Slideshow** — Animated, immersive presentation with smooth transitions
- **🔗 Shareable Links** — Generate a unique link your loved ones can open on any device
- **📄 PDF Export** — Download a beautifully formatted keepsake document
- **🎬 Video Export** — Export your story as a shareable video file

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| AI | Anthropic Claude API |
| Storage | Vercel Blob |
| Database | Vercel KV |
| Hosting | Vercel |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Vercel account
- Anthropic API key

### Installation

```bash
git clone https://github.com/your-org/digital-doula.git
cd digital-doula
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
KV_URL=your_vercel_kv_url
KV_REST_API_URL=your_vercel_kv_rest_url
KV_REST_API_TOKEN=your_vercel_kv_rest_token
KV_REST_API_READ_ONLY_TOKEN=your_vercel_kv_readonly_token
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

### Deploy to Vercel

```bash
vercel deploy
```

## 📁 Project Structure

```
digital-doula/
├── app/
│   ├── page.tsx                  # Landing page
│   ├── create/page.tsx           # Story creation flow
│   ├── story/[id]/page.tsx       # Story viewer
│   ├── shared/[id]/page.tsx      # Public shared story
│   └── api/
│       ├── generate-story/       # AI narration endpoint
│       └── share/                # Share link generation
├── components/
│   ├── MediaUploader.tsx
│   ├── StoryViewer.tsx
│   ├── ShareModal.tsx
│   └── ExportOptions.tsx
└── lib/
    ├── claude.ts
    ├── storage.ts
    └── story.ts
```

## 📜 License

MIT © Digital Doula
# Update
