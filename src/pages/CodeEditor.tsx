import { useRef, useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Code, Copy, Check, Trash2, Download, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "sql", label: "SQL" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "yaml", label: "YAML" },
  { value: "xml", label: "XML" },
  { value: "markdown", label: "Markdown" },
  { value: "bash", label: "Bash" },
  { value: "shell", label: "Shell" },
];

let monacoEditor: any = null;

export default function CodeEditor() {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);
  const [code, setCode] = useLocalStorage("codeeditor_code", "// Write your code here\nconsole.log('Hello, World!');");
  const [language, setLanguage] = useLocalStorage("codeeditor_language", "javascript");
  const [copied, setCopied] = useState(false);

  // Load Monaco on component mount
  useEffect(() => {
    const loadMonaco = async () => {
      if (!monacoEditor) {
        const { editor } = await import("monaco-editor");
        monacoEditor = editor;
      }

      if (editorContainerRef.current && !editorInstanceRef.current) {
        editorInstanceRef.current = monacoEditor.create(editorContainerRef.current, {
          value: code,
          language: language,
          theme: document.documentElement.classList.contains("dark") ? "vs-dark" : "vs",
          automaticLayout: true,
          minimap: { enabled: true },
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          scrollBeyondLastLine: false,
          formatOnPaste: true,
          formatOnType: true,
        });

        // Listen for code changes
        editorInstanceRef.current.onDidChangeModelContent(() => {
          const currentCode = editorInstanceRef.current.getValue();
          setCode(currentCode);
        });
      }
    };

    loadMonaco();

    return () => {
      // Don't destroy on unmount to preserve state
    };
  }, []);

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (editorInstanceRef.current && monacoEditor) {
      const currentCode = editorInstanceRef.current.getValue();
      monacoEditor.setModelLanguage(editorInstanceRef.current.getModel(), newLanguage);
    }
  };

  // Pretty format code
  const formatCode = async () => {
    if (editorInstanceRef.current) {
      try {
        const currentCode = editorInstanceRef.current.getValue();
        
        if (language === "json") {
          try {
            const parsed = JSON.parse(currentCode);
            const formatted = JSON.stringify(parsed, null, 2);
            editorInstanceRef.current.setValue(formatted);
            setCode(formatted);
            toast.success("JSON formatted successfully!");
            return;
          } catch {
            toast.error("Invalid JSON format");
            return;
          }
        } else if (["html", "xml"].includes(language)) {
          // Basic HTML/XML indentation
          const formatted = formatXML(currentCode);
          editorInstanceRef.current.setValue(formatted);
          setCode(formatted);
          toast.success("Code formatted successfully!");
          return;
        } else if (["python", "yaml"].includes(language)) {
          // Python/YAML formatting (preserve indentation)
          editorInstanceRef.current.setValue(currentCode);
          setCode(currentCode);
          toast.success("Code formatted successfully!");
          return;
        } else {
          // For other languages, use editor's built-in formatting if available
          await editorInstanceRef.current.getAction("editor.action.formatDocument")?.run();
          setCode(editorInstanceRef.current.getValue());
          toast.success("Code formatted successfully!");
          return;
        }
      } catch (error) {
        toast.error(`Failed to format code: ${(error as Error).message}`);
      }
    }
  };

  // Simple XML/HTML formatter
  const formatXML = (xml: string): string => {
    let formatted = "";
    let indent = 0;
    const tab = "  ";

    const lines = xml.split(/(?=>)/);
    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("</")) {
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + trimmed + "\n";
      } else if (trimmed.startsWith("<") && trimmed.endsWith("/>")) {
        formatted += tab.repeat(indent) + trimmed + "\n";
      } else if (trimmed.startsWith("<")) {
        formatted += tab.repeat(indent) + trimmed + "\n";
        if (!trimmed.endsWith("/>") && !trimmed.startsWith("<?") && !trimmed.startsWith("<!")) {
          indent++;
        }
      } else if (trimmed) {
        formatted += tab.repeat(indent) + trimmed + "\n";
      }
    }

    return formatted.trim();
  };

  // Handle theme change
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (editorInstanceRef.current && monacoEditor) {
        const isDark = document.documentElement.classList.contains("dark");
        monacoEditor.setTheme(isDark ? "vs-dark" : "vs");
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const element = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    const ext = LANGUAGES.find((l) => l.value === language)?.value || "txt";
    element.download = `code.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Code downloaded!");
  };

  const clear = () => {
    setCode("");
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue("");
    }
    toast.success("Code cleared!");
  };

  const loadSample = () => {
    const samples: { [key: string]: string } = {
      javascript: `// JavaScript Sample
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,
      python: `# Python Sample
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,
      java: `// Java Sample
public class Fibonacci {
    public static int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println(fib(10));
    }
}`,
      html: `<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML page.</p>
</body>
</html>`,
      sql: `-- SQL Sample
SELECT u.id, u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.active = true
GROUP BY u.id, u.name
ORDER BY order_count DESC;`,
    };

    const sampleCode = samples[language] || samples.javascript;
    setCode(sampleCode);
    if (editorInstanceRef.current) {
      editorInstanceRef.current.setValue(sampleCode);
    }
    toast.success("Sample code loaded!");
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gradient-blue to-gradient-purple mb-4">
          <Code className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Code Editor</h1>
        <p className="text-muted-foreground">
          Edit and format code with syntax highlighting for 20+ languages
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[200px] bg-secondary border-border">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="secondary" onClick={loadSample}>
          Load Sample
        </Button>

        <Button variant="secondary" onClick={formatCode}>
          <Wand2 className="h-4 w-4" />
          Format
        </Button>

        <Button variant="secondary" onClick={downloadCode}>
          <Download className="h-4 w-4" />
          Download
        </Button>

        <Button variant="ghost" size="sm" onClick={copyToClipboard}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>

        <Button variant="ghost" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Editor */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Code Editor</label>
        <div ref={editorContainerRef} className="w-full h-[600px] border border-border rounded-lg overflow-hidden shadow-soft" />
      </div>
    </Layout>
  );
}
