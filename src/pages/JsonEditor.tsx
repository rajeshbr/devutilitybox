import { useState, useRef, useEffect } from "react";
import { JSONEditor } from "vanilla-jsoneditor";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowRight, ArrowLeft, Trash2, Diff, Braces } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import "vanilla-jsoneditor/themes/jse-theme-dark.css";

interface JSONContent {
  json?: Record<string, unknown> | Record<string, unknown>[];
  text?: string;
}

export default function JsonEditor() {
  const editorLeftRef = useRef<HTMLDivElement>(null);
  const editorRightRef = useRef<HTMLDivElement>(null);
  const editorLeftInstanceRef = useRef<any>(null);
  const editorRightInstanceRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [, setLeftContent] = useLocalStorage<JSONContent>("jsoneditor_left", { json: {} });
  const [, setRightContent] = useLocalStorage<JSONContent>("jsoneditor_right", { json: {} });

  useEffect(() => {
    if (editorLeftRef.current && !editorLeftInstanceRef.current) {
      editorLeftInstanceRef.current = new JSONEditor({
        target: editorLeftRef.current,
        props: {
          content: { json: {} },
          mode: "tree",
        },
      });
    }

    if (editorRightRef.current && !editorRightInstanceRef.current) {
      editorRightInstanceRef.current = new JSONEditor({
        target: editorRightRef.current,
        props: {
          content: { json: {} },
          mode: "tree",
        },
      });
    }

    // Load persisted content
    const loadPersistedContent = async () => {
      try {
        const leftStored = localStorage.getItem("jsoneditor_left");
        const rightStored = localStorage.getItem("jsoneditor_right");
        
        if (leftStored && editorLeftInstanceRef.current) {
          const parsed = JSON.parse(leftStored);
          editorLeftInstanceRef.current.set(parsed);
        }
        
        if (rightStored && editorRightInstanceRef.current) {
          const parsed = JSON.parse(rightStored);
          editorRightInstanceRef.current.set(parsed);
        }
      } catch (error) {
        console.warn("Failed to load persisted JSON content:", error);
      }
    };

    loadPersistedContent();

    return () => {
      editorLeftInstanceRef.current?.destroy();
      editorRightInstanceRef.current?.destroy();
      editorLeftInstanceRef.current = null;
      editorRightInstanceRef.current = null;
    };
  }, []);

  // Save editor content to localStorage whenever it changes
  useEffect(() => {
    const saveContent = () => {
      if (editorLeftInstanceRef.current) {
        const content = editorLeftInstanceRef.current.get();
        setLeftContent(content);
      }
      if (editorRightInstanceRef.current) {
        const content = editorRightInstanceRef.current.get();
        setRightContent(content);
      }
    };

    const interval = setInterval(saveContent, 1000); // Save every second
    return () => clearInterval(interval);
  }, [setLeftContent, setRightContent]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const newLeftWidth = (e.clientX - container.getBoundingClientRect().left) / container.clientWidth * 100;
      if (newLeftWidth > 20 && newLeftWidth < 80) {
        setLeftWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const findDifferences = (obj1: unknown, obj2: unknown, path = ""): string[] => {
    const diffs: string[] = [];
    const keys = new Set([...Object.keys(obj1 || {}), ...Object.keys(obj2 || {})]);

    keys.forEach((key) => {
      const val1 = (obj1 as Record<string, unknown>)?.[key];
      const val2 = (obj2 as Record<string, unknown>)?.[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (JSON.stringify(val1) !== JSON.stringify(val2)) {
        if (typeof val1 === "object" && val1 !== null && typeof val2 === "object" && val2 !== null) {
          diffs.push(...findDifferences(val1, val2, currentPath));
        } else {
          diffs.push(`${currentPath}: "${val1}" vs "${val2}"`);
        }
      }
    });

    return diffs;
  };

  const compareJSON = () => {
    try {
      const leftContent = editorLeftInstanceRef.current?.get();
      const rightContent = editorRightInstanceRef.current?.get();

      const leftObj = leftContent?.json || JSON.parse(leftContent?.text || "{}");
      const rightObj = rightContent?.json || JSON.parse(rightContent?.text || "{}");

      const leftJSON = JSON.stringify(leftObj, null, 2);
      const rightJSON = JSON.stringify(rightObj, null, 2);

      if (leftJSON === rightJSON) {
        setComparisonResult("✓ The JSON in both panels is identical!");
      } else {
        const differences = findDifferences(leftObj, rightObj);
        if (differences.length > 0) {
          const diffText = differences.length > 5
            ? `${differences.slice(0, 5).join("\n")}\n... and ${differences.length - 5} more differences`
            : differences.join("\n");
          setComparisonResult(`✗ Differences found (${differences.length} total):\n\n${diffText}`);
        } else {
          setComparisonResult("✗ The JSON in both panels is different!");
        }
      }
      setShowComparison(true);
    } catch (error) {
      setComparisonResult(`Error: ${error instanceof Error ? error.message : "Failed to compare JSON"}`);
      setShowComparison(true);
    }
  };

  const clearAll = () => {
    const emptyContent = { json: {} };
    editorLeftInstanceRef.current?.set(emptyContent);
    editorRightInstanceRef.current?.set(emptyContent);
    setLeftContent(emptyContent);
    setRightContent(emptyContent);
  };

  const copyLeftToRight = () => {
    try {
      const leftContent = editorLeftInstanceRef.current?.get();
      editorRightInstanceRef.current?.set(leftContent || { json: {} });
    } catch (error) {
      console.error("Error copying left to right:", error);
    }
  };

  const copyRightToLeft = () => {
    try {
      const rightContent = editorRightInstanceRef.current?.get();
      editorLeftInstanceRef.current?.set(rightContent || { json: {} });
    } catch (error) {
      console.error("Error copying right to left:", error);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-400 mb-4">
          <Braces className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">JSON Editor</h1>
        <p className="text-muted-foreground">
          Edit, compare, and validate JSON data side by side with syntax highlighting
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="secondary" onClick={compareJSON}>
          <Diff className="h-4 w-4" />
          Compare
        </Button>
        
        <Button variant="secondary" onClick={clearAll}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

        <div ref={containerRef} className="flex gap-0 border border-border rounded-lg overflow-hidden bg-background shadow-soft" style={{ height: "calc(100vh - 400px)", minHeight: "500px", maxHeight: "800px" }}>
          {/* Editor 1 Panel */}
          <Card className="p-0 overflow-hidden border-0 rounded-none" style={{ width: `${leftWidth}%` }}>
            <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <h2 className="font-semibold text-sm text-foreground">Editor 1</h2>
            </div>
            <div ref={editorLeftRef} style={{ height: "calc(100% - 40px)" }} className="jsfiddle" />
          </Card>

          {/* Center Divider with Buttons */}
          <div className="flex flex-col items-center justify-center gap-1 px-2 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-col-resize group" onMouseDown={handleMouseDown}>
            <Button
              size="sm"
              variant="ghost"
              onClick={copyLeftToRight}
              title="Copy Input to Output"
              className="h-8 w-8 p-0 group-hover:bg-primary/20 transition-colors"
            >
              <ArrowRight className="h-4 w-4 group-hover:text-primary transition-colors" />
            </Button>
            <div className="h-6 w-px bg-border/50" />
            <Button
              size="sm"
              variant="ghost"
              onClick={copyRightToLeft}
              title="Copy Output to Input"
              className="h-8 w-8 p-0 group-hover:bg-primary/20 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 group-hover:text-primary transition-colors" />
            </Button>
          </div>

          {/* Editor 2 Panel */}
          <Card className="p-0 overflow-hidden border-0 rounded-none" style={{ width: `${100 - leftWidth}%` }}>
            <div className="bg-secondary/50 px-4 py-3 border-b border-border flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-400" />
              <h2 className="font-semibold text-sm text-foreground">Editor 2</h2>
            </div>
            <div ref={editorRightRef} style={{ height: "calc(100% - 40px)" }} className="jsfiddle" />
          </Card>
        </div>

      <AlertDialog open={showComparison} onOpenChange={setShowComparison}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Diff className="h-5 w-5 text-primary" />
              Comparison Result
            </AlertDialogTitle>
            <AlertDialogDescription className="font-mono text-xs whitespace-pre-wrap">
              {comparisonResult}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <AlertDialogCancel>Close</AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
