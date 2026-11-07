"use client";

import Link from "next/link";
import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import { OptionalImage } from "@/components/ui/optional-image";

const MotionLink = m.create(Link);
const ease = [0.22, 1, 0.36, 1] as const;

const cardMotion = {
  rest: { y: 0, boxShadow: "0px 0px 0px rgba(22, 61, 47, 0)", transition: { duration: 0.5, ease } },
  lifted: { y: -6, boxShadow: "0px 18px 36px rgba(22, 61, 47, 0.12)", transition: { duration: 0.5, ease } },
};
const imageMotion = {
  rest: { scale: 1, transition: { duration: 0.9, ease } },
  lifted: { scale: 1.04, transition: { duration: 0.9, ease } },
};

/** Whole-card link with a gentle lift and a slow image scale; both respect reduced-motion. */
export function CollectionCard({ href, title, image, description, count }: {
  href: string;
  title: string;
  image: string;
  description: string;
  count: string;
}) {
  const lift = useReducedMotion() ? undefined : "lifted";
  return (
    <LazyMotion features={domAnimation}>
      <MotionLink className="sale-collection-card" href={href} variants={cardMotion} initial="rest" animate="rest" whileHover={lift} whileFocus={lift}>
        <m.span className="sale-collection-card__media" variants={imageMotion}>
          <OptionalImage src={image} alt="" sizes="(max-width: 1000px) 46vw, 24vw" />
        </m.span>
        <h3>{title}</h3>
        <span className="sale-collection-card__description">{description}</span>
        <span className="sale-collection-card__count">{count}</span>
        <span className="sale-collection-card__explore">
          <span className="sale-collection-card__explore-label">Explore</span>
          <span className="sale-collection-card__explore-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" /></svg>
          </span>
        </span>
      </MotionLink>
    </LazyMotion>
  );
}
