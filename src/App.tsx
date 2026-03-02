import { Theme } from "@radix-ui/themes"
import { AppRoutes } from "./routes"
import "@radix-ui/themes/styles.css"

function App() {
  return (
    <Theme>
      <AppRoutes />
    </Theme>
  )
}

export default App
