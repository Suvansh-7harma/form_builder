import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import FormBuilder from "./components/FormBuilder";
import FormFiller from "./components/FormFiller";

const queryClient = new QueryClient();

const App = () =>
<QueryClientProvider client={queryClient} data-id="ibc3rbktc" data-path="src/App.tsx">
    <TooltipProvider data-id="hneuksc7h" data-path="src/App.tsx">
      <Toaster data-id="ms9yp0t7e" data-path="src/App.tsx" />
      <BrowserRouter data-id="loi7cauxo" data-path="src/App.tsx">
        <Routes data-id="gmopdltk6" data-path="src/App.tsx">
          <Route path="/" element={<HomePage data-id="oj6s0iwds" data-path="src/App.tsx" />} data-id="y2lods0wf" data-path="src/App.tsx" />
          <Route path="/form-builder" element={<FormBuilder data-id="48h8s8pp7" data-path="src/App.tsx" />} data-id="73kpo1m3t" data-path="src/App.tsx" />
          <Route path="/form/:formId" element={<FormFiller data-id="0wtxudqyk" data-path="src/App.tsx" />} data-id="cw31giwk3" data-path="src/App.tsx" />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound data-id="7m6aw1z7r" data-path="src/App.tsx" />} data-id="nzre6di0c" data-path="src/App.tsx" />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>;


export default App;