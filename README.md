# Orari
Orari is a smart AI-powered calendar web app designed for busy students. It combines event scheduling, category-based organization, and AI-generated time suggestions into a single, clean interface — built to feel as simple as Google Calendar but smarter.

**Live Demo:** https://orari.vercel.app

---

## Features
- **Unified Calendar Dashboard** — View all your events in month, week, or day view
- **Category Manager** — Create, edit, and toggle custom calendar categories (Academic, Work, Fitness, Social, Personal)
- **AI Suggestions** — Get AI-generated time block recommendations based on your existing schedule
- **Add / Edit Events** — Create events with category tags, reminders, and recurring options
- **Notifications & Alerts** — Manage upcoming reminders and notification preferences
- **Fully Responsive** — Works on both desktop and mobile browsers

---

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Calendar UI | React Big Calendar |
| Routing | React Router |
| AI | Claude API (claude-sonnet-4-20250514) |
| Storage | localStorage |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Installation
1. Clone the repository

   git clone https://github.com/your-username/orari.git
   cd orari

2. Install dependencies

   npm install

3. Duplicate .env.example, rename it to .env, and add your Claude API key

4. Start the development server

   npm run dev

5. Open your browser and go to http://localhost:5173

---

## Project Structure
src/
├── components/        # Reusable UI components
├── pages/             # Route-level page components
│   ├── Calendar.jsx
│   ├── Categories.jsx
│   ├── Suggestions.jsx
│   ├── Alerts.jsx
│   └── Profile.jsx
├── constants/         # Shared placeholder data and default values
├── context/           # React Context for shared state
├── App.jsx
└── main.jsx

---

## Deployment
This project is deployed on Vercel. To deploy your own instance:

1. Push your repo to GitHub
2. Go to https://vercel.com and import the repository
3. Add VITE_CLAUDE_API_KEY as an environment variable in the Vercel project settings
4. Deploy — Vercel handles everything else automatically

---

## Team
Built as part of an HCI course project.

- Project Manager / Design — [Ethan Fitzgerald](https://github.com/Fitzophrenic)
- Frontend Lead — [ADD NAME HERE](https://github.com/username)
- Category Manager — [ADD NAME HERE](https://github.com/username)
- AI Integration — [ADD NAME HERE](https://github.com/username)

---

## Notes
This project was built as part of an HCI course. Data is stored in localStorage and does not persist across devices or browsers. No backend or database is used in this version.

---

## License
MIT
