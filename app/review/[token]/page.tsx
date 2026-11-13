import type { Metadata } from "next";
import ClientReview from "@/app/review/[token]/ClientReview";

export const metadata: Metadata = {
  title: "For your review · VastuNord",
  robots: { index: false },
};

// E-S2 The page a client opens from a review link: `/review/<token>`. No account needed.
export default async function ReviewPage({ params }: PageProps<"/review/[token]">) {
  const { token } = await params;
  return <ClientReview key={token} token={token} />;
}
