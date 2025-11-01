"use client"

import React, { useCallback } from "react"
import { FileText, Loader2, Upload } from "lucide-react"
import { FileRejection, useDropzone } from "react-dropzone"
import { toast } from "sonner"

import { cn } from "@/lib/utils"

const ExcelDropzone = ({
  handleUpload,
  isLoading,
}: {
  handleUpload: (file: File) => Promise<void>
  isLoading: boolean
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (acceptedFiles.length + rejectedFiles.length > 1) {
        toast.error("Only one file is allowed")
        return
      } else if (rejectedFiles.length > 0) {
        toast.error("Only .xlsx file is allowed")
        return
      }

      await handleUpload(acceptedFiles[0])
    },
    [handleUpload]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        "bg-muted text-muted-foreground hover:bg-muted/75 flex min-h-48 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed p-2 text-center text-sm transition-colors outline-none",
        isDragActive &&
          "border-primary bg-primary/10 text-primary hover:bg-primary/10",
        isLoading && "pointer-events-none opacity-75"
      )}
    >
      <input {...getInputProps()} />

      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          <p className="font-medium">Processing...</p>
        </>
      ) : isDragActive ? (
        <>
          <FileText />
          <p className="font-medium">Drop the file here...</p>
        </>
      ) : (
        <>
          <Upload />
          <p className="font-medium">Upload File</p>

          <p className="mt-0.5 -mb-0.5 text-xs">
            Drag {`'n'`} drop file here, or click to select file
          </p>
          <p className="text-xs opacity-75">Only .xlsx file are allowed</p>
        </>
      )}
    </div>
  )
}

export default ExcelDropzone
