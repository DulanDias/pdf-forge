import puppeteer, { PaperFormat } from 'puppeteer';
import fs from 'fs/promises';
import { PDFOptions } from './types/pdfOptions';
import { compileTemplate } from '../utils/templating';
import { optimizeImages } from '../utils/imageOptimizer';
import { applyWatermark } from '../utils/watermark';
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

    // Read and compile the template
    let templateContent = await fs.readFile(templatePath, 'utf8');
    const compiledHtml = compileTemplate(templateContent, templateData);

    // Pre-processing hook
    if (this.hooks?.beforeRender) {
      templateContent = this.hooks.beforeRender(compiledHtml, options);
    }

    // Load the HTML content into Puppeteer
    await page.setContent(compiledHtml, { waitUntil: 'networkidle0' });

    // Optimize images within the HTML
    await optimizeImages(page);

    // Apply watermark if specified
    if (options.watermark) {
      await applyWatermark(page, options.watermark);
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

    // Post-processing hook
    if (this.hooks?.afterRender) {
      pdfBuffer = this.hooks.afterRender(pdfBuffer, options);
    }

    // Add password protection if required @TODO
    // if (options.password) {
    //   pdfBuffer = await addPasswordProtection(pdfBuffer, options.password);
    // }

    await browser.close();
    return pdfBuffer;
  }
}
