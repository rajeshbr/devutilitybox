import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Binary, Copy, Check, Trash2, ArrowDownUp } from "lucide-react";
import { toast } from "sonner";


/**
 * Safely decode a Base64 encoded string with Unicode support in a browser environment.
 * Wraps the atob function in a try-catch block for invalid input handling.
 * @param {string} base64String The Base64 encoded string.
 * @returns {string | null} The decoded string, or null if decoding fails.
 */
function safeUnicodeDecode(base64String) {
    try {
        // First, check for common URL-safe characters and convert them back to standard Base64 characters
        let standardBase64 = base64String.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if missing, though modern atob() often handles this
        while (standardBase64.length % 4 !== 0) {
            standardBase64 += '=';
        }

        // Use atob to get a binary string (each char is a byte)
        const binaryString = atob(standardBase64);

        // Convert the binary string to a Uint8Array of UTF-8 bytes
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Use TextDecoder to convert UTF-8 bytes to a readable Unicode string
        return new TextDecoder().decode(bytes);
    } catch (error) {
        console.error("Failed to decode Base64 string:", error);
        return null; // Return null or handle the error as appropriate for your application
    }
}



const Base64Tool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const process = () => {
    try {
      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        toast.success("Text encoded!");
      } else {
        const decoded = atob(input);
        setOutput(decoded);
        toast.success("Base64 decoded!");
      }
      setError("");
    } catch (e) {
      setError(`Invalid ${mode === "decode" ? "Base64" : "input"}: ${(e as Error).message}`);
      setOutput("");
    }
  };

  const swap = () => {
    setInput(output);
    setOutput("");
    setMode(mode === "encode" ? "decode" : "encode");
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

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gradient-pink to-gradient-purple mb-4">
          <Binary className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Base64 Encoder / Decoder</h1>
        <p className="text-muted-foreground">
          Convert text to Base64 and back instantly
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="inline-flex rounded-lg bg-secondary p-1">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "encode"
                ? "bg-card shadow-soft text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "decode"
                ? "bg-card shadow-soft text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Decode
          </button>
        </div>
        <Button variant="gradient" className="bg-gradient-to-r from-gradient-pink to-gradient-purple" onClick={process}>
          {mode === "encode" ? "Encode" : "Decode"}
        </Button>
        <Button variant="secondary" onClick={swap} disabled={!output}>
          <ArrowDownUp className="h-4 w-4" />
          Swap
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
          <label className="text-sm font-medium text-foreground">
            {mode === "encode" ? "Plain Text" : "Base64 String"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            className="code-editor h-[400px]"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {mode === "encode" ? "Base64 Output" : "Decoded Text"}
            </label>
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
              placeholder="Result will appear here..."
              className="code-editor h-[400px]"
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Base64Tool;
