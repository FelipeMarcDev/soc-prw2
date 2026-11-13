import { API_URL, Usuario } from "@/lib/config";

export const usersApi = {
  async list(): Promise<Usuario[]> {
    const response = await fetch(`${API_URL}/users`, { cache: "no-store" });
    if (!response.ok) throw new Error("Erro ao carregar usuários");
    return response.json();
  },
};
