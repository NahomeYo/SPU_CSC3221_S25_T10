const Task = require('./models/task');

async function getTasks() {
  return await Task.find();
}

module.exports = { getTasks };
