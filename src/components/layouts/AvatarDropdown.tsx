"use client"

import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { Loader2, LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { useRouter } from "@/hooks/use-router"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth"

const AvatarDropdown = () => {
  const { push } = useRouter()

  const { user } = useAuth()
  const { signOut } = useAuthActions()

  const { resolvedTheme, setTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut()
      push("/login")
    } catch (error) {
      toast.error(String(error))
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-8 cursor-pointer">
          <AvatarImage src={user.image} alt={user.name} />
          <AvatarFallback>{(user.name || user.email || "U")[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-52 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-2">
            <Avatar className="size-8 rounded-lg">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {(user.name || user.email || "U")[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col truncate leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
          >
            {isDarkMode ? <Moon /> : <Sun />}
            {isDarkMode ? "Dark" : "Light"} Mode
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={handleSignOut}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AvatarDropdown
