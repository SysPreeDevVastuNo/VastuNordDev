import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@/components/app/AppIcons";
import type { LearnArticle } from "@/lib/mock/learn";

export default function LearnCard({ article }: { article: LearnArticle }) {
  return (
    <Link
      href={article.href}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-[border-color,transform] duration-200 ease-out-soft hover:-translate-y-0.5 hover:border-navy/30"
    >
      <div className="relative aspect-video overflow-hidden bg-cream">
        <Image
          src={article.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 72vw"
          className="object-cover transition-transform duration-200 ease-out-soft motion-safe:group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted">
          {article.category} · {article.readMinutes} min read
        </p>
        <h3 className="mt-2 font-display text-[15px] leading-snug font-medium text-navy">{article.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-5 text-body">{article.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-semibold text-ember">
          Read the guide
          <IconArrowUpRight className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
