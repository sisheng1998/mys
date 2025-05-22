"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"

import { Category } from "@/types/category"
import { formatCurrency } from "@/lib/number"
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
import { LoaderButton } from "@/components/ui/loader-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TemplateRecordFormByCategory from "@/components/templates/TemplateRecordFormByCategory"
import TemplateRecordFormByDonor from "@/components/templates/TemplateRecordFormByDonor"

const AddTemplateRecord = ({ categories }: { categories: Category[] }) => {
  const [open, setOpen] = useState<boolean>(false)

  const handleClose = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span>New Record(s)</span>
        </Button>
      </DialogTrigger>

      <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>New Record(s)</DialogTitle>
          <DialogDescription>
            New record(s) will be added to the template.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="donor" className="gap-4">
          <TabsList className="w-full">
            <TabsTrigger value="donor">By Donor</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="donor">
            <TemplateRecordFormByDonor
              categories={categories}
              handleClose={handleClose}
            />
          </TabsContent>

          <TabsContent value="category">
            <TemplateRecordFormByCategory
              categories={categories}
              handleClose={handleClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddTemplateRecord

export const FormFooter = ({
  totalAmount,
  isLoading,
}: {
  totalAmount: number
  isLoading: boolean
}) => (
  <DialogFooter>
    <p className="order-1 self-center sm:order-none sm:mr-auto">
      <span className="text-sm">Total:</span>{" "}
      <span className="font-semibold">{formatCurrency(totalAmount)}</span>
    </p>

    <DialogClose asChild>
      <Button variant="outline">Cancel</Button>
    </DialogClose>

    <LoaderButton type="submit" isLoading={isLoading} disabled={isLoading}>
      Add Record(s)
    </LoaderButton>
  </DialogFooter>
)
