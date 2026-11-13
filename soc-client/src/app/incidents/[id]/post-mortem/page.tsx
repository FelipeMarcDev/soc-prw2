import PostMortemForm from "@/components/incidents/PostMortemForm";

export default async function PostMortemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-center">Post-mortem</h1>
      <PostMortemForm id={id} />
    </main>
  );
}
