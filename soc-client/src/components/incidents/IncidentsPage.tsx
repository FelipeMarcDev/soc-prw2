"use client";

import React from "react";
import Link from "next/link";
import { IncidentCard } from "./IncidentCard";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { incidentsApi } from "@/lib/api/incidents";
import { Incident, StatusIncidente } from "@/lib/config";

export default function IncidentsPage() {
  const [incidents, setIncidents] = React.useState<Incident[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [toDelete, setToDelete] = React.useState<Incident | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchIncidents = React.useCallback(async () => {
    try {
      setIncidents(await incidentsApi.list());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar incidentes.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  async function handleAdvance(id: string, status: StatusIncidente) {
    try {
      await incidentsApi.updateStatus(id, status);
      await fetchIncidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao avançar o incidente.");
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await incidentsApi.remove(toDelete.id);
      setToDelete(null);
      await fetchIncidents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir o incidente.");
      setToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <section className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">SOC · Gestão de Incidentes de Segurança</h1>
        <p className="text-slate-500">
          Alerta → Qualificação da Ameaça → Contenção Temporária → Erradicação → Pós-Morte
        </p>
      </section>

      <section className="space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Fila de Incidentes</h2>
          <Link
            href="/incidents/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 font-medium text-white hover:bg-slate-700"
          >
            Novo incidente
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg p-3">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-slate-500 text-center py-6 border border-dashed rounded-lg">
            Carregando...
          </p>
        ) : incidents.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6 border border-dashed rounded-lg">
            Nenhum incidente registrado no momento
          </p>
        ) : (
          incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onAdvance={handleAdvance}
              onDelete={setToDelete}
            />
          ))
        )}
      </section>

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir incidente"
        description={`Tem certeza que deseja excluir "${toDelete?.title ?? ""}"? Esta ação não pode ser desfeita.`}
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </main>
  );
}
