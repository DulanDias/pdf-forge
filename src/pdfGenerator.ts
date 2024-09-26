import puppeteer, { PaperFormat } from 'puppeteer';
import fs from 'fs/promises';
import { PDFOptions } from './types/pdfOptions';
import { compileTemplate } from './utils/templating';
import { optimizeImages } from './utils/imageOptimizer';
import { applyWatermark } from './utils/watermark';
// import { addPasswordProtection } from '../utils/security'; @TODO
import { Hooks } from './types/hooks';

/**
 * PDFGenerator class that handles the creation of PDFs
 * with advanced options like headers, footers, watermarks, and more.
 */
export class PDFGenerator {
    private hooks?: Hooks;

    /**
     * Constructor to initialize the generator with optional hooks.
     * @param hooks Optional hooks for pre/post processing.
     */
    constructor(hooks?: Hooks) {
        this.hooks = hooks;
    }

    /**
     * Generate a PDF from an HTML template with custom options.
     * @param templatePath Path to the HTML template file.
     * @param templateData Data to be injected into the template.
     * @param options Configuration options for the PDF.
     * @returns A promise that resolves to a Buffer containing the PDF data.
     */
    async generatePDF(templatePath: string, templateData: object, options: PDFOptions): Promise<Buffer> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        let compiledHtml: string;

        // Check if the templatePath is an HTML file path or direct HTML string
        if (templatePath.endsWith('.html')) {
            const templateContent = await fs.readFile(templatePath, 'utf8');
            compiledHtml = compileTemplate(templateContent, templateData);
        } else {
            // Direct HTML string
            compiledHtml = templatePath;
        }

        // Pre-processing hook
        if (this.hooks?.beforeRender) {
            compiledHtml = this.hooks.beforeRender(compiledHtml, options);
        }

        // Load the HTML content into Puppeteer
        await page.setContent(compiledHtml, { waitUntil: 'networkidle0' });

        // Optimize images within the HTML
        await optimizeImages(page);

        // Apply watermark if specified
        if (options.watermark) {
            await applyWatermark(page, options.watermark);
        }

        // Add conditional CSS for the first page header only
        let headerTemplate = options.headerTemplate || '';
        if (options.firstPageHeaderOnly) {
            headerTemplate = `
      <div style="width: 100%; text-align: center;">
        <style>
          .first-page-header { display: block; }
          .pageNumber:not(:first-child) .first-page-header { display: none; }
        </style>
        <div class="first-page-header">
          ${options.headerTemplate}
        </div>
      </div>
    `;
        }

        // Generate the PDF with the provided options
        let pdfBuffer = await page.pdf({
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
        if (this.hooks?.afterRender) {
            pdfBuffer = this.hooks.afterRender(Buffer.from(pdfBuffer), options);
        }

        // Add password protection if required @TODO
        // if (options.password) {
        //   pdfBuffer = await addPasswordProtection(pdfBuffer, options.password);
        // }

        await browser.close();
        return Buffer.from(pdfBuffer);
    }
}
