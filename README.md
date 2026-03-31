# LinguaCards - MERN Flashcard Learning App

## Project Description
LinguaCards is a beginner-friendly full-stack MERN web application for language vocabulary practice. Users can create, read, update, delete, filter, and study flashcards with simple proficiency tracking.

## Features
- Full CRUD for flashcards
- Flashcard fields:
  - word or phrase
  - translation
  - language
  - category/topic
  - example sentence
  - proficiency level (1-5)
  - date created
- Study mode:
  - One flashcard at a time
  - Reveal translation
  - Rate knowledge (1-5)
  - Simple proficiency update formula
- Filtering by language, category, and proficiency
- React single-page navigation with React Router

## Technologies Used
- **MongoDB** + Mongoose
- **Express.js**
- **React** (Vite)
- **Node.js**
- Axios for API requests

## Folder Structure
```text
Cis4004/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── README.md
```

## Setup Instructions
### 1) Clone and install dependencies
```bash
# in project root
cd server && npm install
cd ../client && npm install
```

### 2) Configure environment variables
Create `.env` files from examples:

```bash
# server/.env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/language_flashcards

# client/.env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3) Run MongoDB
Make sure your MongoDB server is running locally (or update MONGODB_URI to a cloud MongoDB instance).

### 4) Seed sample data (optional)
```bash
cd server
npm run seed
```

### 5) Run the backend server
```bash
cd server
npm run dev
```

### 6) Run the frontend client
```bash
cd client
npm run dev
```

### 7) Open the app
Vite will show a local URL (typically `http://localhost:5173`).

## API Overview
- `GET /api/flashcards`
- `GET /api/flashcards/:id`
- `POST /api/flashcards`
- `PUT /api/flashcards/:id`
- `DELETE /api/flashcards/:id`
- `PATCH /api/flashcards/:id/proficiency`

## Notes for Assignment Demo
- Demonstrates complete MERN CRUD architecture
- Includes separated client/server structure
- Uses reusable React components and route-based pages
- Keeps logic simple and easy to explain
