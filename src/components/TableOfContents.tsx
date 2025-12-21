import { List } from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  return (
    <nav className="bg-muted/50 rounded-xl p-6 mb-8 border border-border">
      <h4 className="flex items-center gap-2 text-lg font-semibold mb-4">
        <List className="h-5 w-5" />
        Table of Contents
      </h4>
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li 
            key={item.id}
            className={`${item.level > 2 ? 'ml-4' : ''}`}
          >
            <a
              href={`#${item.id}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="text-xs font-mono text-muted-foreground/60">
                {String(index + 1).padStart(2, '0')}
              </span>
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
