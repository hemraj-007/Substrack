type LoaderProps = {
  className?: string;
  label?: string;
  size?: "sm" | "md";
  decorative?: boolean;
};

type LoadingStateProps = {
  title?: string;
  className?: string;
  fullScreen?: boolean;
};

export function Loader({
  className = "",
  label = "Loading",
  size = "md",
  decorative = false,
}: LoaderProps) {
  const sizeClass = size === "sm" ? "h-5 w-5" : "h-7 w-7";

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role={decorative ? undefined : "status"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
    >
      <span className="relative inline-flex">
        <span className={`${sizeClass} rounded-full border border-[var(--accent-subtle)]`} />
        <span
          className={`absolute inset-0 ${sizeClass} animate-spin rounded-full border-2 border-transparent border-t-[var(--accent)] border-r-[var(--accent-2)]`}
          aria-hidden
        />
      </span>
      {!decorative && <span className="sr-only">{label}</span>}
    </div>
  );
}

export function LoadingState({
  title = "Loading workspace",
  className = "",
  fullScreen = false,
}: LoadingStateProps) {
  const content = (
    <div
      className={`inline-flex items-center gap-3 rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3 text-[var(--muted)] shadow-sm backdrop-blur-md ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader label={title} size="sm" decorative />
      <p className="text-sm font-medium">{title}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[240px] items-center justify-center px-2">
      {content}
    </div>
  );
}
