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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizeImages = void 0;
const sharp_1 = __importDefault(require("sharp"));
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Optimize images in the HTML content to reduce size and improve performance.
 * @param page Puppeteer Page object.
 */
const optimizeImages = (page) => __awaiter(void 0, void 0, void 0, function* () {
    // Use type assertion to cast elements as HTMLImageElement
    const images = yield page.$$eval('img', imgs => imgs.map(img => img.src));
    for (let src of images) {
        if (src.startsWith('http')) {
            const optimizedImage = yield downloadAndOptimizeImage(src);
            yield page.evaluate((oldSrc, newSrc) => {
                var _a;
                (_a = document.querySelector(`img[src="${oldSrc}"]`)) === null || _a === void 0 ? void 0 : _a.setAttribute('src', newSrc);
            }, src, optimizedImage);
        }
        else {
            const imageBuffer = yield (0, sharp_1.default)(src).jpeg({ quality: 80 }).toBuffer();
            const dataUri = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
            yield page.evaluate((oldSrc, newSrc) => {
                var _a;
                (_a = document.querySelector(`img[src="${oldSrc}"]`)) === null || _a === void 0 ? void 0 : _a.setAttribute('src', newSrc);
            }, src, dataUri);
        }
    }
});
exports.optimizeImages = optimizeImages;
/**
 * Downloads and optimizes an image from a URL.
 * @param url The URL of the image.
 * @returns The optimized image as a base64 data URI.
 */
function downloadAndOptimizeImage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, node_fetch_1.default)(url);
        const buffer = yield response.buffer();
        const optimizedImageBuffer = yield (0, sharp_1.default)(buffer).jpeg({ quality: 80 }).toBuffer();
        return `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
    });
}
