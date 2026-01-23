import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Braces, Copy, Check, Trash2, Minimize2, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const JsonFormatter = () => {
  const [input, setInput] = useLocalStorage("jsonformatter_input", "");
  const [output, setOutput] = useLocalStorage("jsonformatter_output", "");
  const [error, setError] = useLocalStorage("jsonformatter_error", "");
  const [copied, setCopied] = useState(false);

  const formatJson = (minify = false) => {
    try {
      const parsed = JSON.parse(input);
      const formatted = minify 
        ? JSON.stringify(parsed) 
        : JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
      toast.success(minify ? "JSON minified!" : "JSON formatted!");
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
      setOutput("");
    }
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
    setError("");
  };

  const sampleJson = `{
  "name": "DevTools",
  "version": "1.0.0",
  "features": ["json", "base64", "lists", "sql"],
  "active": true
}`;

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gradient-cyan to-gradient-blue mb-4">
          <Braces className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Beautify, validate, and minify your JSON data
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="gradient" onClick={() => formatJson(false)}>
          <Maximize2 className="h-4 w-4" />
          Format
        </Button>
        <Button variant="secondary" onClick={() => formatJson(true)}>
          <Minimize2 className="h-4 w-4" />
          Minify
        </Button>
        <Button variant="secondary" onClick={() => setInput(sampleJson)}>
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
          <label className="text-sm font-medium text-foreground">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="code-editor h-[400px]"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Output</label>
            {output && (
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
            )}
          </div>
          {error ? (
            <div className="code-editor h-[400px] border-2 border-destructive/50 bg-destructive/5 text-destructive">
              {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="code-editor h-[400px]"
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default JsonFormatter;
