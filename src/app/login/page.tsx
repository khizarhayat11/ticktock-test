import { LoginForm } from "@/components/features/auth/LoginForm"
import { BrandPanel } from "@/components/features/auth/BrandPanel"

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.2fr]">
      <div className="flex items-center justify-center px-8 py-12">
        <LoginForm />
      </div>
      <BrandPanel />
    </div>
  )
}
