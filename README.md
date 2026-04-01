# LinguaCards

LinguaCards is a beginner-friendly MERN flashcard app for language learning. It includes authentication, role-based access control, decks, official beginner decks, CSV import, tags, study sessions, and flashcard study/review tools.

## Current Features
- Registration and login with JWT authentication
- Admin and standard user roles
- Flashcard CRUD with ownership rules
- Deck management
- Official Beginner Decks for admin-managed shared content
- CSV and tab-separated flashcard import with preview and validation
- Tag support
- Study sessions with saved session summaries
- Proficiency tracking and reset actions
- Dark mode toggle

## Folder Structure
```text
Cis4004-main/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |   |-- FilterBar.jsx
|   |   |   |-- FlashcardForm.jsx
|   |   |   `-- ProtectedRoute.jsx
|   |   |-- context/
|   |   |   `-- AuthContext.jsx
|   |   |-- pages/
|   |   |   |-- AddFlashcardPage.jsx
|   |   |   |-- DashboardPage.jsx
|   |   |   |-- DecksPage.jsx
|   |   |   |-- EditFlashcardPage.jsx
|   |   |   |-- FlashcardListPage.jsx
|   |   |   |-- ImportFlashcardsPage.jsx
|   |   |   |-- LoginPage.jsx
|   |   |   |-- OfficialBeginnerDecksPage.jsx
|   |   |   |-- RegisterPage.jsx
|   |   |   |-- StudySessionPage.jsx
|   |   |   `-- UnauthorizedPage.jsx
|   |   |-- services/
|   |   |   `-- flashcardService.js
|   |   |-- utils/
|   |   |   `-- importUtils.js
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- config/
|   |   `-- db.js
|   |-- controllers/
|   |   |-- authController.js
|   |   |-- deckController.js
|   |   |-- flashcardController.js
|   |   |-- studySessionController.js
|   |   `-- tagController.js
|   |-- middleware/
|   |   `-- authMiddleware.js
|   |-- models/
|   |   |-- Deck.js
|   |   |-- Flashcard.js
|   |   |-- StudySession.js
|   |   |-- Tag.js
|   |   `-- User.js
|   |-- routes/
|   |   |-- authRoutes.js
|   |   |-- deckRoutes.js
|   |   |-- flashcardRoutes.js
|   |   |-- studySessionRoutes.js
|   |   `-- tagRoutes.js
|   |-- seed/
|   |   `-- seedFlashcards.js
|   |-- .env
|   |-- package.json
|   `-- server.js
|-- .gitignore
`-- README.md
```

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

## Local Run Checklist
1. MongoDB is running
2. `server/.env` is set
3. `client/.env` is set
4. Backend is running on port `5000`
5. Frontend is running on Vite

## Notes
- GitHub Pages cannot run the full MERN app because the backend and database still need a separate host.
- Standard users manage their own content.
- Admin users can manage official decks and broader system content.
