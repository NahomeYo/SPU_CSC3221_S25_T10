class Client {
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
                    if (endpoint !== "/users") {
                        throw new Error("POST requires the user endpoint (e.g., /users");
                    }

                    if (parsedBody.id) {
                        throw new Error("POST no longer needs ID, remove it. Server will handle it")
                    }
                }

                options.body = JSON.stringify(parsedBody);

                if (method === "PATCH" && !endpoint.match(/\/\d+$/)) {
                    throw new Error("PATCH requires a specific user ID (e.g., /users/1)");
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
                error: "API Request Failed",
                message: error.message,
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
