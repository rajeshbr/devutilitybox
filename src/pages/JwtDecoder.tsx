import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Key, Copy, Check, Trash2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface JWTDecoded {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
  isValid: boolean;
  expiresAt?: Date;
  isExpired?: boolean;
}

const JwtDecoder = () => {
  const [token, setToken] = useLocalStorage("jwtdecoder_token", "");
  const [decodedToken, setDecodedToken] = useState<JWTDecoded | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const decodeToken = () => {
    try {
      setError("");
      const trimmedToken = token.trim();

      if (!trimmedToken) {
        setError("Please paste a JWT token");
        setDecodedToken(null);
        return;
      }

      const parts = trimmedToken.split(".");
      if (parts.length !== 3) {
        setError("Invalid JWT format. JWT should have 3 parts separated by dots.");
        setDecodedToken(null);
        return;
      }

      // Decode header
      const headerJson = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
      const header = JSON.parse(headerJson);

      // Decode payload
      const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson);

      // Get signature
      const signature = parts[2];

      // Check expiration
      let isExpired = false;
      let expiresAt: Date | undefined;
      if (payload.exp) {
        expiresAt = new Date(payload.exp * 1000);
        isExpired = expiresAt < new Date();
      }

      setDecodedToken({
        header,
        payload,
        signature,
        isValid: true,
        expiresAt,
        isExpired,
      });

      toast.success("JWT decoded successfully!");
    } catch (e) {
      setError(`Error decoding JWT: ${(e as Error).message}`);
      setDecodedToken(null);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const clear = () => {
    setToken("");
    setDecodedToken(null);
    setError("");
    toast.success("JWT cleared!");
  };

  const formatJson = (obj: unknown) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gradient-blue to-gradient-cyan mb-4">
          <Key className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">JWT Decoder</h1>
        <p className="text-muted-foreground">
          Decode and analyze JWT tokens instantly
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="gradient" className="bg-gradient-to-r from-gradient-blue to-gradient-cyan" onClick={decodeToken}>
          Decode JWT
        </Button>
        <Button variant="ghost" onClick={clear}>
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Input */}
      <div className="mb-8 space-y-3">
        <label className="text-sm font-medium text-foreground">JWT Token</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here..."
          className="code-editor h-[120px]"
          spellCheck={false}
        />
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="mb-6 border-destructive/50 bg-destructive/5">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      {/* Decoded Output */}
      {decodedToken && (
        <div className="space-y-6">
          {/* Token Status */}
          <Card className="bg-card p-4 shadow-soft">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Token Status:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${decodedToken.isExpired ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                  {decodedToken.isExpired ? "Expired" : "Valid"}
                </span>
              </div>
              {decodedToken.expiresAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <span className="font-mono text-foreground">{decodedToken.expiresAt.toLocaleString()}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Header */}
          <div className="rounded-xl bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Header</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(formatJson(decodedToken.header), "Header")}
              >
                {copied === "Header" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="code-output overflow-auto max-h-[200px]">{formatJson(decodedToken.header)}</pre>
          </div>

          {/* Payload */}
          <div className="rounded-xl bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Payload</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(formatJson(decodedToken.payload), "Payload")}
              >
                {copied === "Payload" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <pre className="code-output overflow-auto max-h-[300px]">{formatJson(decodedToken.payload)}</pre>
          </div>

          {/* Signature */}
          <div className="rounded-xl bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Signature</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(decodedToken.signature, "Signature")}
              >
                {copied === "Signature" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="bg-secondary p-3 rounded border border-border overflow-auto max-h-[100px]">
              <code className="text-xs text-muted-foreground break-all font-mono">{decodedToken.signature}</code>
            </div>
          </div>

          {/* Full Token */}
          <div className="rounded-xl bg-card p-4 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Full Token</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(token, "Full Token")}
              >
                {copied === "Full Token" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <div className="bg-secondary p-3 rounded border border-border overflow-auto max-h-[150px]">
              <code className="text-xs text-muted-foreground break-all font-mono">{token}</code>
            </div>
          </div>

          {/* Claims Info */}
          {decodedToken.payload && Object.keys(decodedToken.payload).length > 0 && (
            <div className="rounded-xl bg-card p-4 shadow-soft">
              <h3 className="text-sm font-semibold text-foreground mb-3">Common Claims</h3>
              <div className="space-y-2">
                {typeof decodedToken.payload.iss === "string" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Issuer (iss):</span>
                    <span className="font-mono text-foreground">{decodedToken.payload.iss}</span>
                  </div>
                )}
                {typeof decodedToken.payload.sub === "string" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Subject (sub):</span>
                    <span className="font-mono text-foreground">{decodedToken.payload.sub}</span>
                  </div>
                )}
                {typeof decodedToken.payload.aud === "string" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Audience (aud):</span>
                    <span className="font-mono text-foreground">{decodedToken.payload.aud}</span>
                  </div>
                )}
                {typeof decodedToken.payload.iat === "number" && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Issued At (iat):</span>
                    <span className="font-mono text-foreground">{new Date(decodedToken.payload.iat * 1000).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default JwtDecoder;
