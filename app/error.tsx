"use client";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main id="main-content" className="container error-page">
      <p className="eyebrow">Aram Narpavi Herbals</p>
      <h1>Something went wrong</h1>
      <p>Please try again. If the problem continues, return to the home page and try later.</p>
      <button className="min-h-11 rounded border px-4 py-2 underline underline-offset-4" onClick={retry}>
        Try again
      </button>
    </main>
  );
}
