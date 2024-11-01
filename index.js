const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3030;

let dailyWord = null;
let lastUpdated = null;

app.use(express.static("./"));

// Function to load the daily word from a file
const loadDailyWord = () => {
  if (fs.existsSync("dailyWord.json")) {
    const data = JSON.parse(fs.readFileSync("dailyWord.json", "utf8"));
    dailyWord = data.word;
    lastUpdated = new Date(data.date);
  } else {
    updateDailyWord();
  }
};

// Function to update the daily word and save it to a file
const updateDailyWord = () => {
  const words = ["apple", "banana", "cherry", "date", "elderberry"];
  dailyWord = words[Math.floor(Math.random() * words.length)];
  lastUpdated = new Date();
  fs.writeFileSync(
    "dailyWord.json",
    JSON.stringify({ word: dailyWord, date: lastUpdated })
  );
};

// Middleware to check if we need to update the daily word
app.use((req, res, next) => {
  const now = new Date();
  if (!dailyWord || now.getDate() !== lastUpdated.getDate()) {
    updateDailyWord();
  }
  next();
});

// Route to get the daily word
app.get("/word", (req, res) => {
  res.json({ word: dailyWord });
});

// Load the word initially
loadDailyWord();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
