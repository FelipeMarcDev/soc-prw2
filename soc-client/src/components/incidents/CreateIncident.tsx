"use client";

import { useRouter } from "next/navigation";
import { IncidentForm } from "./IncidentForm";
import { incidentsApi } from "@/lib/api/incidents";

export default function CreateIncident() {
  const router = useRouter();

  return (
    <IncidentForm
      submitLabel="Registrar Incidente"
      submittingLabel="Registrando..."
      onCancel={() => router.push("/incidents")}
      onSubmit={async (data) => {
        await incidentsApi.create(data);
        router.push("/incidents");
        router.refresh();
      }}
    />
  );
}
