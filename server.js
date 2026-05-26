const express = require("express");
const cron = require("node-cron");
const fs = require("fs");
const simpleGit = require("simple-git");

const app = express();
const git = simpleGit();

const PORT = 3000;

// Home Route
app.get("/", (req, res) => {
  res.send("GitHub Contribution Bot Running 🚀");
});

// Daily Commit Function
async function makeCommit() {
  const time = new Date().toISOString();

  fs.appendFileSync("log.txt", `Commit at ${time}\n`);

  try {
    await git.add("./*");
    await git.commit(`Auto commit ${time}`);
    await git.push("origin", "main");

    console.log("✅ Commit pushed");
  } catch (err) {
    console.log("❌ Error:", err);
  }
}

// Runs every day at 10 PM
cron.schedule("0 22 * * *", () => {
  console.log("Running auto commit...");
  makeCommit();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
