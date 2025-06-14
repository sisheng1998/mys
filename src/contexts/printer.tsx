"use client"

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

type PrinterContextType = {
  device: BluetoothDevice | null
  isSupported: boolean
  connect: () => Promise<void>
  disconnect: () => void
}

const PRINTER_NAME = "CT221B"

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

  return (
    <Printer.Provider
      value={{
        device,
        isSupported,
        connect,
        disconnect,
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
