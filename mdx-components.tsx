import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: (props) => <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight" {...props} />,
    h3: (props) => <h3 className="mt-8 mb-3 text-lg font-semibold" {...props} />,
    p: (props) => <p className="mb-5 leading-relaxed text-muted" {...props} />,
    ul: (props) => <ul className="mb-5 list-disc space-y-2 pl-5 text-muted" {...props} />,
    strong: (props) => <strong className="font-semibold text-fg" {...props} />,
    ...components,
  };
}
