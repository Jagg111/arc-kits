// ============================================================================
// FILE: components/layout/Footer.tsx
// PURPOSE: Minimal site footer with fan-project disclaimer and credits.
// USED BY: App.tsx
// ============================================================================

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle py-4 px-4">
      <div className="max-w-6xl mx-auto text-center text-xs text-text-muted">
        A fan project built by{" "}
        <a
          href="https://www.mitchelburton.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-text hover:text-accent-hover transition-colors"
        >
          Mitchel Burton
        </a>
        {" "} with AI tooling
        <span className="mx-2 text-border">&middot;</span>
        Credit to {" "}
        <a
          href="https://www.youtube.com/@Doomeris"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-text hover:text-accent-hover transition-colors"
        >
          Doomeris
        </a>
        {" "} for attachment recommendations and weapon insights
      </div>
    </footer>
  );
}
