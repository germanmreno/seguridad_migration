import { Toaster } from "@/components/ui/sonner"
import { Footer } from "./Footer"

export const Layout = ({ children }) => {
  return (
    <div className={`min-h-[100vh] w-full bg-cover bg-scroll bg-no-repeat bg-center`} style={{ backgroundImage: `url(/background_logo.png)` }} >
      {children}
      <Toaster />
      <Footer />
    </div>
  )
}
