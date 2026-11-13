import ShareDetail from "@/app/app/(shell)/shared/[id]/ShareDetail";

// E-S2 / E-S3 One review link: `/app/shared/<id>`.
export default async function SharePage({ params }: PageProps<"/app/shared/[id]">) {
  const { id } = await params;
  return <ShareDetail key={id} shareId={id} />;
}
