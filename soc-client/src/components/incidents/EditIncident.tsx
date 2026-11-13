"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IncidentForm } from "./IncidentForm";
import { incidentsApi } from "@/lib/api/incidents";
import { Incident } from "@/lib/config";

export default function EditIncident({ id }: { id: string }) {
  const router = useRouter();
  const [incident, setIncident] = React.useState<Incident | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    incidentsApi
      .get(id)
      .then(setIncident)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Erro ao carregar o incidente."),
      );
  }, [id]);

  if (error) {
    return <p className="text-sm text-red-600 text-center py-6">{error}</p>;
  }
  if (!incident) {
    return <p className="text-sm text-slate-500 text-center py-6">Carregando...</p>;
  }

  return (
    <IncidentForm
      initialValues={{
        title: incident.title,
        description: incident.description,
        fonteAlerta: incident.fonteAlerta,
        ativoAfetado: incident.ativoAfetado,
        analista: incident.analista,
        severidade: incident.severidade,
      }}
      ocultarSeveridade
      submitLabel="Salvar alterações"
      submittingLabel="Salvando..."
      onCancel={() => router.push("/incidents")}
      onSubmit={async (data) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { severidade, ...descritivos } = data;
        await incidentsApi.update(id, descritivos);
        router.push("/incidents");
        router.refresh();
      }}
    />
  );
}
