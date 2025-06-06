const API_BASE = 'http://localhost:3000';

const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');

async function loadTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.textContent = task.title;
  li.dataset.id = task._id;
  li.classList.add('task-item');
  if (task.completed) {
    li.classList.add('completed');
  }

  // Strike-through on click
  li.addEventListener('click', async () => {
    await fetch(`${API_BASE}/tasks/${task._id}`, { method: 'PUT' });
    loadTasks();
  });

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.className = 'delete-btn';
  deleteBtn.addEventListener('click', async (e) => {
    e.stopPropagation(); // prevent strike-through when deleting
    await fetch(`${API_BASE}/tasks/${task._id}`, { method: 'DELETE' });
    loadTasks();
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  taskInput.value = '';
  loadTasks();
});

loadTasks();
