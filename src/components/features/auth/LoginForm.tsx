"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (!result || result.error) {
        setError("Invalid email or password")
        return
      }

      router.push(result.url ?? "/dashboard")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      </div>

      <div className="space-y-4">
        <EmailField value={email} onChange={setEmail} />
        <PasswordField value={password} onChange={setPassword} />
        <RememberMeField checked={remember} onCheckedChange={setRemember} />
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="w-full bg-[#1a6bff] hover:bg-[#1a6bff]/90 cursor-pointer"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}

function EmailField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="name@example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="email"
        required
      />
    </div>
  )
}

function PasswordField({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="password">Password</Label>
      <Input
        id="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="current-password"
        required
      />
    </div>
  )
}

function RememberMeField({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="remember"
        className="border cursor-pointer data-[state=checked]:bg-[#1a6bff] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
      />
      <Label htmlFor="remember" className="font-normal cursor-pointer">
        Remember me
      </Label>
    </div>
  )
}
