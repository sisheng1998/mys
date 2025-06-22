export const PRINTER_NAME = "CT221B"
export const PRINTER_SERVICE = "49535343-fe7d-4ae5-8fa9-9fafd205e455"
export const PRINTER_CHARACTERISTIC = "49535343-8841-43f4-a8d4-ecbe34729bb3"

const DOTS_PER_MM = 8
const GAP_HEIGHT_MM = 2
const LABEL_WIDTH_MM = 35
const LABEL_HEIGHT_MM = 25
const LABEL_WIDTH_DOTS = LABEL_WIDTH_MM * DOTS_PER_MM
const LABEL_HEIGHT_DOTS = LABEL_HEIGHT_MM * DOTS_PER_MM
const PADDING = 12

export const getTSPLCommands = (commands: string[] = []): string[] => [
  `SIZE ${LABEL_WIDTH_MM} mm,${LABEL_HEIGHT_MM} mm`,
  `GAP ${GAP_HEIGHT_MM} mm,0 mm`,
  "CLS",
  ...commands,
]

export const getCanvas = (lines: [string, number][]): HTMLCanvasElement => {
  const canvas = document.createElement("canvas")
  canvas.width = LABEL_WIDTH_DOTS
  canvas.height = LABEL_HEIGHT_DOTS

  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  setupCanvasContext(ctx, canvas)

  const maxWidth = canvas.width - 2 * PADDING
  const maxHeight = canvas.height - 2 * PADDING
  const wrappedLines = lines.flatMap(([text, size]) =>
    wrapTextToFit(ctx, text, size, maxWidth, maxHeight)
  )

  renderWrappedLines(ctx, canvas, wrappedLines, maxHeight)

  return canvas
}

const setupCanvasContext = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => {
  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = "#000000"
  ctx.imageSmoothingEnabled = false
  ctx.textBaseline = "top"
  ctx.textAlign = "center"
}

const wrapTextToFit = (
  ctx: CanvasRenderingContext2D,
  text: string,
  targetFontSize: number,
  maxWidth: number,
  maxHeight: number,
  minFontSize = 12
): { text: string; fontSize: number; lineHeight: number }[] => {
  let fontSize = targetFontSize

  while (fontSize >= minFontSize) {
    ctx.font = `${fontSize}px "Noto Sans SC", sans-serif`
    const lineHeight = Math.floor(fontSize * 1.25)
    const lines = wrapWords(ctx, text, maxWidth)

    if (lines.length === 2) balanceTwoLines(ctx, lines, maxWidth)

    const totalHeight = lines.length * lineHeight
    if (totalHeight <= maxHeight && lines.length <= 2) {
      return lines.map((line) => ({ text: line, fontSize, lineHeight }))
    }

    fontSize -= 2
  }

  return [
    { text, fontSize: minFontSize, lineHeight: Math.floor(minFontSize * 1.25) },
  ]
}

const wrapWords = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }

  if (currentLine) lines.push(currentLine)
  return lines
}

const balanceTwoLines = (
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number
) => {
  const [first, second] = lines
  const firstWords = first.split(" ")
  const secondWords = second.split(" ")

  if (secondWords.length === 1 && firstWords.length > 1) {
    for (let i = firstWords.length - 1; i > 0; i--) {
      const newFirst = firstWords.slice(0, i).join(" ")
      const newSecond = firstWords.slice(i).join(" ") + " " + secondWords[0]
      if (
        ctx.measureText(newFirst).width <= maxWidth &&
        ctx.measureText(newSecond).width <= maxWidth
      ) {
        lines[0] = newFirst
        lines[1] = newSecond
        break
      }
    }
  }
}

const renderWrappedLines = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  lines: { text: string; fontSize: number; lineHeight: number }[],
  maxHeight: number
) => {
  const totalHeight = lines.reduce((sum, line) => sum + line.lineHeight, 0)
  let currentY = PADDING + Math.floor((maxHeight - totalHeight) / 2)

  for (let i = 0; i < lines.length; i++) {
    const { text, fontSize, lineHeight } = lines[i]

    if (i === lines.length - 1 && lines.length > 1) {
      currentY += PADDING
    }

    ctx.font = `${fontSize}px "Noto Sans SC", sans-serif`
    ctx.fillText(text, canvas.width / 2, currentY)
    currentY += lineHeight
  }
}

export const trimCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data

  let top = height,
    bottom = 0,
    left = width,
    right = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b
      const isBlack = a > 128 && luminance < 80

      if (isBlack) {
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }

  if (top > bottom || left > right) {
    return { trimmedCanvas: canvas, offsetX: 0, offsetY: 0 }
  }

  const trimmedWidth = right - left + 1
  const trimmedHeight = bottom - top + 1
  const trimmedCanvas = document.createElement("canvas")
  trimmedCanvas.width = trimmedWidth
  trimmedCanvas.height = trimmedHeight

  const trimmedCtx = trimmedCanvas.getContext("2d", {
    willReadFrequently: true,
  })!
  trimmedCtx.putImageData(
    ctx.getImageData(left, top, trimmedWidth, trimmedHeight),
    0,
    0
  )

  return { trimmedCanvas, offsetX: left, offsetY: top }
}

export const getBitmapBytesFromCanvas = async (
  canvas: HTMLCanvasElement
): Promise<Uint8Array> => {
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  const width = canvas.width
  const height = canvas.height
  const widthInBytes = Math.ceil(width / 8)
  const bytes = new Uint8Array(widthInBytes * height)

  for (let y = 0; y < height; y++) {
    for (let byteIdx = 0; byteIdx < widthInBytes; byteIdx++) {
      let byte = 0b00000000
      for (let bit = 0; bit < 8; bit++) {
        const x = byteIdx * 8 + bit
        if (x >= width) continue

        const i = (y * width + x) * 4
        const [r, g, b, a] = [
          imgData[i],
          imgData[i + 1],
          imgData[i + 2],
          imgData[i + 3],
        ]
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b
        const isBlack = a > 128 && luminance < 80

        if (isBlack) byte |= 1 << (7 - bit)
      }

      bytes[y * widthInBytes + byteIdx] = ~byte & 0xff
    }
  }

  return bytes
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
