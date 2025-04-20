import { ConvexError } from "convex/values"
import { Path, UseFormSetError } from "react-hook-form"
import { toast } from "sonner"
import { ZodIssue } from "zod"

export const handleFormError = <TFieldValues extends Record<string, unknown>>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>
) => {
  if (error instanceof ConvexError) {
    const data = error.data

    if (typeof data === "object" && "ZodError" in data) {
      const zodError = data.ZodError as ZodIssue[]

      zodError.forEach((err) => {
        const fieldPath = err.path.join(".") as Path<TFieldValues>

        setError(fieldPath, {
          message: err.message,
        })
      })
    } else {
      toast.error(String(data))
    }
  } else {
    toast.error(String(error))
  }
}

export const handleMutationError = (error: unknown) => {
  if (error instanceof ConvexError) {
    const data = error.data

    if (typeof data === "object" && "ZodError" in data) {
      const zodError = data.ZodError as ZodIssue[]
      const errorMessage = zodError.map((err) => err.message).join(", ")
      toast.error(errorMessage)
    } else {
      toast.error(String(data))
    }
  } else {
    toast.error(String(error))
  }
}
