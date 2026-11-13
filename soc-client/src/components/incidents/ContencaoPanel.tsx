"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { incidentsApi } from "@/lib/api/incidents";
import { AcaoContencao } from "@/lib/config";

export default function ContencaoPanel({ id }: { id: string }) {
  const router = useRouter();
  const [acoes, setAcoes] = React.useState<AcaoContencao[]>([]);
  const [descricao, setDescricao] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const carregar = React.useCallback(async () => {
    try {
      setAcoes(await incidentsApi.listarContencoes(id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar as ações.");
    }
  }, [id]);

  React.useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await incidentsApi.adicionarContencao(id, descricao);
      setDescricao("");
      await carregar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao registrar a ação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <p className="text-sm text-slate-500 text-center">
        Este registro é imutável: depois de salvo, nenhuma ação pode ser editada nem apagada.
        É preciso ao menos uma ação para erradicar.
      </p>

      <ul className="space-y-2">
        {acoes.length === 0 ? (
          <li className="text-sm text-slate-500 text-center py-4 border border-dashed rounded-lg">
            Nenhuma ação registrada
          </li>
        ) : (
          acoes.map((a) => (
            <li key={a.id} className="border rounded-lg bg-white p-3 text-sm space-y-1">
              <p>{a.descricao}</p>
              <p className="text-xs text-slate-500">
                {a.autorNome} · {new Date(a.createdAt).toLocaleString("pt-BR")}
              </p>
            </li>
          ))
        )}
      </ul>

      <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white space-y-4 shadow-sm">
        <div>
          <label className="text-xs font-medium text-slate-500">Nova ação de contenção</label>
          <Textarea
            placeholder="ex.: Isolei o host srv-files-01 da rede"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/incidents")}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button type="submit" disabled={loading || descricao.trim().length === 0} className="flex-1">
            {loading ? "Registrando..." : "Registrar ação"}
          </Button>
        </div>
      </form>
    </div>
  );
}
