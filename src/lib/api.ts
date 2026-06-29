/**
 * Typed fetch wrapper — all API calls go through here.
 * Automatically attaches the JWT token from localStorage and sets
 * Content-Type to application/json (skipped for FormData uploads).
 */

const BASE = import.meta.env.VITE_API_URL || ''; // Same-origin; Vite proxies /api → Express in dev

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('civic_token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Don't set Content-Type for FormData — browser sets it with the multipart boundary
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(BASE + url, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get<T>(url: string): Promise<T> {
    return request<T>(url);
  },
  post<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, { method: 'POST', body: JSON.stringify(body) });
  },
  patch<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, { method: 'PATCH', body: JSON.stringify(body) });
  },
  /** For multipart/form-data file uploads */
  upload<T>(url: string, formData: FormData): Promise<T> {
    return request<T>(url, { method: 'POST', body: formData });
  },
};
