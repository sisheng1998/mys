"use client"

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  getBitmapBytesFromCanvas,
  getCanvas,
  getTSPLCommands,
  PRINTER_CHARACTERISTIC,
  PRINTER_NAME,
  PRINTER_SERVICE,
  trimCanvas,
  writeInChunks,
} from "@/lib/printer"

type PrinterContextType = {
  device: BluetoothDevice | null
  isSupported: boolean
  connect: () => Promise<void>
  disconnect: () => void
  print: (records: [string, number][][]) => Promise<void>
}

const Printer = createContext<PrinterContextType | undefined>(undefined)

export const PrinterProvider = ({ children }: { children: ReactNode }) => {
  const [device, setDevice] = useState<BluetoothDevice | null>(null)
  const [isSupported, setIsSupported] = useState<boolean>(false)

  useEffect(() => {
    setIsSupported("bluetooth" in navigator)
  }, [])

  const connect = async () => {
    if (!isSupported) return

    const device = await navigator.bluetooth.requestDevice({
      filters: [
        {
          namePrefix: PRINTER_NAME,
        },
      ],
      optionalServices: [PRINTER_SERVICE],
    })

    await device.gatt?.connect()

    if (!device.gatt?.connected) return

    device.addEventListener("gattserverdisconnected", handleDisconnect)

    setDevice(device)
  }

  const disconnect = () => {
    if (!isSupported || !device?.gatt?.connected) return

    device.gatt.disconnect()
    handleDisconnect()
  }

  const handleDisconnect = () => setDevice(null)

  const print = async (records: [string, number][][]) => {
    if (!device || records.length === 0) return

    const server = await device.gatt?.connect()
    const service = await server?.getPrimaryService(PRINTER_SERVICE)
    const characteristic = await service?.getCharacteristic(
      PRINTER_CHARACTERISTIC
    )
    if (!characteristic) return

    const encoder = new TextEncoder()
    const tsplHeader = getTSPLCommands().join("\r\n")

    const fullBufParts: Uint8Array[] = [encoder.encode(tsplHeader + "\r\n")]

    for (const record of records) {
      const canvas = getCanvas(record)
      const { trimmedCanvas, offsetX, offsetY } = trimCanvas(canvas)

      const bitmapBytes = await getBitmapBytesFromCanvas(trimmedCanvas)
      const widthInBytes = Math.ceil(trimmedCanvas.width / 8)
      const height = trimmedCanvas.height

      const bitmapCmdPrefix = `BITMAP ${offsetX},${offsetY},${widthInBytes},${height},0,`
      const bitmapHeader = encoder.encode(bitmapCmdPrefix)
      const bitmapFooter = encoder.encode("\r\n")
      const clearCmd = encoder.encode("CLS\r\n")
      const printCmd = encoder.encode("PRINT 1\r\n")

      fullBufParts.push(clearCmd)
      fullBufParts.push(bitmapHeader)
      fullBufParts.push(bitmapBytes)
      fullBufParts.push(bitmapFooter)
      fullBufParts.push(printCmd)
    }

    fullBufParts.push(encoder.encode("END\r\n"))

    const totalLength = fullBufParts.reduce((sum, part) => sum + part.length, 0)
    const fullBuf = new Uint8Array(totalLength)

    let offset = 0
    for (const part of fullBufParts) {
      fullBuf.set(part, offset)
      offset += part.length
    }

    await writeInChunks(characteristic, fullBuf)
  }

  return (
    <Printer.Provider
      value={{
        device,
        isSupported,
        connect,
        disconnect,
        print,
      }}
    >
      {children}
    </Printer.Provider>
  )
}

export const usePrinter = (): PrinterContextType => {
  const context = useContext(Printer)

  if (!context) {
    throw new Error("usePrinter must be used within a PrinterProvider")
  }

  return context
}
