# pdf-forge

**pdf-forge** is a powerful Node.js package that generates customizable PDFs from HTML/CSS with ease. Whether you need headers, footers, watermarks, or advanced styling, pdf-forge gives you the flexibility to create professional documents programmatically.

## Features
- Generate PDFs using HTML/CSS templates
- Customizable headers and footers
- Text, image, and pattern-based watermarks
- Image optimization for reducing PDF size
- Password protection and encryption for PDFs
- Templating system with Handlebars for dynamic content

## Installation

```bash
npm install pdf-forge
```

## Usage

```typescript
import { PDFGenerator } from 'pdf-forge';
import fs from 'fs/promises';

const pdfGenerator = new PDFGenerator();

const pdfBuffer = await pdfGenerator.generatePDF('./templates/sampleTemplate.html', { title: 'Hello', content: 'World' }, {
  watermark: {
    text: {
      text: 'Confidential',
      fontSize: 50,
      opacity: 0.1,
      rotation: 45
    }
  },
  headerTemplate: '<div style="text-align: center;">Custom Header</div>',
  footerTemplate: '<div style="text-align: center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
  pageSize: 'A4',
  margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
});

await fs.writeFile('output/sample.pdf', pdfBuffer);
```

### Watermark Options
You can apply different types of watermarks:

1. **Text Watermark**:
```typescript
watermark: {
  text: {
    text: 'Confidential',
    fontSize: 50,
    opacity: 0.1,
    rotation: 45
  }
}
```

2. **Image Watermark**:
```typescript
watermark: {
  image: {
    imageUrl: 'https://example.com/watermark.png',
    width: 200,
    height: 200,
    opacity: 0.2,
    position: 'center'
  }
}
```

3. **Pattern Watermark** (e.g., grid or diagonal lines):
```typescript
watermark: {
  pattern: {
    type: 'grid',
    color: 'rgba(0, 0, 0, 0.1)',
    thickness: 1,
    spacing: 20
  }
}
```

### Header and Footer Customization
You can customize headers and footers by passing HTML as the template:
```typescript
headerTemplate: '<div style="text-align: center;">My Custom Header</div>',
footerTemplate: '<div style="text-align: center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
```

### PDF Options
```typescript
{
  headerTemplate?: string; // Custom header HTML
  footerTemplate?: string; // Custom footer HTML
  displayHeaderFooter?: boolean; // Whether to display headers and footers
  firstPageHeaderOnly?: boolean; // Header only on the first page
  topMarginSecondPage?: string; // Top margin starting from second page
  pageSize?: 'Letter' | 'A4' | 'Legal' | string; // Page size
  margin?: { top: string, bottom: string, left: string, right: string }; // Page margins
  scale?: number; // Scale of the page rendering
  landscape?: boolean; // Render the PDF in landscape mode
  printBackground?: boolean; // Include background graphics
  preferCSSPageSize?: boolean; // Use CSS-defined page sizes
  watermark?: WatermarkOptions; // Watermark configurations
  password?: string; // Password for the generated PDF
}
```

## Running Tests

```bash
npm run test
```

## License

This project is licensed under the MIT License.
