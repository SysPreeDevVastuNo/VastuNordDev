"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Section from "@/components/layout/Section";
import PageContainer from "@/components/layout/PageContainer";

const subjects = ["Product Support", "Sales", "Partnerships", "Feedback"] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Tell us your name."),
  email: z.email("Enter a valid email address."),
  subject: z.enum(subjects, "Choose a topic."),
  message: z.string().trim().min(10, "A sentence or two helps us route this."),
});

type Field = keyof z.infer<typeof schema>;
type Errors = Partial<Record<Field, string>>;

export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = schema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));
    if (!result.success) {
      const next: Errors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as Field;
        next[field] ??= issue.message;
      }
      setErrors(next);
      setSent(false);
      return;
    }
    // No messaging backend yet — acknowledge locally.
    setErrors({});
    setSent(true);
    event.currentTarget.reset();
  }

  // Clear a field's error as soon as the visitor edits it.
  const clear = (field: Field) => () => {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <Section id="contact-form" tone="offwhite" padded={false} className="border-y border-stone-200 py-20 lg:py-28">
      <PageContainer>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[484fr_604fr] lg:gap-20 [&>*]:min-w-0">
          <div>
            <p className="eyebrow text-stone-500">03 — Send Us a Message</p>
            <h2 className="mt-4 text-[30.4px] font-semibold leading-[1.08] tracking-[-0.0135em] text-brand-teal sm:text-[44px] xl:text-[52px]">
              Tell us about the decision.
            </h2>
            <p className="max-w-[576px] pt-5 leading-7 text-stone-600">
              A photograph, a deadline, or a rough idea is enough to get a useful answer.
            </p>
          </div>

          <form
            noValidate
            onSubmit={handleSubmit}
            className="space-y-5 self-start rounded-3xl border border-stone-200 bg-white p-7 lg:p-9"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Name"
                name="name"
                placeholder="Mira Lindqvist"
                autoComplete="name"
                error={errors.name}
                onChange={clear("name")}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@studio.com"
                autoComplete="email"
                error={errors.email}
                onChange={clear("email")}
              />
            </div>
            <Select
              label="Subject"
              name="subject"
              options={[...subjects]}
              error={errors.subject}
              onChange={clear("subject")}
            />
            <Textarea
              label="Message"
              name="message"
              placeholder="We're renovating a 1970s kitchen and need to choose between two directions…"
              error={errors.message}
              onChange={clear("message")}
            />
            {/* Figma: 35px from the textarea to the button (20 row gap + 15). */}
            <div className="flex flex-wrap items-center gap-4 pt-[15px]">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-orange px-5 py-3 text-sm font-semibold leading-5 text-white transition-colors hover:bg-brand-orange-dark"
              >
                <Image src="/icons/send.svg" alt="" width={16} height={16} />
                Send Message
              </button>
              <p aria-live="polite" className="text-sm leading-5 text-brand-teal empty:hidden">
                {sent && "Thanks — we'll be in touch soon."}
              </p>
            </div>
          </form>
        </div>
      </PageContainer>
    </Section>
  );
}
