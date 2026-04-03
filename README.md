# LinguaCards

LinguaCards is a beginner-friendly MERN flashcard app for language learning. It includes authentication, role-based access control, decks, official beginner decks, CSV import, tags, study sessions, and flashcard study/review tools.

## Current Features
- Registration and login with JWT authentication
- Admin and standard user roles
- Flashcard CRUD with ownership rules and real-time search
- Deck management
- Official Beginner Decks for admin-managed shared content
- CSV and tab-separated flashcard import with preview and validation
- Tag support
- Study sessions with saved session summaries
- Premade study sessions based on decks, tags, and learning progress
- Custom study session builder with deck, tag, proficiency, size, and shuffle controls
- Inline flashcard creation and management from the Flashcards page
- Redesigned dashboard, navigation, and profile summary panel
- Proficiency tracking and reset actions
- Dark mode toggle

## Recent UX Updates
- Flashcards page now supports live search as you type
- Flashcards page includes an inline Quick Add flow
- Navigation includes a profile panel with cards, decks, and study-session counts
- Study workflow now starts from a setup screen before entering review mode
- Home page has a simplified dashboard and quick access actions

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/no231387/Cis4004.git
cd Cis4004
```

### 2. Install dependencies
```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create or update these files:

`server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/language_flashcards
JWT_SECRET=your_jwt_secret_here
```

`client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Notes:
- `JWT_SECRET` is strongly recommended for auth.
- If you use MongoDB Atlas instead of local MongoDB, replace `MONGODB_URI` with your Atlas connection string.

### 4. Start MongoDB
Make sure MongoDB is running before starting the backend.

### 5. Start the backend
```bash
cd server
npm run dev
```

### 6. Start the frontend
```bash
cd client
npm run dev
```

### 7. Open the app
Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Optional: Seed Sample Data
```bash
cd server
npm run seed
```

## Main API Areas
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/flashcards`
- `POST /api/flashcards/import`
- `GET /api/decks`
- `GET /api/decks/official-beginner`
- `GET /api/tags`
- `GET /api/study-sessions`
