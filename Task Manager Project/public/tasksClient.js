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

const api = new tasksServer("http://localhost:3000"); // ✅ Correct class name

document.getElementById("send-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    const method = document.getElementById("method").value;
    const endpoint = document.getElementById("endpoint").value;
    const query = document.getElementById("query").value;
    const body = document.getElementById("description").value;

    const result = await api.request(method, endpoint, query, body);
    document.getElementById("response").textContent = JSON.stringify(result, null, 2);
});