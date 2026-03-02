"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3"
          style={{ background: 'radial-gradient(circle, var(--blush), transparent)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-15 translate-y-1/3 -translate-x-1/4"
          style={{ background: 'radial-gradient(circle, var(--sage), transparent)' }} />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body mb-8"
            style={{ background: 'var(--parchment)', color: 'var(--terra)', border: '1px solid var(--blush)' }}>
            <span>🌸</span>
            <span style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, letterSpacing: '0.1em' }}>A gift only you can give</span>
          </div>

          <h1 className="font-display mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 300, lineHeight: 1.1, color: 'var(--charcoal)' }}>
            Tell the story<br />
            <em style={{ color: 'var(--terra)' }}>they deserve to hear</em>
          </h1>

          <p className="mb-12 max-w-xl mx-auto" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '1.1rem', lineHeight: 1.8, color: '#6B6560' }}>
            Select your most cherished photos and videos. Let AI help you weave them into a beautiful, 
            heartfelt story — a lasting keepsake for the people who matter most.
          </p>

          <button
            onClick={() => router.push("/create")}
            className="px-10 py-4 rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ 
              background: 'var(--terra)', 
              fontFamily: 'Jost, sans-serif', 
              fontWeight: 400, 
              letterSpacing: '0.05em',
              fontSize: '1rem'
            }}
          >
            Begin your story →
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20" style={{ background: 'var(--parchment)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-center mb-16" style={{ fontSize: '2.5rem', fontWeight: 400, color: 'var(--charcoal)' }}>
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: '01', title: 'Choose your memories', desc: 'Select 25–50 photos and videos from your camera roll that tell your story.' },
              { num: '02', title: 'Shape the narrative', desc: 'Tell us who this is for and what you want them to know. AI crafts the words.' },
              { num: '03', title: 'Share with love', desc: 'Send a private link, download a keepsake PDF, or export a video to treasure forever.' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col items-start">
                <span className="font-display mb-4" style={{ fontSize: '3rem', fontWeight: 300, color: 'var(--blush)' }}>{step.num}</span>
                <h3 className="font-display mb-3" style={{ fontSize: '1.4rem', fontWeight: 400, color: 'var(--charcoal)' }}>{step.title}</h3>
                <p style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, color: '#6B6560', lineHeight: 1.7 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center" style={{ fontFamily: 'Jost, sans-serif', fontWeight: 300, fontSize: '0.85rem', color: '#9B9590' }}>
        <span>🌸 Digital Doula — Made with tenderness</span>
      </footer>
    </main>
  );
}
