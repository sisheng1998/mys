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
  writeInChunks,
} from "@/lib/printer"

type PrinterContextType = {
  device: BluetoothDevice | null
  isSupported: boolean
  connect: () => Promise<void>
  disconnect: () => void
  print: (text: string[]) => Promise<void>
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

  const print = async (lines: string[]) => {
    if (!device || lines.length === 0) return

    const server = await device.gatt?.connect()
    const service = await server?.getPrimaryService(PRINTER_SERVICE)
    const characteristic = await service?.getCharacteristic(
      PRINTER_CHARACTERISTIC
    )
    if (!characteristic) return

    const canvas = getCanvas(lines)
    const bitmapBytes = await getBitmapBytesFromCanvas(canvas)
    const widthInBytes = Math.ceil(canvas.width / 8)
    const height = canvas.height

    const tsplHeader = getTSPLCommands([]).join("\r\n")
    const tsplFooter = ["PRINT 1", "END"].join("\r\n")

    const bitmapCmdPrefix = `BITMAP 0,0,${widthInBytes},${height},0,`
    const encoder = new TextEncoder()

    const headerBuf = encoder.encode(tsplHeader + "\r\n" + bitmapCmdPrefix)
    const footerBuf = encoder.encode("\r\n" + tsplFooter + "\r\n")

    const fullBuf = new Uint8Array(
      headerBuf.length + bitmapBytes.length + footerBuf.length
    )

    fullBuf.set(headerBuf, 0)
    fullBuf.set(bitmapBytes, headerBuf.length)
    fullBuf.set(footerBuf, headerBuf.length + bitmapBytes.length)

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
