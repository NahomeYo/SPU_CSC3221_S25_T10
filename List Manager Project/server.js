const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "data.json";

// This function is to read the data file
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// This function is to write to the data file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// The GET /users (Read all users)
app.get("/users", (req, res) => {
  const users = readData();
  res.json(users);
});

// The POST /users (Create a new user)
app.post("/users", (req, res) => {
  const users = readData();
  const newUser = req.body;

  // When a POST is made this will generate a new unique ID for all POST
  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  newUser.id = newId;

  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});