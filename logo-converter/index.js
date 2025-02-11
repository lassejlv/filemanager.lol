const sharp = require('sharp');
const path = require('path');

// First install sharp using: npm install sharp

async function convertToRGBA(inputPath) {
  const fileName = path.basename(inputPath);
  const outputPath = `${path.dirname(inputPath)}/converted_${fileName}`;

  try {
    await sharp(inputPath)
      .ensureAlpha()        // Ensure alpha channel exists
      .png({
        force: true,      // Force PNG format
        compressionLevel: 9
      })
      .toFile(outputPath);

    console.log(`Successfully converted image to RGBA PNG: ${outputPath}`);
  } catch (error) {
    console.error('Error converting image:', error);
  }
}

// If running directly from command line
if (require.main === module) {
  const imagePath = process.argv[2];

  if (!imagePath) {
    console.error('Please provide an image path');
    console.log('Usage: node convert.js <path-to-image>');
    process.exit(1);
  }

  convertToRGBA(imagePath);
}

module.exports = convertToRGBA;
