import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Callout as FumadocsCallout } from 'fumadocs-ui/components/callout';

// Callout customizado com altura aumentada
const CustomCallout = (props: React.ComponentProps<typeof FumadocsCallout>) => {
  return <FumadocsCallout {...props} className={`min-h-[120px] py-6 ${props.className || ''}`} />;
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout: CustomCallout,
    ...components,
  };
}
