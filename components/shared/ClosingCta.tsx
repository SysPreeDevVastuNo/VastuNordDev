import Image from "next/image";
import Button from "@/components/ui/Button";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

/**
 * Closing call-to-action banner shared by every page: a full-bleed photo under
 * a warm dark overlay, with a left-aligned 576px copy column (Figma: Home
 * "07 — Get Started", Pricing, Resources, Contact, Features).
 */
export default function ClosingCta({
  eyebrow,
  title,
  description,
  image,
  primaryLabel,
  primaryHref,
  primaryIcon = "/icons/upload.svg",
  secondaryLabel,
  secondaryHref,
  secondaryIcon = "/icons/arrow-up-right.svg",
}: {
  eyebrow: string;
  title: string;
  description: string;
  /** Background photo; pages without one yet render the overlay colour alone. */
  image?: string;
  primaryLabel: string;
  primaryHref: string;
  primaryIcon?: string;
  secondaryLabel: string;
  secondaryHref: string;
  secondaryIcon?: string;
}) {
  return (
    <Section padded={false} className="pb-16 lg:pb-24">
      <PageContainer>
        <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-700">
          {image && (
            <Image src={image} alt="" fill sizes="(min-width: 1280px) 1168px, 100vw" className="object-cover" />
          )}
          <div className="relative bg-stone-900/72 px-6 py-16 lg:px-16 lg:py-36">
            <div className="max-w-[576px]">
              <p className="eyebrow text-white/70">{eyebrow}</p>
              <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-white sm:text-[44px] xl:text-[52px]">
                {title}
              </h2>
              <p className="mt-5 max-w-[448px] leading-7 text-white/80">{description}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button href={primaryHref} className="w-full sm:w-auto">
                  <Image src={primaryIcon} alt="" width={16} height={16} />
                  {primaryLabel}
                </Button>
                <Button href={secondaryHref} variant="ghost" className="w-full sm:w-auto">
                  <Image src={secondaryIcon} alt="" width={16} height={16} />
                  {secondaryLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
