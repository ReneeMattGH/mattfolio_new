export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 ambient-grid opacity-80" />
      <div className="absolute inset-0 grain opacity-[0.025]" />
    </div>
  );
}
