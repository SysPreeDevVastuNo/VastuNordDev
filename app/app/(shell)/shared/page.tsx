import SharedHub from "@/app/app/(shell)/shared/SharedHub";

// E-S Shared: `/app/shared`, optionally on `?tab=downloads` or `?tab=activity`.
export default async function SharedPage({ searchParams }: PageProps<"/app/shared">) {
  const { tab } = await searchParams;
  return <SharedHub initialTab={tab === "downloads" || tab === "activity" ? tab : "links"} />;
}
