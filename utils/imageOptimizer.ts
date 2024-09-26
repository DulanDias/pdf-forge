import sharp from 'sharp';
import { Page } from 'puppeteer';

/**
 * Optimize images in the HTML content to reduce size and improve performance.
 * @param page Puppeteer Page object.
 */
export const optimizeImages = async (page: Page): Promise<void> => {
  const images = await page.$$eval('img', imgs => imgs.map(img => img.src));

  for (let src of images) {
    if (src.startsWith('http')) {
      const optimizedImage = await downloadAndOptimizeImage(src);
      await page.evaluate((oldSrc, newSrc) => {
        document.querySelector(`img[src="${oldSrc}"]`)?.setAttribute('src', newSrc);
      }, src, optimizedImage);
    } else {
      const imageBuffer = await sharp(src).jpeg({ quality: 80 }).toBuffer();
      const dataUri = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
      await page.evaluate((oldSrc, newSrc) => {
        document.querySelector(`img[src="${oldSrc}"]`)?.setAttribute('src', newSrc);
      }, src, dataUri);
    }
  }
};

async function downloadAndOptimizeImage(url: string): Promise<string> {
  // Implement downloading of image and optimizing with sharp
  return url; // Replace this with actual optimized image as data URL
}
