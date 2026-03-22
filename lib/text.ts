export function normalizeText(text: string) {
  if (!text) return ''

  let output = text.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16)),
  )

  const suspiciousCodePoints = [0x00c3, 0x00c2, 0x00e2, 0x00f0]
  const hasMojibake = suspiciousCodePoints.some((codePoint) =>
    output.includes(String.fromCharCode(codePoint)),
  )

  if (hasMojibake) {
    try {
      const bytes = Uint8Array.from(Array.from(output).map((char) => char.charCodeAt(0) & 0xff))
      const decoded = new TextDecoder('utf-8').decode(bytes)
      if (!decoded.includes('\uFFFD')) {
        output = decoded
      }
    } catch {
      output = text
    }
  }

  return output.normalize('NFC')
}

