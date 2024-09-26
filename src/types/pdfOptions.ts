import { WatermarkOptions } from '../types/watermarkOptions';
import puppeteer from 'puppeteer';

/**
 * Interface for configuring the options used to generate a PDF.
 */
export interface PDFOptions {
  headerTemplate?: string; // Custom header HTML
  footerTemplate?: string; // Custom footer HTML
  displayHeaderFooter?: boolean; // Display headers and footers
  firstPageHeaderOnly?: boolean; // Show header on the first page only
  topMarginSecondPage?: string; // Top margin from second page onward
  pageSize?: 'Letter' | 'A4' | 'Legal' | string; // Page size (A4, Letter, etc.)
  margin?: puppeteer.PDFMargin; // Margins for the PDF
  scale?: number; // Scale factor for the PDF content
  landscape?: boolean; // Landscape mode
  printBackground?: boolean; // Print background graphics
  preferCSSPageSize?: boolean; // Use CSS-defined page sizes
  path?: string; // Path to save the PDF (optional)
  timeout?: number; // Timeout for rendering
  watermark?: WatermarkOptions; // Watermark options
  fonts?: string[]; // Custom fonts to be loaded
  pageRanges?: string; // Page ranges to print (e.g., '1-3,5')
  password?: string; // Optional password for PDF encryption
}
