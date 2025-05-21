import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PLACEHOLDER_DIR = path.join(__dirname, '../public/images/placeholders');

// Ensure the directory exists
if (!fs.existsSync(PLACEHOLDER_DIR)) {
  fs.mkdirSync(PLACEHOLDER_DIR, { recursive: true });
}

// Generate placeholder images
const generatePlaceholder = async (name, width, height, text) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#000000"/>
      <text
        x="50%"
        y="50%"
        font-family="Arial"
        font-size="24"
        fill="#FFFFFF"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(PLACEHOLDER_DIR, `${name}.png`));
};

// Generate different placeholder images
const generatePlaceholders = async () => {
  await generatePlaceholder('service-placeholder', 600, 400, 'Service Image');
  await generatePlaceholder('job-placeholder', 600, 400, 'Job Image');
  await generatePlaceholder('gallery-placeholder', 600, 400, 'Gallery Image');
};

generatePlaceholders().catch(console.error); 