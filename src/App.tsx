import { Theme } from "@radix-ui/themes"
import { AppRoutes } from "./routes"
import { TooltipProvider } from "@/components/ui/tooltip"
import "@radix-ui/themes/styles.css"

function App() {
  return (
    <Theme>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </Theme>
  )
}

export default App
