import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import Placeholder from "@/components/ui/Placeholder";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

export default function ClosingCta({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
}) {
  return (
    <Section tone="cream">
      <PageContainer size="narrow">
        <div className="relative overflow-hidden rounded-3xl">
          <Placeholder label={eyebrow} className="aspect-[16/9] w-full" />
          <div className="absolute inset-0 bg-brand-navy/65" />
          <div className="relative z-10 flex flex-col items-center px-6 py-16 text-center">
            <SectionHeader eyebrow={eyebrow} title={title} description={description} tone="dark" constrain={false} />
            <div className="cta-group mt-8 justify-center">
              <Button href={primaryHref}>{primaryLabel}</Button>
              <Button href={secondaryHref} variant="secondary">
                {secondaryLabel}
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
