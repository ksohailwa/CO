// --- START OF FILE client/src/lib/api.ts ---
/**
 * A generic fetch function for making API requests.
 * It automatically handles headers, JSON parsing, and error responses.
 * @param endpoint - The API endpoint to call (e.g., '/api/auth/login').
 * @param options - Optional fetch options (method, body, etc.).
 * @returns A promise that resolves with the JSON response.
 * @throws An error with a user-friendly message if the request fails.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: Omit<RequestInit, 'body'> & { body?: any } = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    (defaultHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    // If the server provides a message, use it. Otherwise, use a default.
    const errorMessage = data.message || `API error: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return data as T;
}
// --- END OF FILE client/src/lib/api.ts ---