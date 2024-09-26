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

### Example 1: Generate PDFs using HTML/CSS, RichText

```typescript
import { PDFGenerator } from 'pdf-forge';
import fs from 'fs/promises';

const pdfGenerator = new PDFGenerator();

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        h1 {
            color: #333;
        }
        p {
            font-size: 14px;
        }
    </style>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a PDF generated with rich HTML content, including CSS styling.</p>
</body>
</html>
`;

const pdfBuffer = await pdfGenerator.generatePDF(htmlContent, {}, {
  pageSize: 'A4'
});

await fs.writeFile('output/richText.pdf', pdfBuffer);
```

### Example 2: Include headers and footers, apply header only to the first page

```typescript
const headerHtml = `
  <div style="font-size: 12px; text-align: center;">
    First Page Header
  </div>
`;

const footerHtml = `
  <div style="font-size: 10px; text-align: center;">
    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </div>
`;

const pdfBuffer = await pdfGenerator.generatePDF(htmlContent, {}, {
  headerTemplate: headerHtml,
  footerTemplate: footerHtml,
  displayHeaderFooter: true,
  firstPageHeaderOnly: true,  // Show header only on the first page
  pageSize: 'A4'
});

await fs.writeFile('output/headerFooterFirstPageOnly.pdf', pdfBuffer);
```

### Example 3: Apply top margin from second page onwards

```typescript
const pdfBuffer = await pdfGenerator.generatePDF(htmlContent, {}, {
  headerTemplate: headerHtml,
  footerTemplate: footerHtml,
  displayHeaderFooter: true,
  firstPageHeaderOnly: true,
  topMarginSecondPage: '2in',  // Apply top margin from the second page onwards
  pageSize: 'A4'
});

await fs.writeFile('output/topMarginSecondPage.pdf', pdfBuffer);
```

### Example 4: Place page breaks appropriately

```typescript
const htmlWithPageBreaks = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <h1>Page 1</h1>
    <p>Content for the first page.</p>

    <div class="page-break"></div>

    <h1>Page 2</h1>
    <p>Content for the second page.</p>
</body>
</html>
`;

const pdfBuffer = await pdfGenerator.generatePDF(htmlWithPageBreaks, {}, {
  pageSize: 'A4'
});

await fs.writeFile('output/pageBreaks.pdf', pdfBuffer);
```

### Example 5: Configurable page size, margins, etc.

```typescript
const pdfBuffer = await pdfGenerator.generatePDF(htmlContent, {}, {
  pageSize: 'Letter',
  margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' },
  landscape: true,
});

await fs.writeFile('output/customPageSetup.pdf', pdfBuffer);
```

### Example 6: Support fonts, advanced styling, and tables

```typescript
const htmlWithFontsAndTables = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: 'Times New Roman', serif;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 8px;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>Styled PDF with Fonts and Tables</h1>
    <p>This PDF contains custom fonts and a styled table:</p>
    <table>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
        </tr>
        <tr>
            <td>Row 1, Cell 1</td>
            <td>Row 1, Cell 2</td>
        </tr>
        <tr>
            <td>Row 2, Cell 1</td>
            <td>Row 2, Cell 2</td>
        </tr>
    </table>
</body>
</html>
`;

const pdfBuffer = await pdfGenerator.generatePDF(htmlWithFontsAndTables, {}, {
  pageSize: 'A4'
});

await fs.writeFile('output/fontsAndTables.pdf', pdfBuffer);
```

### Example 7: Configurable headers and footers with images, rich text, and SVG

```typescript
const headerWithImageAndSvg = `
  <div style="text-align: center;">
    <img src="https://example.com/logo.png" width="100" />
    <svg height="50" width="200">
      <rect width="200" height="50" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" />
    </svg>
  </div>
`;

const pdfBuffer = await pdfGenerator.generatePDF(htmlContent, {}, {
  headerTemplate: headerWithImageAndSvg,
  footerTemplate: footerHtml,
  displayHeaderFooter: true,
  pageSize: 'A4'
});

await fs.writeFile('output/headerWithImageAndSvg.pdf', pdfBuffer);
```

### Example 8: Support for overlays and watermarks

```typescript
const pdfBuffer = await pdfGenerator.generatePDF(htmlContent, {}, {
  watermark: {
    text: {
      text: 'Confidential',
      fontSize: 60,
      color: 'rgba(255, 0, 0, 0.3)',
      rotation: 45
    }
  },
  pageSize: 'A4'
});

await fs.writeFile('output/watermark.pdf', pdfBuffer);
```

## Running Tests

```bash
npm run test
```

## License

This project is licensed under the MIT License.
