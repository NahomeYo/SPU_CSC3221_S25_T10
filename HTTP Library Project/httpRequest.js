let baseUrl = "https://jsonplaceholder.typicode.com";
let method = document.getElementById("method");
let sendRequest = document.getElementById("send-btn");
let body = document.getElementById("body");
let responseSection = document.getElementById("response");

sendRequest.addEventListener("click", async function (e) {
    e.preventDefault();

    let endpoint = document.getElementById("endpoint").value;

    if (!endpoint) {
        endpoint = "/";
    } else if (!endpoint.startsWith("/")) {
        endpoint = "/" + endpoint;
    }

    let query = document.getElementById("query").value;

    if (!query) {
        query = "";
    } else if (!query.startsWith("?")) {
        query = "?" + query;
    }

    let fullUrl = `${baseUrl}${endpoint}${query}`;
    let response;

    if (method.value === "GET") {
        response = await fetch(fullUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

    } else if (method.value === "POST") {
        response = await fetch(fullUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.parse(body.value)),
        });

    } else if (method.value === "PUT") {
        response = await fetch(fullUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.parse(body.value)),
        })

    } else if (method.value === "DELETE") {
        response = await fetch(fullUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })

    } else if (method.value === "PATCH") {
        response = await fetch(fullUrl, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(JSON.parse(body.value)),
        })
    }

    let data = await response.json();
    responseSection.textContent = JSON.stringify(data, null, 2);
})