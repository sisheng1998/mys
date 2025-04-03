import React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GoogleOAuthButton from "@/components/Auth/GoogleOAuthButton"
import Logo from "@/icons/Logo"

export const metadata = {
  title: "Sign In",
}

const SignIn = () => (
  <Card className="w-full max-w-sm">
    <CardHeader className="text-center">
      <div className="mb-3 flex items-center justify-center">
        <Logo className="text-primary size-10" />
      </div>

      <CardTitle>Welcome Back</CardTitle>
      <CardDescription>Sign in to your account</CardDescription>
    </CardHeader>

    <CardContent>
      <GoogleOAuthButton />
    </CardContent>

    <CardFooter className="justify-center">
      <p className="text-muted-foreground text-center text-xs leading-normal">
        By continuing, you agree to our <br />
        <Button
          size="sm"
          variant="link"
          className="text-foreground h-auto p-0"
          asChild
        >
          <Link href="/terms-of-service" target="_blank">
            Terms of Service
          </Link>
        </Button>{" "}
        and{" "}
        <Button
          size="sm"
          variant="link"
          className="text-foreground h-auto p-0"
          asChild
        >
          <Link href="/privacy-policy" target="_blank">
            Privacy Policy
          </Link>
        </Button>
      </p>
    </CardFooter>
  </Card>
)

export default SignIn
