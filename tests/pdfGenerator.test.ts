import { PDFGenerator } from '../src/pdfGenerator';
import fs from 'fs/promises';

describe('PDFGenerator', () => {
  let pdfGenerator: PDFGenerator;

  beforeAll(() => {
    pdfGenerator = new PDFGenerator();
  });

  it('should generate a PDF with the correct content', async () => {
    const templatePath = './src/templates/sampleTemplate.html';
    const templateData = { title: 'Test Title', content: 'This is a test content.' };
    const pdfBuffer = await pdfGenerator.generatePDF(templatePath, templateData, {});

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);

    // Optional: save the PDF to a file to visually inspect the output
    await fs.writeFile('output/test.pdf', pdfBuffer);
  });

  it('should apply a watermark correctly', async () => {
    const templatePath = './src/templates/sampleTemplate.html';
    const templateData = { title: 'Watermark Test', content: 'This PDF contains a watermark.' };
    const pdfBuffer = await pdfGenerator.generatePDF(templatePath, templateData, {
      watermark: { text: { text: 'Confidential', opacity: 0.2, rotation: 45 } }
    });

    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);

    // Optional: save the PDF with the watermark to inspect
    await fs.writeFile('output/watermark_test.pdf', pdfBuffer);
  });
});
