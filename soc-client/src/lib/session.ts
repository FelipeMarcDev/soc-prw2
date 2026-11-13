const KEY = "soc.usuarioId";

let atual: string | null = null;

export function getUsuarioId(): string | null {
  if (atual === null) loadUsuarioId();
  return atual;
}

export function setUsuarioId(id: string | null) {
  atual = id;
  try {
    if (id) localStorage.setItem(KEY, id);
    else localStorage.removeItem(KEY);
  } catch {
    // sem localStorage (SSR/modo privado): segue só em memória
  }
}

export function loadUsuarioId(): string | null {
  try {
    atual = localStorage.getItem(KEY);
  } catch {
    atual = null;
  }
  return atual;
}
