import { contactDetails } from "@/lib/content/information-pages";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9Zm4.5 3.25A4.75 4.75 0 1 1 7.25 12 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 14.75 12 2.75 2.75 0 0 0 12 9.25Zm5.25-3.5a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3a22 22 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3v2.3H7.4V14h2.8v8h3.3Z" />
    </svg>
  );
}

export function SocialLinks() {
  return (
    <ul className="social-links" aria-label="Aram Narpavi Herbals on social media">
      <li>
        <a href={contactDetails.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram, opens in a new tab">
          <InstagramIcon />
        </a>
      </li>
      {contactDetails.facebookUrl ? (
        <li>
          <a href={contactDetails.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook, opens in a new tab">
            <FacebookIcon />
          </a>
        </li>
      ) : null}
    </ul>
  );
}
