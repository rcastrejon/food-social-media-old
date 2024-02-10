export async function processImage(imageBuffer: ArrayBuffer): Promise<Blob> {
  const blob = new Blob([imageBuffer], { type: "image/jpeg" })
  const imageBitmap = await createImageBitmap(blob)

  let { width, height } = imageBitmap
  const aspectRatio = width / height

  if (aspectRatio !== 1) {
    const size = Math.min(width, height)
    width = size
    height = size
  }

  if (width < 320) {
    width = 320
    height = 320
  } else if (width > 1080) {
    width = 1080
    height = 1080
  }

  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("Failed to get 2d context from canvas")
  }
  context.drawImage(imageBitmap, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error("Failed to convert canvas to Blob"))
      }
    }, "image/jpeg")
  })
}
