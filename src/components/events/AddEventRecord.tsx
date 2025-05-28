"use client"

import React, { useState } from "react"
import { Plus } from "lucide-react"

import { Category } from "@/types/category"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventRecordFormByCategory from "@/components/events/EventRecordFormByCategory"
import EventRecordFormByDonor from "@/components/events/EventRecordFormByDonor"

const AddEventRecord = ({ categories }: { categories: Category[] }) => {
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

      <DialogContent
        className="max-h-screen overflow-y-auto"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>New Record(s)</DialogTitle>
          <DialogDescription>
            New record(s) will be added to the event.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="donor" className="gap-4">
          <TabsList className="w-full">
            <TabsTrigger value="donor">By Donor</TabsTrigger>
            <TabsTrigger value="category">By Category</TabsTrigger>
          </TabsList>

          <TabsContent value="donor">
            <EventRecordFormByDonor
              categories={categories}
              handleClose={handleClose}
            />
          </TabsContent>

          <TabsContent value="category">
            <EventRecordFormByCategory
              categories={categories}
              handleClose={handleClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default AddEventRecord
