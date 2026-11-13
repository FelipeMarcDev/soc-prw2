"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiError, incidentsApi } from "@/lib/api/incidents";
import { PostMortemInput } from "@/lib/config";

const EMPTY: PostMortemInput = {
  causaRaiz: "",
  linhaDoTempo: "",
  licoesAprendidas: "",
  acoesCorretivas: "",
};

const CAMPOS: { key: keyof PostMortemInput; label: string }[] = [
  { key: "causaRaiz", label: "Causa raiz" },
  { key: "linhaDoTempo", label: "Linha do tempo" },
  { key: "licoesAprendidas", label: "Lições aprendidas" },
  { key: "acoesCorretivas", label: "Ações corretivas" },
];

export default function PostMortemForm({ id }: { id: string }) {
  const router = useRouter();
  const [values, setValues] = React.useState<PostMortemInput>(EMPTY);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Se já existe post-mortem, carrega para edição (404 = ainda não existe).
  React.useEffect(() => {
    incidentsApi
      .getPostMortem(id)
      .then((pm) =>
        setValues({
          causaRaiz: pm.causaRaiz,
          linhaDoTempo: pm.linhaDoTempo,
          licoesAprendidas: pm.licoesAprendidas,
          acoesCorretivas: pm.acoesCorretivas,
        }),
      )
      .catch((err) => {
        if (!(err instanceof ApiError && err.status === 404)) {
          setError(err instanceof Error ? err.message : "Erro ao carregar o post-mortem.");
        }
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await incidentsApi.salvarPostMortem(id, values);
      router.push("/incidents");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar o post-mortem.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg bg-white max-w-xl mx-auto space-y-4 text-left shadow-sm"
    >
      {CAMPOS.map(({ key, label }) => (
        <div key={key}>
          <label className="text-xs font-medium text-slate-500">{label}</label>
          <Textarea
            value={values[key]}
            onChange={(e) => setValues((prev) => ({ ...prev, [key]: e.target.value }))}
            required
          />
        </div>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.push("/incidents")}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Salvando..." : "Salvar post-mortem"}
        </Button>
      </div>
    </form>
  );
}
