import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ListChecks, Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const ListComparator = () => {
  const [listA, setListA] = useLocalStorage("listcomparator_listA", "");
  const [listB, setListB] = useLocalStorage("listcomparator_listB", "");
  const [results, setResults] = useLocalStorage<{
    common: string[];
    onlyA: string[];
    onlyB: string[];
  } | null>("listcomparator_results", null);
  const [copied, setCopied] = useState<string | null>(null);

  const compare = () => {
    const itemsA = new Set(
      listA.split("\n").map((s) => s.trim()).filter(Boolean)
    );
    const itemsB = new Set(
      listB.split("\n").map((s) => s.trim()).filter(Boolean)
    );

    const common = [...itemsA].filter((x) => itemsB.has(x));
    const onlyA = [...itemsA].filter((x) => !itemsB.has(x));
    const onlyB = [...itemsB].filter((x) => !itemsA.has(x));

    setResults({ common, onlyA, onlyB });
    toast.success("Lists compared!");
  };

  const copyList = async (items: string[], label: string) => {
    await navigator.clipboard.writeText(items.join("\n"));
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setListA("");
    setListB("");
    setResults(null);
  };

  const loadSample = () => {
    setListA("apple\nbanana\ncherry\ndate\nelderberry");
    setListB("banana\ncherry\nfig\ngrape\ndate");
  };

  const ResultSection = ({
    title,
    items,
    color,
    label,
  }: {
    title: string;
    items: string[];
    color: string;
    label: string;
  }) => (
    <div className="rounded-xl bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${color}`} />
          <span className="font-medium text-foreground">{title}</span>
          <span className="text-sm text-muted-foreground">({items.length})</span>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyList(items, label)}
          >
            {copied === label ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      <div className="max-h-40 overflow-y-auto">
        {items.length > 0 ? (
          <ul className="space-y-1">
            {items.map((item, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground font-mono bg-secondary px-2 py-1 rounded"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground italic">No items</p>
        )}
      </div>
    </div>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gradient-orange to-gradient-yellow mb-4">
          <ListChecks className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">List Comparator</h1>
        <p className="text-muted-foreground">
          Compare two lists and find common, unique, or missing items
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="gradientSecondary" onClick={compare}>
          Compare Lists
        </Button>
        <Button variant="secondary" onClick={loadSample}>
          Load Sample
        </Button>
        <Button variant="ghost" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Lists Input */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">List A (one item per line)</label>
          <textarea
            value={listA}
            onChange={(e) => setListA(e.target.value)}
            placeholder="Enter items, one per line..."
            className="code-editor h-[250px]"
            spellCheck={false}
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">List B (one item per line)</label>
          <textarea
            value={listB}
            onChange={(e) => setListB(e.target.value)}
            placeholder="Enter items, one per line..."
            className="code-editor h-[250px]"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Results</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultSection
              title="Common Items"
              items={results.common}
              color="bg-gradient-cyan"
              label="Common"
            />
            <ResultSection
              title="Only in List A"
              items={results.onlyA}
              color="bg-gradient-orange"
              label="Only A"
            />
            <ResultSection
              title="Only in List B"
              items={results.onlyB}
              color="bg-gradient-pink"
              label="Only B"
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ListComparator;
