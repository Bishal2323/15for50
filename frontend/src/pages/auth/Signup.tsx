import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useUserStore } from "@/store/userStore"
import { signupApi } from "@/lib/api"
import { AuthLayout } from "@/components/auth/AuthLayout"

const signupSchema = z.object({

  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["athlete", "coach", "physio"], {
    required_error: "Please select your role",
  }),
})
type SignupForm = z.infer<typeof signupSchema>

export function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const login = useUserStore((state) => state.login)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true)
    setError("")
    try {
      const { token, user } = await signupApi(data.email, data.password, data.role)
      localStorage.setItem('access_token', token)
      // Store full user payload returned from backend (includes aclRisk if available)
      login(user, true)
      navigate(`/${user.role}`)
    } catch (err: any) {
      setError(err?.message || "Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout active="signup">
      <Card className="w-full max-w-md min-h-[582px]">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">ACL Risk Monitor</h1>
          </div>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
            Sign up to start monitoring ACL injury risks
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole ?? undefined} onValueChange={(value) => setValue("role", value as SignupForm['role'], { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="athlete">Athlete</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="physio">Physiotherapist</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Account"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              className="underline hover:text-foreground"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
