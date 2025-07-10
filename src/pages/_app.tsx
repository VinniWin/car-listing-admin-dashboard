import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { ModeToggle } from "@/components/ui/toggle-mode";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NuqsAdapter } from "nuqs/adapters/next/pages";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        <ModeToggle />
        <Component {...pageProps} />
      </ThemeProvider>
    </NuqsAdapter>
  );
}
