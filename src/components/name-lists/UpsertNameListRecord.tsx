"use client"

import React, { useEffect, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { NameListRecord } from "@/types/nameList"
import { handleFormError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import ControlledInput from "@/components/ui/controlled-input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoaderButton } from "@/components/ui/loader-button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { api } from "@cvx/_generated/api"
import { upsertNameListRecordSchema } from "@cvx/nameLists/mutations"
import { TITLES } from "@cvx/nameLists/schemas"

type formSchema = z.infer<typeof upsertNameListRecordSchema>

const UpsertNameListRecord = ({
  nameListRecord,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  nameListRecord?: NameListRecord
}) => {
  const upsertNameListRecord = useMutation(
    api.nameLists.mutations.upsertNameListRecord
  )

  const isEdit = !!nameListRecord

  const defaultValues: formSchema = useMemo(
    () => ({
      _id: nameListRecord?._id,
      title: nameListRecord?.title ?? undefined,
      name: nameListRecord?.name || "",
    }),
    [nameListRecord]
  )

  const form = useForm<formSchema>({
    resolver: zodResolver(upsertNameListRecordSchema),
    defaultValues,
  })

  useEffect(() => {
    form.reset(defaultValues)
  }, [form, defaultValues])

  const onSubmit = async (values: formSchema) => {
    try {
      await upsertNameListRecord(values)
      toast.success(isEdit ? "Record updated" : "New record added")
      props.onOpenChange?.(false)
    } catch (error) {
      handleFormError(error, form.setError)
    }
  }

  return (
    <Dialog {...props}>
      <DialogContent
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
              <DialogTitle>{isEdit ? "Edit" : "New"} Record</DialogTitle>

              <DialogDescription>
                {isEdit
                  ? "The record in the list will be updated."
                  : "New record will be added to the list."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid items-start gap-4 sm:grid-cols-[auto_1fr]">
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
                          <SelectValue placeholder="Select">
                            {field.value || "Select"}
                          </SelectValue>
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
                      <ControlledInput placeholder="John Doe" {...field} />
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
                disabled={form.formState.isSubmitting}
              >
                {isEdit ? "Update" : "Add Record"}
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpsertNameListRecord
