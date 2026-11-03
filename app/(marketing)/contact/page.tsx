import ContactHero from "@/components/contact/ContactHero";
import HelpRouting from "@/components/contact/HelpRouting";
import ContactForm from "@/components/contact/ContactForm";
import ContactFaq from "@/components/contact/ContactFaq";
import ClosingCta from "@/components/shared/ClosingCta";

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <HelpRouting />
      <ContactForm />
      <ContactFaq />
      <ClosingCta
        eyebrow="05 — Let's Build the Future of Spatial Visualization"
        image="/images/cta/living-room.jpg"
        title="Let's build the future of spatial visualization."
        description="Start with one space, one decision, one clear possibility."
        primaryLabel="Start Visualizing"
        primaryHref="/pricing"
        secondaryLabel="Browse Resources"
        secondaryHref="/resources"
      />
    </>
  );
}
