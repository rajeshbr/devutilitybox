import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CookiePreferences {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const savedPreferences = localStorage.getItem("cookie-preferences");
    if (!savedPreferences) {
      setShowBanner(true);
    } else {
      const prefs = JSON.parse(savedPreferences);
      setPreferences(prefs);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookie-preferences", JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(onlyEssential);
    localStorage.setItem("cookie-preferences", JSON.stringify(onlyEssential));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));
    setShowBanner(false);
    setShowDetails(false);
  };

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Essential cookies can't be disabled
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Cookie & Privacy Notice
              </h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to enhance your experience and analyze site usage. By clicking "Accept All," 
                you consent to all cookies. You can customize your preferences or read our{" "}
                <button
                  onClick={() => setShowDetails(true)}
                  className="underline text-primary hover:text-primary/80 transition-colors"
                >
                  Cookie Policy
                </button>
                .
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectAll}
                className="whitespace-nowrap"
              >
                Essential Only
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
                className="whitespace-nowrap"
              >
                Customize
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="whitespace-nowrap"
              >
                Accept All
              </Button>
            </div>

            {/* Close Button */}
            <button
              onClick={handleRejectAll}
              className="md:hidden absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 md:p-0">
          <div className="bg-card rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Cookie Preferences</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Essential Cookies */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">Essential Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Required for the website to function. Cannot be disabled.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.essential}
                      disabled
                      className="w-5 h-5 rounded border border-border cursor-not-allowed"
                      aria-label="Essential cookies (always enabled)"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground ml-0">
                  Session management, security, user preferences (theme, language)
                </p>
              </div>

              <hr className="border-border" />

              {/* Functional Cookies */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">Functional Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enhance your experience by remembering your choices.
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={() => handleToggle("functional")}
                      className="w-5 h-5 rounded border border-border cursor-pointer"
                      aria-label="Enable functional cookies"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground ml-0">
                  Recently used tools, accessibility settings, saved preferences
                </p>
              </div>

              <hr className="border-border" />

              {/* Analytics Cookies */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">Analytics Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Help us understand how you use our service (currently disabled).
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handleToggle("analytics")}
                      className="w-5 h-5 rounded border border-border cursor-pointer"
                      aria-label="Enable analytics cookies"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground ml-0">
                  Usage statistics, page views, feature popularity (anonymized IP)
                </p>
              </div>

              <hr className="border-border" />

              {/* Marketing Cookies */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">Marketing Cookies</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Personalized advertising (currently disabled).
                    </p>
                  </div>
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => handleToggle("marketing")}
                      className="w-5 h-5 rounded border border-border cursor-pointer"
                      aria-label="Enable marketing cookies"
                      disabled
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground ml-0">
                  Targeted ads based on your interests (not currently used)
                </p>
              </div>

              <hr className="border-border" />

              {/* Info Box */}
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Local Storage:</strong> We also use your browser's localStorage to save your input data 
                  (like code in the editor). This data stays on your device only—we don't send it to our servers. 
                  Read our{" "}
                  <a
                    href="/privacy"
                    className="underline text-primary hover:text-primary/80"
                  >
                    Privacy Policy
                  </a>
                  {" "}for more details.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-card border-t border-border p-6 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSavePreferences}>
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
