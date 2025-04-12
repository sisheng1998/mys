"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { handleFormError } from "@/lib/form"
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
  const [open, setOpen] = useState<boolean>(false)

  const createUser = useMutation(api.users.mutations.createUser)

  const form = useForm<formSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await createUser(values)
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

      <DialogContent onCloseAutoFocus={() => form.reset()}>
        <Form {...form}>
          <form
            autoComplete="off"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <DialogHeader>
              <DialogTitle>New User</DialogTitle>
              <DialogDescription>
                New user will be added to the user list.
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
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                Create
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewUser
