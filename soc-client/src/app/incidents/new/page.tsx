import CreateIncident from "@/components/incidents/CreateIncident";

export default function NewIncidentPage() {
  return (
    <main className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Novo incidente</h1>
      <CreateIncident />
    </main>
  );
}
