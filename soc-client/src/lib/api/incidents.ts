import { API_URL, Incident, IncidentInput, StatusIncidente } from "@/lib/config";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Erro ao comunicar com o servidor";
    try {
      const body = await response.json();
      message = Array.isArray(body.message) ? body.message.join(", ") : body.message ?? message;
    } catch {}
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const incidentsApi = {
  list: () => request<Incident[]>("/incidents"),
  get: (id: string) => request<Incident>(`/incidents/${id}`),
  create: (data: IncidentInput) =>
    request<Incident>("/incidents", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: IncidentInput) =>
    request<Incident>(`/incidents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  updateStatus: (id: string, status: StatusIncidente) =>
    request<Incident>(`/incidents/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  remove: (id: string) => request<void>(`/incidents/${id}`, { method: "DELETE" }),
};
