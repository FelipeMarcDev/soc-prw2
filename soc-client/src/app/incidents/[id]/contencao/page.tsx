import ContencaoPanel from "@/components/incidents/ContencaoPanel";

export default async function ContencaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Ações de contenção</h1>
      <ContencaoPanel id={id} />
    </main>
  );
}
