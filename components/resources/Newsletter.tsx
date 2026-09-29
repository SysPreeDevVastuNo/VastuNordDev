"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import clsx from "clsx";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const schema = z.object({
  email: z.email("Enter a valid email address."),
});

type Status = { kind: "idle" } | { kind: "error"; message: string } | { kind: "success" };

export default function Newsletter() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse({ email: new FormData(event.currentTarget).get("email") });
    if (!result.success) {
      setStatus({ kind: "error", message: result.error.issues[0].message });
      return;
    }
    // No mailing-list backend yet — acknowledge locally.
    setStatus({ kind: "success" });
    event.currentTarget.reset();
  }

  return (
    <Section padded={false} className="py-20 lg:py-24">
      <PageContainer>
        <div className="grid grid-cols-1 gap-8 rounded-3xl border border-stone-200 bg-brand-cream p-8 lg:grid-cols-[546fr_492fr] lg:items-center lg:p-12 [&>*]:min-w-0">
          <div>
            <p className="eyebrow text-stone-500">04 — Stay Updated</p>
            <h2 className="mt-4 text-[25.6px] font-semibold leading-[1.25] tracking-[-0.0135em] text-brand-teal lg:text-[36px]">
              New guides, quietly, once a month.
            </h2>
            <p className="max-w-[448px] pt-4 text-sm leading-7 text-stone-600">
              Renovation methods, staging comparisons and product updates. No noise.
            </p>
          </div>

          <form noValidate onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label
                className={clsx(
                  "flex flex-1 items-center gap-3 rounded-2xl border bg-white px-4 py-3 transition-colors focus-within:border-brand-teal",
                  status.kind === "error" ? "border-brand-orange" : "border-stone-200"
                )}
              >
                <Image src="/icons/mail.svg" alt="" width={18} height={18} className="shrink-0" />
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@studio.com"
                  autoComplete="email"
                  aria-invalid={status.kind === "error"}
                  aria-describedby="newsletter-status"
                  onChange={() => status.kind !== "idle" && setStatus({ kind: "idle" })}
                  className="min-w-0 rounded-none border-0 bg-transparent p-0 text-sm leading-5 placeholder:text-stone-400 focus:shadow-none"
                />
              </label>
              <button
                type="submit"
                className="rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold leading-5 text-white transition-colors hover:bg-brand-orange-dark"
              >
                Subscribe
              </button>
            </div>
            <p id="newsletter-status" aria-live="polite" className="text-xs leading-4 empty:hidden">
              {status.kind === "error" && <span className="mt-2 block text-brand-orange">{status.message}</span>}
              {status.kind === "success" && <span className="mt-2 block text-brand-teal">You&apos;re on the list.</span>}
            </p>
          </form>
        </div>
      </PageContainer>
    </Section>
  );
}
