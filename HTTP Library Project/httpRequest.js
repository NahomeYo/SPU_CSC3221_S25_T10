/**  HTTP Request Library
 * This is a class for making HTTP request. Like get, post, Put, patch and delete.
 * The rest is to handle API error handling and JASON support
 * Construct initialize the base URL for API endpoint support (  Endpoint is a section of together all users and ID)
*/
class HTTPRequest {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
   // ==========================================
      // SUBSECTION: URL FORMATTING
      // Ensures Endpoint and query are correctly formatted.
      // ==========================================
    async request(method, endpoint, query = "", body = null) {
      try {
        endpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        query = query && !query.startsWith("?") ? `?${query}` : query;
        const url = `${this.baseUrl}${endpoint}${query}`;
  
        const options = {
          method,
          headers: { "Content-Type": "application/json" },
        };
  
        if (["POST", "PUT", "PATCH"].includes(method)) {
          if (!body?.trim()) throw new Error("Request body cannot be empty");
          options.body = JSON.stringify(JSON.parse(body)); 
        }
  
        const response = await fetch(url, options);


        if (method === "PATCH" && !endpoint.match(/\/\d+$/)) {
            throw new Error("PATCH requires a specific user ID (e.g., /users/1)");
        }
        
        // User does not exist 404 
        if (response.status === 404) {
          throw new Error(`Resource not found: ${endpoint}`);
        }
  
        // Handle other http errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
  
        // Return parsed JSON or empty object for DELETE
        return response.status === 204 ? {} : await response.json();
  
      } catch (error) {
        
        // make the respone look nice 
        return { 
          error: "API Request Failed",
          message: error.message,
          suggestion: method === "PATCH" 
          ? "First find the user with GET /users?name=..., then PATCH to /users/[ID]" 
          : " ID not Correct"        };
      }
    }
  }

// ==============================================
// SECTION: INITIALIZATION AND EVENT BINDING
// Connects the library to the UI (unchanged from original).
// ==============================================
  const api = new HTTPRequest("https://jsonplaceholder.typicode.com");
  document.getElementById("send-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    const method = document.getElementById("method").value;
    const endpoint = document.getElementById("endpoint").value;
    const query = document.getElementById("query").value;
    const body = document.getElementById("body").value;
  
    const result = await api.request(method, endpoint, query, body);
    document.getElementById("response").textContent = JSON.stringify(result, null, 2);
  });