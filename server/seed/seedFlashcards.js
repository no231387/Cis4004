const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Flashcard = require('../models/Flashcard');

dotenv.config();

const sampleFlashcards = [
  {
    wordOrPhrase: 'Bonjour',
    translation: 'Hello',
    language: 'French',
    category: 'Greetings',
    exampleSentence: 'Bonjour, comment allez-vous ?',
    proficiency: 2
  },
  {
    wordOrPhrase: 'Gracias',
    translation: 'Thank you',
    language: 'Spanish',
    category: 'Politeness',
    exampleSentence: 'Gracias por tu ayuda.',
    proficiency: 3
  },
  {
    wordOrPhrase: '犬 (Inu)',
    translation: 'Dog',
    language: 'Japanese',
    category: 'Animals',
    exampleSentence: 'あの犬はかわいいです。',
    proficiency: 1
  }
];

const seedData = async () => {
  try {
    await connectDB();
    await Flashcard.deleteMany();
    await Flashcard.insertMany(sampleFlashcards);
    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();
