export const PRINTER_NAME = "CT221B"
export const PRINTER_SERVICE = "49535343-fe7d-4ae5-8fa9-9fafd205e455"
export const PRINTER_CHARACTERISTIC = "49535343-8841-43f4-a8d4-ecbe34729bb3"

const DOTS_PER_MM = 8
const GAP_HEIGHT_MM = 2
const LABEL_WIDTH_MM = 50
const LABEL_HEIGHT_MM = 30
const LABEL_WIDTH_DOTS = LABEL_WIDTH_MM * DOTS_PER_MM
const LABEL_HEIGHT_DOTS = LABEL_HEIGHT_MM * DOTS_PER_MM

export const getTSPLCommands = (commands: string[]): string[] => [
  `SIZE ${LABEL_WIDTH_MM} mm,${LABEL_HEIGHT_MM} mm`,
  `GAP ${GAP_HEIGHT_MM} mm,0 mm`,
  "CLS",
  ...commands,
]

export const getCanvas = (
  lines: string[],
  fontSize: number = 48
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas")
  canvas.width = LABEL_WIDTH_DOTS
  canvas.height = LABEL_HEIGHT_DOTS

  const ctx = canvas.getContext("2d")!

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "#000000"
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.textBaseline = "top"
  ctx.textAlign = "center"
  ctx.font = `${fontSize}px "Noto Sans SC", sans-serif`

  const lineHeight = fontSize * 1.25
  const totalTextHeight = lines.length * lineHeight
  const startY = Math.floor((canvas.height - totalTextHeight) / 2)

  lines.forEach((line, index) => {
    const x = canvas.width / 2
    const y = startY + index * lineHeight
    ctx.fillText(line, x, y)
  })

  return canvas
}

export const getBitmapBytesFromCanvas = async (
  canvas: HTMLCanvasElement
): Promise<Uint8Array> => {
  const ctx = canvas.getContext("2d")!
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  const width = canvas.width
  const height = canvas.height
  const widthInBytes = Math.ceil(width / 8)
  const byteArray = new Uint8Array(widthInBytes * height)
  const data = imgData.data

  for (let y = 0; y < height; y++) {
    for (let byteIndex = 0; byteIndex < widthInBytes; byteIndex++) {
      let byte = 0
      let mask = 0b10000000

      for (let bit = 0; bit < 8; bit++) {
        const x = byteIndex * 8 + bit
        if (x >= width) {
          mask >>= 1
          continue
        }

        const i = (y * width + x) * 4
        const r = data[i]
        const g = data[i + 1]
        const blue = data[i + 2]
        const a = data[i + 3]

        const brightness = (r + g + blue) / 3
        const isWhite = a > 128 && brightness >= 128

        if (isWhite) {
          byte |= mask
        }

        mask >>= 1
      }

      byteArray[y * widthInBytes + byteIndex] = byte
    }
  }

  return byteArray
}

export const writeInChunks = async (
  characteristic: BluetoothRemoteGATTCharacteristic,
  data: Uint8Array,
  chunkSize: number = 240
): Promise<void> => {
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize)
    await characteristic.writeValue(chunk)
  }
}
