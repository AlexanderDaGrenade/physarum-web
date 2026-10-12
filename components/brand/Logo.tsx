import { LOGO_VIEWBOX, MARK_PATH, MARK_VIEWBOX, WORD_PATH } from "./logo-paths";

type Props = { className?: string; title?: string };

/** Full lockup (mark + wordmark) in currentColor, so it follows the theme. */
export function Logo({ className, title = "Physarum" }: Props) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} fill="currentColor" role="img" aria-label={title}>
      <path d={MARK_PATH} />
      <path d={WORD_PATH} />
    </svg>
  );
}

export function LogoMark({ className, title = "Physarum" }: Props) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} fill="currentColor" role="img" aria-label={title}>
      <path d={MARK_PATH} />
    </svg>
  );
}
