import { PDFOptions } from './pdfOptions';

/**
 * Hooks for customizing the behavior before or after rendering the PDF.
 */
export interface Hooks {
  /**
   * Hook to manipulate HTML content before the PDF is rendered.
   * @param html The compiled HTML content.
   * @param options The current PDF options.
   * @returns The modified HTML content.
   */
  beforeRender?: (html: string, options: PDFOptions) => string;

  /**
   * Hook to manipulate the PDF buffer after it is generated.
   * @param pdfBuffer The generated PDF buffer.
   * @param options The current PDF options.
   * @returns The modified PDF buffer.
   */
  afterRender?: (pdfBuffer: Buffer, options: PDFOptions) => Buffer;
}
