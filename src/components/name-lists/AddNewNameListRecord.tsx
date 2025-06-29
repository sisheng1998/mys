"use client"

import React from "react"
import { Plus } from "lucide-react"

import { useDialog } from "@/hooks/use-dialog"
import { Button } from "@/components/ui/button"
import UpsertNameListRecord from "@/components/name-lists/UpsertNameListRecord"

const AddNewNameListRecord = () => {
  const upsertNameListRecordDialog = useDialog()

  return (
    <>
      <Button onClick={upsertNameListRecordDialog.trigger}>
        <Plus />
        <span>New Record</span>
      </Button>

      <UpsertNameListRecord {...upsertNameListRecordDialog.props} />
    </>
  )
}

export default AddNewNameListRecord
