const sharp = require('sharp')
const path = require('path')

// Just a small little script to make my icons work in tauri (and yes generated using AI, thats why its common.js)

async function convertToRGBA(inputPath) {
  const fileName = path.basename(inputPath)
  const outputPath = `${path.dirname(inputPath)}/converted_${fileName}`

  try {
    await sharp(inputPath)
      .ensureAlpha()
      .png({
        force: true,
        compressionLevel: 9,
      })
      .toFile(outputPath)

    console.log(`Successfully converted image to RGBA PNG: ${outputPath}`)
  } catch (error) {
    console.error('Error converting image:', error)
  }
}

if (require.main === module) {
  const imagePath = process.argv[2]

  if (!imagePath) {
    console.error('Please provide an image path')
    console.log('Usage: bun index.js <path-to-image>')
    process.exit(1)
  }

  convertToRGBA(imagePath)
}

module.exports = convertToRGBA
