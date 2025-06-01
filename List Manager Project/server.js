const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DATA_FILE = "data.json";

// For correct property order in responses
function formatUser(user) {
  if (!user || typeof user !== 'object') return user;
  
  // Create new object with EXACT property order
  const formatted = {};
  formatted.id = user.id;
  if (user.name) formatted.name = user.name;
  if (user.username) formatted.username = user.username;
  if (user.email) formatted.email = user.email;
  
  
  return formatted;
}

// ENSURE ALL RESPONSES ARE FORMATTED
app.use((req, res, next) => {
  const originalJson = res.json;
  res.json = function(data) {
    if (Array.isArray(data)) {
      data = data.map(formatUser);
    } else {
      data = formatUser(data);
    }
    originalJson.call(this, data);
  };
  next();
});

// READ/WRITE WITH STRICT FORMATTING
function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data).map(formatUser);
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  const formatted = data.map(formatUser);
  fs.writeFileSync(DATA_FILE, JSON.stringify(formatted, null, 2));
}

// ROUTES
app.get("/users", (req, res) => {
  res.json(readData());
});

app.get("/users/:id", (req, res) => {
  const user = readData().find(u => u.id === parseInt(req.params.id));
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

app.post("/users", (req, res) => {
  const users = readData();
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = formatUser({ id: newId, ...req.body });
  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});
// PUT: Replace user entirely
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const users = readData();
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const updatedUser = formatUser({ id, ...req.body });
  users[index] = updatedUser;
  writeData(users);
  res.json(updatedUser);
});

// PATCH: Update part of a user
app.patch("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const users = readData();
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  Object.assign(user, req.body);
  writeData(users);
  res.json(user);
});

// DELETE: Remove user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let users = readData();
  console.log("Before deletion:", users); // Debugging

  const initialLength = users.length;
  users = users.filter(u => u.id !== id);

  if (users.length === initialLength) {
      return res.status(404).json({ error: "User not found" });
  }

  writeData(users);
  console.log("After deletion:", users); // Debugging

  res.json({ message: `User ${id} deleted` });
});




// Start server with clean data file if needed
if (!fs.existsSync(DATA_FILE)) writeData([]);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));