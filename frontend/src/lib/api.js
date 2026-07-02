const defaultBaseUrl = `${window.location.origin}/api`;

function resolveBaseUrl() {
	return (import.meta.env.VITE_API_URL || defaultBaseUrl).replace(/\/$/, "");
}

export async function request(path, options = {}) {
	const baseUrl = resolveBaseUrl();
	const headers = new Headers(options.headers || {});

	headers.set("Accept", "application/json");

	const token = localStorage.getItem("cinetix_token");
	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	const fetchOptions = {
		method: options.method || "GET",
		headers,
	};

	if (options.body !== undefined) {
		headers.set("Content-Type", "application/json");
		fetchOptions.body = JSON.stringify(options.body);
	}

	const response = await fetch(`${baseUrl}${path}`, fetchOptions);

	if (response.status === 401) {
		localStorage.removeItem("cinetix_token");
		localStorage.removeItem("cinetix_user");
		localStorage.removeItem("loggedIn");
		localStorage.removeItem("loggedUser");
		if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
			window.location.href = "/login";
		}
		throw new Error("Session expired. Please log in again.");
	}

	const contentType = response.headers.get("content-type") || "";
	const payload = contentType.includes("application/json")
		? await response.json()
		: await response.text();

	if (!response.ok) {
		const message =
			payload && typeof payload === "object"
				? payload.message || payload.error || "Request failed"
				: "Request failed";

		throw new Error(message);
	}

	return payload;
}

export const api = {
	get: (path, options) => request(path, { ...options, method: "GET" }),
	post: (path, body, options) => request(path, { ...options, method: "POST", body }),
	put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
	del: (path, options) => request(path, { ...options, method: "DELETE" }),
};
