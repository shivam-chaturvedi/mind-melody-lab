# Melody Matrix - AI-Powered Music Therapy

A premium React + TypeScript web application that generates personalized therapeutic music using AI. Built with modern best practices, responsive design, and delightful micro-interactions.

## 🎨 Design System

**Colors:**
- Primary: `#7C4DFF` (Purple)
- Secondary: `#FF4081` (Pink)
- Gradient: Purple → Pink

**Features:**
- HSL color system for perfect theming
- Smooth animations and transitions
- Responsive mobile-first design
- Semantic tokens throughout

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📁 Architecture

```
src/
├── components/          # Reusable UI components
│   ├── AudioPlayer.tsx
│   ├── FeatureCard.tsx
│   ├── IssueCard.tsx
│   ├── InstrumentCard.tsx
│   ├── IntensitySlider.tsx
│   └── ProgressIndicator.tsx
├── pages/              # Routed pages
│   ├── Home.tsx        # Landing page
│   ├── Assessment.tsx  # 3-step wizard + results
│   └── About.tsx       # Mission, science, team
├── store/              # Global state (Zustand)
│   └── assessmentStore.ts
├── services/           # API integration
│   └── beatoven.ts     # Music generation (mock + real hooks)
└── components/ui/      # shadcn UI components
```

## 🎵 Key Features

### Home Page
- Animated hero with gradient
- 3 feature cards
- Dual CTAs to Assessment and About

### Assessment Wizard
**Step 1:** Issue Selection (Anxiety, Depression, Relationship, Stress, Sleep)  
**Step 2:** Intensity Assessment (5 sliders, 0-4 scale)  
**Step 3:** Instrument & Tempo Selection  
**Results:** Audio player + feedback + confetti celebration

### About Page
- Mission statement
- Science of music therapy
- Team profiles
- Contact information

## 🔌 Music generation via Beatoven

Melody Matrix composes therapeutic music using Beatoven.ai's Track Composition API. The controller in `src/services/beatoven.ts` POSTs a prompt, polls the returned task_id, and returns the `meta.track_url` once Beatoven transitions from `composing` → `running` → `composed`. For the full request/response details, see [docs/beatoven.md](docs/beatoven.md).

Set `VITE_BEATOVEN_API_TOKEN` in your `.env` so the app can add the required `Authorization: Bearer <token>` header to every request. Keep the token secret and avoid committing it to source control.

## 🎯 State Management

Using **Zustand** with persistence:
- Assessment state persists across page reloads
- Wizard navigation state
- User selections and generated tracks
- Reset functionality

## ✨ Animations

- Fade-in, scale, and slide transitions
- Gradient shifts on hero text
- Hover effects on cards
- Pulse glow on active elements
- Confetti on music generation success

## 🎨 Design System Tokens

All colors, shadows, and gradients defined in:
- `src/index.css` - CSS variables
- `tailwind.config.ts` - Tailwind extensions

**Never use hardcoded colors!** Always use semantic tokens:
- ✅ `bg-primary` `text-secondary`
- ❌ `bg-purple-500` `text-pink-400`

## 🧪 Testing

Built-in console logging for API calls and state changes.

Recommended testing flow:
1. Navigate through all wizard steps
2. Try different issue/instrument combinations
3. Test audio playback
4. Verify state persistence (refresh page mid-wizard)
5. Test responsive layouts on mobile

## 📱 Responsive Design

Breakpoints follow Tailwind defaults:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

All layouts adapt fluidly with mobile-first approach.

## 🚀 Production Deployment

1. Update `beatoven.ts` with real API integration
2. Set environment variables
3. Build: `npm run build`
4. Deploy `dist/` folder to your hosting platform

## 🎵 Future Enhancements

- User accounts and saved tracks
- Social sharing of music
- Expanded instrument library
- Playlist creation
- Progress tracking over time
- Integration with wearables

## 📄 License

© 2025 Melody Matrix. All rights reserved.

---

**Built with:** React, TypeScript, Vite, Tailwind CSS, Zustand, Radix UI, Lucide Icons
