const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const connectDB = require('../config/db');
const Flashcard = require('../models/Flashcard');
const User = require('../models/User');
const Deck = require('../models/Deck');
const Tag = require('../models/Tag');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    const passwordHash = await bcrypt.hash('admin123', 10);
    let adminUser = await User.findOne({ username: 'admin' });

    if (!adminUser) {
      adminUser = await User.create({
        username: 'admin',
        passwordHash,
        role: 'admin'
      });
    }

    await Flashcard.deleteMany();
    await Deck.deleteMany();
    await Tag.deleteMany();

    const [greetingsDeck, essentialsDeck, animalsDeck, officialBeginnerDeck] = await Deck.create([
      { name: 'Greetings', language: 'French', description: 'Useful opening phrases', owner: adminUser._id },
      { name: 'Essentials', language: 'Spanish', description: 'Everyday must-know words', owner: adminUser._id },
      { name: 'Animals', language: 'Japanese', description: 'Animal vocabulary', owner: adminUser._id },
      {
        name: 'Official Spanish Beginner Basics',
        language: 'Spanish',
        description: 'Starter vocabulary curated by LinguaCards admins.',
        isOfficial: true,
        level: 'beginner',
        owner: adminUser._id
      }
    ]);

    const [commonTag, politeTag, nounTag] = await Tag.create([
      { name: 'Common', owner: adminUser._id },
      { name: 'Polite', owner: adminUser._id },
      { name: 'Noun', owner: adminUser._id }
    ]);

    await Flashcard.insertMany([
      {
        wordOrPhrase: 'Bonjour',
        translation: 'Hello',
        owner: adminUser._id,
        deck: greetingsDeck._id,
        language: 'French',
        category: greetingsDeck.name,
        tags: [commonTag._id],
        exampleSentence: 'Bonjour, comment allez-vous ?',
        proficiency: 2
      },
      {
        wordOrPhrase: 'Gracias',
        translation: 'Thank you',
        owner: adminUser._id,
        deck: essentialsDeck._id,
        language: 'Spanish',
        category: essentialsDeck.name,
        tags: [commonTag._id, politeTag._id],
        exampleSentence: 'Gracias por tu ayuda.',
        proficiency: 3
      },
      {
        wordOrPhrase: '犬 (Inu)',
        translation: 'Dog',
        owner: adminUser._id,
        deck: animalsDeck._id,
        language: 'Japanese',
        category: animalsDeck.name,
        tags: [nounTag._id],
        exampleSentence: 'あの犬はかわいいです。',
        proficiency: 1
      },
      {
        wordOrPhrase: 'Hola',
        translation: 'Hello',
        owner: adminUser._id,
        deck: officialBeginnerDeck._id,
        language: 'Spanish',
        category: officialBeginnerDeck.name,
        tags: [commonTag._id],
        exampleSentence: 'Hola, ¿cómo estás?',
        proficiency: 1
      }
    ]);
    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedData();
