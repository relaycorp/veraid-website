import { useEffect, useState, useRef } from "react";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface TOCProps {
  headings: Heading[];
}

export function TableOfContentsReact({ headings }: TOCProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const toc = headings.filter((heading) => heading.depth > 1 && heading.depth < 4);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries.filter((entry) => entry.isIntersecting);

      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].target.id);
      } else if (window.scrollY < 50 && toc.length > 0) {
        setActiveId(toc[0].slug);
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: "0px 0px -40% 0px", // Negative bottom margin makes headings activate sooner
      threshold: 0.2,
    });

    const article = document.querySelector("article");

    if (!article) {
      return;
    }

    const headingElements = article.querySelectorAll("h2, h3");

    if (headingElements.length === 0) {
      return;
    }

    headingElements.forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  if (toc.length === 0) {
    return null;
  }

  return (
    <aside className="sticky top-8 overflow-auto px-4 pt-3 lg:pt-0 pb-4 mb-8 max-h-[calc(60vh-8rem)] lg:max-h-[calc(100vh-8rem)] scrollbar bg-neutral-800 lg:bg-black rounded-md">
      <nav>
        <h2 className="text-lg mb-4">On this page</h2>
        <ul className="space-y-3 font-['Noto_Sans']">
          {toc.map((heading) => {
            const isActive = heading.slug === activeId;
            const isLevel3 = heading.depth === 3;

            return (
              <li key={heading.slug} className={`toc-item`}>
                <a
                  href={`#${heading.slug}`}
                  className={`
                    block text-xs transition-colors duration-200
                    hover:!text-green-200
                    hover:!no-underline
                    ${isLevel3 ? "ml-4" : ""}
                    ${isActive ? "text-green-300 font-medium" : "!text-neutral-300"}
                  `}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
