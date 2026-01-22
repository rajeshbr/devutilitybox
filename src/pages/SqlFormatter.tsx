import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Database, Copy, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";

// Simple SQL formatter
function formatSQL(sql: string): string {
  const keywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
    "INNER JOIN", "OUTER JOIN", "ON", "GROUP BY", "ORDER BY", "HAVING",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "CREATE TABLE",
    "ALTER TABLE", "DROP TABLE", "LIMIT", "OFFSET", "UNION", "UNION ALL",
    "AS", "DISTINCT", "IN", "NOT IN", "IS NULL", "IS NOT NULL", "LIKE",
    "BETWEEN", "CASE", "WHEN", "THEN", "ELSE", "END", "COUNT", "SUM", "AVG",
    "MIN", "MAX", "ASC", "DESC"
  ];

  let formatted = sql.trim();

  // Normalize whitespace
  formatted = formatted.replace(/\s+/g, " ");

  // Add newlines before major keywords
  const majorKeywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "LEFT JOIN", "RIGHT JOIN",
    "INNER JOIN", "OUTER JOIN", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
    "UNION", "UNION ALL", "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM"
  ];

  majorKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${keyword}`);
  });

  // Uppercase all SQL keywords
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "gi");
    formatted = formatted.replace(regex, keyword);
  });

  // Indent lines after SELECT, FROM, WHERE, etc.
  const lines = formatted.split("\n").filter((line) => line.trim());
  const indented = lines.map((line, i) => {
    const trimmed = line.trim();
    if (i === 0) return trimmed;
    if (/^(AND|OR)/.test(trimmed)) return "    " + trimmed;
    if (/^(SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|JOIN|LEFT|RIGHT|INNER|OUTER)/.test(trimmed)) {
      return trimmed;
    }
    return "    " + trimmed;
  });

  return indented.join("\n");
}

const SqlFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    if (!input.trim()) {
      toast.error("Please enter some SQL to format");
      return;
    }
    const formatted = formatSQL(input);
    setOutput(formatted);
    toast.success("SQL formatted!");
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setOutput("");
  };

  const loadSample = () => {
    setInput(
      "select u.id, u.name, u.email, count(o.id) as order_count from users u left join orders o on u.id = o.user_id where u.active = true and o.created_at > '2024-01-01' group by u.id, u.name, u.email order by order_count desc limit 10"
    );
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gradient-purple to-gradient-blue mb-4">
          <Database className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">SQL Formatter</h1>
        <p className="text-muted-foreground">
          Beautify and format SQL queries for better readability
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="gradientPurple" onClick={format}>
          Format SQL
        </Button>
        <Button variant="secondary" onClick={loadSample}>
          Load Sample
        </Button>
        <Button variant="ghost" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Editors */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Input SQL</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your SQL query here..."
            className="code-editor h-[400px]"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Formatted SQL</label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Formatted SQL will appear here..."
            className="code-editor h-[400px]"
            spellCheck={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default SqlFormatter;
