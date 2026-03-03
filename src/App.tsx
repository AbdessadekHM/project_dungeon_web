import { Theme } from "@radix-ui/themes"
import { AppRoutes } from "./routes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import "@radix-ui/themes/styles.css"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Theme>
        <TooltipProvider>
          <AppRoutes />
        </TooltipProvider>
      </Theme>
    </ThemeProvider>
  )
}

export default App
