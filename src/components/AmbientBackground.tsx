export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px circle at 12% -8%, rgba(143,180,255,0.11), transparent 62%), radial-gradient(760px circle at 92% 40%, rgba(143,227,192,0.06), transparent 68%), radial-gradient(900px circle at 38% 108%, rgba(242,199,143,0.055), transparent 70%)',
        }}
      />
      <div className="ambient-grid absolute inset-0 opacity-70" />
      <div className="grain absolute inset-0 opacity-[0.03]" />
    </div>
  );
}
