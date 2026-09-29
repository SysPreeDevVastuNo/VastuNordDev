"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";
import Reveal from "@/components/ui/Reveal";

type Billing = "monthly" | "annual";

const billingOptions: { key: Billing; label: string }[] = [
  { key: "monthly", label: "Monthly" },
  { key: "annual", label: "Annual" },
];

const plans = [
  {
    name: "Free",
    tagline: "For a first decision you want to get right.",
    price: () => "€0",
    suffix: () => "forever",
    features: [
      "One visualization per space",
      "Two style directions",
      "Standard resolution exports",
      "Save one active project",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Pro",
    tagline: "For renovations, listings and client work.",
    price: (b: Billing) => (b === "annual" ? "€19" : "€24"),
    suffix: (b: Billing) => (b === "annual" ? "/ month, billed yearly" : "/ month, billed monthly"),
    features: [
      "Unlimited visualizations",
      "All style directions and custom prompts",
      "Side-by-side comparison boards",
      "High-resolution exports",
      "Unlimited saved projects and revisions",
      "Shareable links for clients and buyers",
    ],
    cta: "Go Pro",
    featured: true,
  },
];

export default function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <Section id="plans" padded={false} className="py-20 lg:py-28">
      <PageContainer>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-[768px]">
            <p className="eyebrow text-stone-500">Plans</p>
            <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
              Pay for possibilities, not per render.
            </h2>
          </Reveal>
          <Reveal delay={60} className="shrink-0">
            <div role="tablist" className="inline-flex gap-1 rounded-full border border-stone-200 bg-stone-50 p-1">
              {billingOptions.map((option) => {
                const active = option.key === billing;
                return (
                  <button
                    key={option.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setBilling(option.key)}
                    className={clsx(
                      "rounded-full px-4 py-2 text-sm leading-5 transition-colors",
                      active ? "bg-brand-teal text-white" : "text-stone-600 hover:text-brand-teal"
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className="pt-3 text-sm leading-5 text-stone-500">Annual billing saves about 20%.</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {plans.map((plan, i) => (
            <Reveal
              as="article"
              key={plan.name}
              delay={i * 80}
              className={clsx(
                "flex flex-col rounded-3xl border p-8 lg:p-10",
                plan.featured ? "border-brand-teal bg-brand-teal" : "border-stone-200 bg-white"
              )}
            >
              <div className="flex items-center justify-between">
                <h3
                  className={clsx(
                    "text-xl font-semibold leading-7 tracking-[-0.0135em]",
                    plan.featured ? "text-white" : "text-brand-teal"
                  )}
                >
                  {plan.name}
                </h3>
                {plan.featured && (
                  <span className="rounded-full bg-brand-orange px-3 py-1 text-[11px] font-semibold uppercase leading-[16.5px] tracking-[0.025em] text-white">
                    Most chosen
                  </span>
                )}
              </div>
              <p className={clsx("pt-3 text-sm leading-6", plan.featured ? "text-brand-cream/75" : "text-stone-600")}>
                {plan.tagline}
              </p>
              <p className="flex items-baseline gap-3 pt-8">
                <span
                  className={clsx(
                    "font-heading text-[36px] font-semibold leading-none lg:text-[56px]",
                    plan.featured ? "text-white" : "text-brand-teal"
                  )}
                >
                  {plan.price(billing)}
                </span>
                <span className={clsx("text-sm leading-5", plan.featured ? "text-brand-cream/60" : "text-stone-500")}>
                  {plan.suffix(billing)}
                </span>
              </p>
              <ul
                className={clsx(
                  "mt-8 space-y-3 border-t pt-8",
                  plan.featured ? "border-white/15" : "border-stone-200"
                )}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={clsx(
                      "flex items-start gap-3 text-sm leading-6",
                      plan.featured ? "text-brand-cream/85" : "text-stone-600"
                    )}
                  >
                    <Image src="/icons/check-orange.svg" alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={clsx(
                  "mt-10 flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold leading-5",
                  plan.featured
                    ? "bg-brand-orange text-white hover:bg-brand-orange-dark"
                    : "border border-stone-200 text-brand-teal hover:bg-stone-50"
                )}
              >
                <Image
                  src={plan.featured ? "/icons/arrow-right.svg" : "/icons/arrow-right-navy.svg"}
                  alt=""
                  width={16}
                  height={16}
                />
                {plan.cta}
              </Link>
            </Reveal>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
}
