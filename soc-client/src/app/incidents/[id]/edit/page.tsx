import EditIncident from "@/components/incidents/EditIncident";

export default async function EditIncidentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Alterar incidente</h1>
      <EditIncident id={id} />
    </main>
  );
}
