type ImageSampleArea = 'topRight' | 'leftCenter'

const SAMPLE_SIZE = 32

const getLuminance = (red: number, green: number, blue: number) =>
  0.2126 * red + 0.7152 * green + 0.0722 * blue

const getSampleBounds = (area: ImageSampleArea) => {
  if (area === 'leftCenter') {
    return {
      endX: Math.ceil(SAMPLE_SIZE * 0.24),
      endY: Math.ceil(SAMPLE_SIZE * 0.58),
      startX: 0,
      startY: Math.floor(SAMPLE_SIZE * 0.42),
    }
  }

  return {
    endX: SAMPLE_SIZE,
    endY: Math.ceil(SAMPLE_SIZE * 0.34),
    startX: Math.floor(SAMPLE_SIZE * 0.62),
    startY: 0,
  }
}

export const getLuminanceFromColor = (color: string) => {
  const hexMatch = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)

  if (hexMatch) {
    const rawHex = hexMatch[1]
    const hex =
      rawHex.length === 3
        ? rawHex
            .split('')
            .map((part) => part + part)
            .join('')
        : rawHex

    return getLuminance(
      Number.parseInt(hex.slice(0, 2), 16),
      Number.parseInt(hex.slice(2, 4), 16),
      Number.parseInt(hex.slice(4, 6), 16),
    )
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i)

  if (!rgbMatch) return null

  return getLuminance(
    Number.parseInt(rgbMatch[1], 10),
    Number.parseInt(rgbMatch[2], 10),
    Number.parseInt(rgbMatch[3], 10),
  )
}

export const getLuminanceFromImage = (src: string, area: ImageSampleArea = 'topRight') =>
  new Promise<number>((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d', { willReadFrequently: true })

      if (!context) {
        reject(new Error('Canvas context unavailable'))
        return
      }

      canvas.width = SAMPLE_SIZE
      canvas.height = SAMPLE_SIZE
      context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE)

      const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE)
      const bounds = getSampleBounds(area)
      let red = 0
      let green = 0
      let blue = 0
      let count = 0

      for (let y = bounds.startY; y < bounds.endY; y += 1) {
        for (let x = bounds.startX; x < bounds.endX; x += 1) {
          const index = (y * SAMPLE_SIZE + x) * 4
          red += data[index]
          green += data[index + 1]
          blue += data[index + 2]
          count += 1
        }
      }

      resolve(getLuminance(red / count, green / count, blue / count))
    }

    image.onerror = () => reject(new Error('Image load failed'))
    image.src = src
  })
