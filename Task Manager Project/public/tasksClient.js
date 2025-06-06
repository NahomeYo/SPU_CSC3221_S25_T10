class Client {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
 
    async request(method, endpoint, query = "", body = null) { // body will come from description textarea
        try {
            // Ensure endpoint starts with a slash
            endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
            const expectedEndpointPrefix = "/tasks"; // Define this once
 
            // Add /tasks prefix if it's just an ID or a direct "tasks" input for specific methods
            if (!endpoint.startsWith(expectedEndpointPrefix) && (endpoint.length === 24 || endpoint === "tasks")) {
                endpoint = `${expectedEndpointPrefix}/${endpoint}`;
            } else if (!endpoint.startsWith(expectedEndpointPrefix) && endpoint.length > 0) {
                endpoint = `${expectedEndpointPrefix}/${endpoint}`;
            }
 
 
            query = query && !query.startsWith("?") ? `?${query}` : query;
            const url = `${this.baseUrl}${endpoint}${query}`;
 
            const options = {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
            };
 
            // Declare parsedBody here, outside the conditional block
            let parsedBody = null; // Initialize to null
 
            if (["POST", "PUT"].includes(method)) {
                if (body && body.trim()) { // Only try to parse if body content exists
                    try {
                        parsedBody = JSON.parse(body);
                    } catch (e) {
                        // If JSON.parse fails, assume it's a title string for task creation/update
                        parsedBody = { title: body };
                    }
                    options.body = JSON.stringify(parsedBody);
                } else if (method === "POST") {
                    // For POST, body is usually required unless you have a default on server
                    throw new Error("POST request requires a non-empty body.");
                }
                // If it's a PUT with an empty body but a query, that's handled correctly later.
            }
 
            // Now parsedBody is guaranteed to be declared (even if null) when accessed here
            if (method === "POST") {
                if (endpoint !== expectedEndpointPrefix) {
                    throw new Error(`POST requires the tasks endpoint (e.g., ${expectedEndpointPrefix})`);
                }
 
                if (parsedBody && parsedBody.id) { // This check now works correctly
                    throw new Error("POST no longer needs ID, remove it. Server will handle it");
                }
            }
 
            // The PATCH check should align with your server's PUT logic if you use PUT
            // Your server has app.put('/tasks/:id', ...)
            // So if your HTML sends PUT, this block won't run as it's checking for PATCH
            // If you want to use the 'PATCH' method and its checks:
            // 1. Change <option value="PUT">UPDATE</option> to <option value="PATCH">UPDATE</option> in index.html
            // 2. Change app.put('/tasks/:id') to app.patch('/tasks/:id') in server.js
            // For now, I'm keeping the check as PATCH, but note the mismatch.
            if (method === "PATCH" && !endpoint.startsWith(expectedEndpointPrefix + "/")) {
                throw new Error(`PATCH requires a specific task ID (e.g., ${expectedEndpointPrefix}/<ID>)`);
            }
 
            console.log(`Sending ${method} request to: ${url}`); // Debugging line
            console.log('Request options:', options); // Debugging line
 
 
            const response = await fetch(url, options);
 
            if (response.status === 404) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Resource not found: ${errorData.message || errorData.error || response.statusText}. Check endpoint and ID.`);
            }
 
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${errorData.message || errorData.error || response.statusText}`);
            }
 
            return response.status === 204 ? {} : await response.json();
 
        } catch (error) {
            console.error("API Request Failed:", error);
            return {
                error: "API Request Failed.",
                message: `${error.message} â€” Hint: Make sure the server is running, the endpoint is correct (e.g., /tasks or /tasks/ID), and check your request body format.`,
            };
        }
    }
}
 
const api = new Client("http://localhost:3000");
 
document.getElementById("send-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    const method = document.getElementById("method").value;
    const endpoint = document.getElementById("endpoint").value;
    const query = document.getElementById("query") ? document.getElementById("query").value : "";
    const body = document.getElementById("description").value;
 
    const result = await api.request(method, endpoint, query, body);
    document.getElementById("response").textContent = JSON.stringify(result, null, 2);
});
 
function toggleRequestBody() {
    const method = document.getElementById("method").value;
    const bodySection = document.getElementById("bodySection");
    const endpointInput = document.getElementById("endpoint");
    const descriptionTextarea = document.getElementById("description");
 
    bodySection.style.display = ["POST", "PUT"].includes(method) ? "block" : "none";
 
    if (method === "POST") {
        endpointInput.value = "/tasks";
        endpointInput.disabled = true;
        descriptionTextarea.placeholder = `{
  "title": "Task Title",
  "completed": false
}`;
    } else {
        endpointInput.disabled = false;
        descriptionTextarea.placeholder = `{
  "title": "Task Title",
  "completed": false
}`;
    }
}
window.onload = toggleRequestBody;
 