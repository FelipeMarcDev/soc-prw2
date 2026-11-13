/** 135 -> "2h 15min"; 45 -> "45min"; 120 -> "2h". */
export function formatarMinutos(minutos: number): string {
  const total = Math.abs(minutos);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${String(m).padStart(2, "0")}min`;
}
