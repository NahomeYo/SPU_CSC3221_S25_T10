<<<<<<< HEAD
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
=======
class tasksServer {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(method, endpoint, query = "", body = null) {
        try {
            endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
            query = query && !query.startsWith("?") ? `?${query}` : query;
            const url = `${this.baseUrl}${endpoint}${query}`;

            const options = {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            };

            if (["POST", "PUT", "PATCH"].includes(method)) {
                if (!body?.trim()) {
                    throw new Error("Request body cannot be empty");
                }

                let parsedBody = JSON.parse(body);

                if (method === "POST") {
                    if (endpoint.includes("/api/tasks")) {
                        throw new Error("POST requires the tasks endpoint (e.g., /api/tasks");
                    }

                    if (parsedBody.id) {
                        throw new Error("POST no longer needs ID, remove it. Server will handle it")
                        delete parsedBody.id;
                    }
                }

                options.body = JSON.stringify(parsedBody);

                if (method === "PATCH" && !endpoint.match(/\/\d+$/)) {
                    throw new Error("PATCH requires a specific task ID (e.g., /tasks/1)");
                }

                if (method === "PUT" && !endpoint.match(/\/\d+$/)) {
                    throw new Error("PUT requires a specific task ID (e.g., /tasks/1)");
                }
            }

            const response = await fetch(url, options);

            if (response.status === 404) {
                throw new Error(`Resource not found: ${endpoint}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return response.status === 204 ? {} : await response.json();

        } catch (error) {

            return {
                error: "API Request Failed.",
                message: `${error.message} — Hint: Make sure the server is running and the endpoint is correct.`,

            };
            
        }
    }
}

const api = new Client("http://localhost:3000");

document.getElementById("send-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    const method = document.getElementById("method").value;
    const endpoint = document.getElementById("endpoint").value;
    const query = document.getElementById("query").value;
    const body = document.getElementById("body").value;

    const result = await api.request(method, endpoint, query, body);
    document.getElementById("response").textContent = JSON.stringify(result, null, 2);
});
>>>>>>> 3aba826d9ab1a83a0e958e30328ee48f2d5cf45e
