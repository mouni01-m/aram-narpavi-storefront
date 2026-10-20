import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main-content" className="container not-found-page">
      <p className="eyebrow">404 · Aram Narpavi Herbals</p>
      <h1>Page not found</h1>
      <p>The page you requested could not be found.</p>
      <Link className="underline underline-offset-4" href="/">
        Return to the home page
      </Link>
    </main>
  );
}
