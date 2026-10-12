type Props = {
  eyebrow: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  className?: string;
  narrow?: boolean;
  children?: React.ReactNode;
};

/**
 * A page section that the mold trail visits. On desktop the content is inset so
 * the trail has its own gutter; the eyebrow dot in that gutter is the trail node.
 */
export function Section({ eyebrow, title, intro, id, className = "", narrow, children }: Props) {
  return (
    <section
      id={id}
      data-trail-section
      className={`mx-auto ${narrow ? "max-w-4xl" : "max-w-7xl"} px-4 py-20 md:px-8 md:py-28 ${className}`}
    >
      <div className="relative md:pl-14">
        <span
          data-trail-node
          className="absolute top-[0.3rem] left-0 size-2 rounded-full border border-muted max-md:opacity-0 md:left-[3px]"
        />
        <p className="font-mono text-xs tracking-widest text-muted uppercase">{eyebrow}</p>
        {title && <h2 className="mt-5 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-5xl">{title}</h2>}
        {intro && <p className="mt-5 max-w-2xl text-lg text-muted">{intro}</p>}
        {children && <div className="mt-12">{children}</div>}
      </div>
    </section>
  );
}
