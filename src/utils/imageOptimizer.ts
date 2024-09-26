import sharp from 'sharp';
import { Page } from 'puppeteer';
import fetch from 'node-fetch';

/**
 * Optimize images in the HTML content to reduce size and improve performance.
 * @param page Puppeteer Page object.
 */
export const optimizeImages = async (page: Page): Promise<void> => {
  // Use type assertion to cast elements as HTMLImageElement
  const images = await page.$$eval('img', imgs => imgs.map(img => (img as HTMLImageElement).src));

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

/**
 * Downloads and optimizes an image from a URL.
 * @param url The URL of the image.
 * @returns The optimized image as a base64 data URI.
 */
async function downloadAndOptimizeImage(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.buffer();
  
  const optimizedImageBuffer = await sharp(buffer).jpeg({ quality: 80 }).toBuffer();
  return `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
}
