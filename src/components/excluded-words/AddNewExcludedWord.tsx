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

import { api } from "@cvx/_generated/api"
import { addExcludedWordSchema } from "@cvx/excludedWords/mutations"

type formSchema = z.infer<typeof addExcludedWordSchema>

const AddNewExcludedWord = () => {
  const [open, setOpen] = useState<boolean>(false)

  const addExcludedWord = useMutation(
    api.excludedWords.mutations.addExcludedWord
  )

  const defaultValues: formSchema = {
    word: "",
  }
  const form = useForm<formSchema>({
    resolver: zodResolver(addExcludedWordSchema),
    defaultValues,
  })

  const onSubmit = async (values: formSchema) => {
    try {
      await addExcludedWord(values)
      toast.success("New word added")
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
          <span>New Word</span>
        </Button>
      </DialogTrigger>

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
              <DialogTitle>New Excluded Word</DialogTitle>

              <DialogDescription>
                New word will be added to the list.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="word"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excluded Word</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Word in Simplified Chinese"
                      {...field}
                    />
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
                Add Word
              </LoaderButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewExcludedWord
