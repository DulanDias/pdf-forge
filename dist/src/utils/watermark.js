"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyWatermark = void 0;
/**
 * Apply the appropriate watermark (text, image, or pattern) to the page.
 * @param page Puppeteer Page object.
 * @param watermark Watermark configuration options.
 */
const applyWatermark = (page, watermark) => __awaiter(void 0, void 0, void 0, function* () {
    if (watermark.text) {
        yield applyTextWatermark(page, watermark.text);
    }
    else if (watermark.image) {
        yield applyImageWatermark(page, watermark.image);
    }
    else if (watermark.pattern) {
        yield applyPatternWatermark(page, watermark.pattern);
    }
});
exports.applyWatermark = applyWatermark;
const applyTextWatermark = (page, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, fontSize = 40, color = 'rgba(0, 0, 0, 0.1)', opacity = 0.1, position = 'center', rotation = 45 } = options;
    yield page.addStyleTag({
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
    yield adjustWatermarkPosition(page, position);
});
const applyImageWatermark = (page, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageUrl, width = 200, height = 200, opacity = 0.1, position = 'center' } = options;
    yield page.addStyleTag({
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
    yield adjustWatermarkPosition(page, position);
});
const applyPatternWatermark = (page, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, color = 'rgba(0, 0, 0, 0.1)', thickness = 1, opacity = 0.1, spacing = 20 } = options;
    if (type === 'grid') {
        yield page.addStyleTag({
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
    }
    else if (type === 'diagonalLines') {
        yield page.addStyleTag({
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
});
const adjustWatermarkPosition = (page, position) => __awaiter(void 0, void 0, void 0, function* () {
    switch (position) {
        case 'top':
            yield page.evaluate(() => {
                document.body.style.setProperty('top', '10%');
                document.body.style.setProperty('left', '50%');
                document.body.style.setProperty('transform', 'translateX(-50%)');
            });
            break;
        case 'bottom':
            yield page.evaluate(() => {
                document.body.style.setProperty('top', '90%');
                document.body.style.setProperty('left', '50%');
                document.body.style.setProperty('transform', 'translateX(-50%)');
            });
            break;
        case 'left':
            yield page.evaluate(() => {
                document.body.style.setProperty('top', '50%');
                document.body.style.setProperty('left', '10%');
                document.body.style.setProperty('transform', 'translateY(-50%)');
            });
            break;
        case 'right':
            yield page.evaluate(() => {
                document.body.style.setProperty('top', '50%');
                document.body.style.setProperty('left', '90%');
                document.body.style.setProperty('transform', 'translateY(-50%)');
            });
            break;
        default:
            break;
    }
});
