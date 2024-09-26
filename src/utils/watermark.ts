import { Page } from 'puppeteer';
import { WatermarkOptions, TextWatermarkOptions, ImageWatermarkOptions, PatternWatermarkOptions } from '../src/types/watermarkOptions';

/**
 * Apply the appropriate watermark (text, image, or pattern) to the page.
 * @param page Puppeteer Page object.
 * @param watermark Watermark configuration options.
 */
export const applyWatermark = async (page: Page, watermark: WatermarkOptions): Promise<void> => {
  if (watermark.text) {
    await applyTextWatermark(page, watermark.text);
  } else if (watermark.image) {
    await applyImageWatermark(page, watermark.image);
  } else if (watermark.pattern) {
    await applyPatternWatermark(page, watermark.pattern);
  }
};

const applyTextWatermark = async (page: Page, options: TextWatermarkOptions): Promise<void> => {
  const { text, fontSize = 40, color = 'rgba(0, 0, 0, 0.1)', opacity = 0.1, position = 'center', rotation = 45 } = options;

  await page.addStyleTag({
    content: `
      body::before {
        content: '${text}';
        font-size: ${fontSize}px;
        color: ${color};
        opacity: ${opacity};
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(${rotation}deg);
        z-index: -1;
      }
    `
  });

  await adjustWatermarkPosition(page, position);
};

const applyImageWatermark = async (page: Page, options: ImageWatermarkOptions): Promise<void> => {
  const { imageUrl, width = 200, height = 200, opacity = 0.1, position = 'center' } = options;

  await page.addStyleTag({
    content: `
      body::before {
        content: '';
        background-image: url('${imageUrl}');
        background-size: ${width}px ${height}px;
        background-repeat: ${position === 'tiled' ? 'repeat' : 'no-repeat'};
        opacity: ${opacity};
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
      }
    `
  });

  await adjustWatermarkPosition(page, position);
};

const applyPatternWatermark = async (page: Page, options: PatternWatermarkOptions): Promise<void> => {
  const { type, color = 'rgba(0, 0, 0, 0.1)', thickness = 1, opacity = 0.1, spacing = 20 } = options;

  if (type === 'grid') {
    await page.addStyleTag({
      content: `
        body::before {
          content: '';
          background: repeating-linear-gradient(
            0deg, 
            ${color} ${thickness}px, 
            transparent ${thickness + spacing}px
          ), repeating-linear-gradient(
            90deg, 
            ${color} ${thickness}px, 
            transparent ${thickness + spacing}px
          );
          opacity: ${opacity};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
      `
    });
  } else if (type === 'diagonalLines') {
    await page.addStyleTag({
      content: `
        body::before {
          content: '';
          background: repeating-linear-gradient(
            45deg, 
            ${color} ${thickness}px, 
            transparent ${thickness + spacing}px
          );
          opacity: ${opacity};
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
      `
    });
  }
};

const adjustWatermarkPosition = async (page: Page, position: string) => {
  switch (position) {
    case 'top':
      await page.evaluate(() => {
        document.body.style.setProperty('top', '10%');
        document.body.style.setProperty('left', '50%');
        document.body.style.setProperty('transform', 'translateX(-50%)');
      });
      break;
    case 'bottom':
      await page.evaluate(() => {
        document.body.style.setProperty('top', '90%');
        document.body.style.setProperty('left', '50%');
        document.body.style.setProperty('transform', 'translateX(-50%)');
      });
      break;
    case 'left':
      await page.evaluate(() => {
        document.body.style.setProperty('top', '50%');
        document.body.style.setProperty('left', '10%');
        document.body.style.setProperty('transform', 'translateY(-50%)');
      });
      break;
    case 'right':
      await page.evaluate(() => {
        document.body.style.setProperty('top', '50%');
        document.body.style.setProperty('left', '90%');
        document.body.style.setProperty('transform', 'translateY(-50%)');
      });
      break;
    default:
      break;
  }
};
