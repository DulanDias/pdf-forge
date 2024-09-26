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
exports.PDFGenerator = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const promises_1 = __importDefault(require("fs/promises"));
const templating_1 = require("./utils/templating");
const imageOptimizer_1 = require("./utils/imageOptimizer");
const watermark_1 = require("./utils/watermark");
/**
 * PDFGenerator class that handles the creation of PDFs
 * with advanced options like headers, footers, watermarks, and more.
 */
class PDFGenerator {
    /**
     * Constructor to initialize the generator with optional hooks.
     * @param hooks Optional hooks for pre/post processing.
     */
    constructor(hooks) {
        this.hooks = hooks;
    }
    /**
     * Generate a PDF from an HTML template with custom options.
     * @param templatePath Path to the HTML template file.
     * @param templateData Data to be injected into the template.
     * @param options Configuration options for the PDF.
     * @returns A promise that resolves to a Buffer containing the PDF data.
     */
    generatePDF(templatePath, templateData, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            // Read and compile the template
            let templateContent = yield promises_1.default.readFile(templatePath, 'utf8');
            const compiledHtml = (0, templating_1.compileTemplate)(templateContent, templateData);
            // Pre-processing hook
            if ((_a = this.hooks) === null || _a === void 0 ? void 0 : _a.beforeRender) {
                templateContent = this.hooks.beforeRender(compiledHtml, options);
            }
            // Load the HTML content into Puppeteer
            yield page.setContent(compiledHtml, { waitUntil: 'networkidle0' });
            // Optimize images within the HTML
            yield (0, imageOptimizer_1.optimizeImages)(page);
            // Apply watermark if specified
            if (options.watermark) {
                yield (0, watermark_1.applyWatermark)(page, options.watermark);
            }
            // Generate the PDF with the provided options
            let pdfBuffer = yield page.pdf({
                format: options.pageSize || 'A4',
                displayHeaderFooter: options.displayHeaderFooter || false,
                headerTemplate: options.headerTemplate || '',
                footerTemplate: options.footerTemplate || '',
                margin: options.margin || { top: '1in', bottom: '1in', left: '1in', right: '1in' },
                scale: options.scale || 1,
                landscape: options.landscape || false,
                printBackground: options.printBackground || false,
                preferCSSPageSize: options.preferCSSPageSize || false,
                pageRanges: options.pageRanges || '',
            });
            // Convert Uint8Array to Buffer (required for Node.js compatibility)
            pdfBuffer = Buffer.from(pdfBuffer);
            // Post-processing hook
            if ((_b = this.hooks) === null || _b === void 0 ? void 0 : _b.afterRender) {
                pdfBuffer = this.hooks.afterRender(Buffer.from(pdfBuffer), options);
            }
            // Add password protection if required @TODO
            // if (options.password) {
            //   pdfBuffer = await addPasswordProtection(pdfBuffer, options.password);
            // }
            yield browser.close();
            return Buffer.from(pdfBuffer);
        });
    }
}
exports.PDFGenerator = PDFGenerator;
