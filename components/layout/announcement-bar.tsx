import Link from "next/link";

/**
 * The track loops across exactly half its copies, so half must be wider than the widest
 * screen. Each copy is about 280px, so 24 copies cover screens up to about 3,300px.
 */
const COPIES = 24;

/**
 * Styles ship with the component, so the strip never renders without them. React hoists
 * and de-duplicates this <style> by its href.
 */
const styles = `
.announcement-bar.contact-strip { display: block; padding: 0; overflow: hidden; }
.contact-strip__link { display: flex; width: 100%; min-height: 2rem; align-items: center; overflow: hidden; color: var(--color-ivory); text-decoration: none; }
.contact-strip__track { display: flex; flex: none; flex-wrap: nowrap; white-space: nowrap; animation: contact-strip-scroll 60s linear infinite; }
.contact-strip__item { display: inline-flex; flex: none; align-items: center; padding-inline: 2.25rem; }
.contact-strip__item::after { content: ""; width: .3rem; height: .3rem; margin-left: 4.5rem; border-radius: 50%; background: var(--color-gold); }
.contact-strip__link:hover .contact-strip__track, .contact-strip__link:focus-visible .contact-strip__track { animation-play-state: paused; }
.contact-strip__link:hover .contact-strip__item { color: #f2d49a; }
.contact-strip__link:focus-visible { outline: 2px solid var(--color-gold); outline-offset: -3px; }
@keyframes contact-strip-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .contact-strip__link { justify-content: center; }
  .contact-strip__track { animation: none; }
  .contact-strip__item:not(:first-child) { display: none; }
  .contact-strip__item::after { display: none; }
}
`;

export function AnnouncementBar() {
  return (
    <div className="announcement-bar contact-strip">
      <style href="contact-strip" precedence="default">{styles}</style>
      <Link className="contact-strip__link" href="/contact" aria-label="Contact Us">
        <span className="contact-strip__track" aria-hidden="true">
          {Array.from({ length: COPIES }, (_, index) => (
            <span className="contact-strip__item" key={index}>Contact Us</span>
          ))}
        </span>
      </Link>
    </div>
  );
}
