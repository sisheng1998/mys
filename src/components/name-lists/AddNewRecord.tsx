"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { handleFormError } from "@/lib/error"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { api } from "@cvx/_generated/api"
import { createNameListRecordSchema } from "@cvx/nameLists/mutations"
import { TITLES } from "@cvx/nameLists/schemas"

type formSchema = z.infer<typeof createNameListRecordSchema>

const AddNewRecord = () => {
  const [open, setOpen] = useState<boolean>(false)

  const createNameListRecord = useMutation(
    api.nameLists.mutations.createNameListRecord
  )

  const form = useForm<formSchema>({
    resolver: zodResolver(createNameListRecordSchema),
    defaultValues: {
      title: undefined,
      name: "",
    },
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await createNameListRecord(values)
      toast.success("New record added")
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
          <span>New Record</span>
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
              <DialogTitle>New Record</DialogTitle>
              <DialogDescription>
                New record will be added to the list.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value || undefined)
                      }
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full min-w-24">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value={null!}>
                          <span className="text-muted-foreground">Select</span>
                        </SelectItem>

                        {TITLES.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                Add Record
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewRecord
