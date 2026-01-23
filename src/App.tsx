import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { CookieConsent } from "./components/CookieConsent";
import Index from "./pages/Index";
import JsonFormatter from "./pages/JsonFormatter";
import JsonEditor from "./pages/JsonEditor";
import Base64Tool from "./pages/Base64Tool";
import ListComparator from "./pages/ListComparator";
import SqlFormatter from "./pages/SqlFormatter";
import TimezoneConverter from "./pages/TimezoneConverter";
import CodeEditor from "./pages/CodeEditor";
import JwtDecoder from "./pages/JwtDecoder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CookieConsent />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/json-formatter" element={<JsonFormatter />} />
            <Route path="/json-editor" element={<JsonEditor />} />
            <Route path="/base64" element={<Base64Tool />} />
            <Route path="/list-comparator" element={<ListComparator />} />
            <Route path="/sql-formatter" element={<SqlFormatter />} />
            <Route path="/timezone" element={<TimezoneConverter />} />
            <Route path="/code-editor" element={<CodeEditor />} />
            <Route path="/jwt-decoder" element={<JwtDecoder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
