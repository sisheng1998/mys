"use client"

import React, { useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { handleFormError } from "@/lib/error"
import { useSafeArea } from "@/hooks/use-safe-area"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderButton } from "@/components/ui/loader-button"

import { api } from "@cvx/_generated/api"
import { createUserSchema } from "@cvx/users/mutations"

type formSchema = z.infer<typeof createUserSchema>

const AddNewUser = () => {
  const contentRef = useRef<HTMLDivElement | null>(null)
  useSafeArea(contentRef)

  const [open, setOpen] = useState<boolean>(false)

  const createUser = useMutation(api.users.mutations.createUser)

  const defaultValues: formSchema = {
    email: "",
  }
  const form = useForm<formSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await createUser(values)
      toast.success("New user added")
      setOpen(false)
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>New User</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        ref={contentRef}
        onCloseAutoFocus={(e) => {
          e.preventDefault()
          form.reset(defaultValues)
        }}
      >
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <DialogHeader>
              <DialogTitle>New User</DialogTitle>

              <DialogDescription>
                New user will be added to the list.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <LoaderButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                disabled={form.formState.isSubmitting}
              >
                Add User
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewUser
